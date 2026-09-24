package Agropacayales.valleGrande.config;

import Agropacayales.valleGrande.model.*;
import Agropacayales.valleGrande.repository.mongo.*;
import Agropacayales.valleGrande.repository.r2dbc.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final DatabaseClient databaseClient;
    private final UsuarioRepository usuarioRepository;
    private final ParcelaRepository parcelaRepository;
    private final InsumoRepository insumoRepository;
    private final FichaCampoRepository fichaCampoRepository;
    private final MovimientoInsumoRepository movimientoInsumoRepository;
    private final CultivoRepository cultivoRepository;
    private final ActividadCultivoRepository actividadRepository;
    private final AsignacionCabeceraRepository asignacionRepository;
    private final HarvestRepository harvestRepository;

    @Override
    public void run(String... args) {
        log.info("Inicializando esquemas SQL R2DBC y semillas de datos Políglotas (MongoDB + SQL)...");

        initSqlTables()
                .then(seedMongoData())
                .then(seedSqlData())
                .subscribe(
                        null,
                        err -> log.error("Error inicializando datos de la aplicación: {}", err.getMessage()),
                        () -> log.info("¡Inicialización de datos políglotas finalizada con éxito!")
                );
    }

    private Mono<Void> initSqlTables() {
        String createCultivos = """
            CREATE TABLE IF NOT EXISTS cultivos (
                id_cultivo BIGINT AUTO_INCREMENT PRIMARY KEY,
                id_parcela VARCHAR(50),
                nombre VARCHAR(100),
                tipo_cultivo VARCHAR(80),
                frecuencia_riego_dias INT,
                temperatura_ideal DECIMAL(5,2),
                fecha_siembra DATE,
                requiere_sombra BOOLEAN DEFAULT FALSE,
                observaciones TEXT,
                estado BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP
            );
        """;

        String createActividades = """
            CREATE TABLE IF NOT EXISTS actividad_cultivo (
                id_actividad BIGINT AUTO_INCREMENT PRIMARY KEY,
                id_cultivo BIGINT,
                tipo_actividad VARCHAR(50),
                descripcion TEXT,
                fecha_actividad TIMESTAMP,
                costo_total DECIMAL(10,2),
                estado BOOLEAN DEFAULT TRUE,
                completado BOOLEAN DEFAULT FALSE
            );
        """;

        String createDetalleActividad = """
            CREATE TABLE IF NOT EXISTS detalle_actividad (
                id_detalle BIGINT AUTO_INCREMENT PRIMARY KEY,
                id_actividad BIGINT,
                id_insumo VARCHAR(50),
                cantidad INT,
                precio_unitario DECIMAL(10,2),
                subtotal DECIMAL(10,2)
            );
        """;

        String createAsignacionCab = """
            CREATE TABLE IF NOT EXISTS asignacion_cabecera (
                id_asignacion_cabecera BIGINT AUTO_INCREMENT PRIMARY KEY,
                id_actividad BIGINT,
                fecha_asignacion TIMESTAMP,
                horas_trabajadas DECIMAL(5,2),
                costo_total_mano_obra DECIMAL(10,2),
                observacion TEXT,
                estado BOOLEAN DEFAULT TRUE
            );
        """;

        String createAsignacionDet = """
            CREATE TABLE IF NOT EXISTS asignacion_detalle (
                id_asignacion_detalle BIGINT AUTO_INCREMENT PRIMARY KEY,
                id_asignacion_cabecera BIGINT,
                id_usuario VARCHAR(50),
                costo_mano_obra DECIMAL(10,2)
            );
        """;

        String createHarvest = """
            CREATE TABLE IF NOT EXISTS harvest (
                id_harvest BIGINT AUTO_INCREMENT PRIMARY KEY,
                responsable VARCHAR(100),
                fecha_cosecha DATE,
                estado BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP
            );
        """;

        String createHarvestDetail = """
            CREATE TABLE IF NOT EXISTS harvest_planting_cycle (
                id_harvest_detail BIGINT AUTO_INCREMENT PRIMARY KEY,
                id_harvest BIGINT,
                id_cultivo BIGINT,
                kilos_optimos DECIMAL(10,2),
                kilos_merma DECIMAL(10,2)
            );
        """;

        return databaseClient.sql(createCultivos).then()
                .then(databaseClient.sql(createActividades).then())
                .then(databaseClient.sql(createDetalleActividad).then())
                .then(databaseClient.sql(createAsignacionCab).then())
                .then(databaseClient.sql(createAsignacionDet).then())
                .then(databaseClient.sql(createHarvest).then())
                .then(databaseClient.sql(createHarvestDetail).then());
    }

    private Mono<Void> seedMongoData() {
        return usuarioRepository.count()
                .flatMap(count -> {
                    if (count == 0) {
                        log.info("Sembrando usuarios en MongoDB...");
                        Usuario u1 = Usuario.builder()
                                .nombre("Hugo").apellido("Fernandez")
                                .correo("hugo.fernandez@agropacayales.com")
                                .password("ClaveHugo123").rol("ADMIN")
                                .fechaNacimiento(LocalDate.of(1995, 4, 12))
                                .fechaContratacion(LocalDate.of(2026, 1, 10))
                                .estado(true).createdAt(LocalDateTime.now()).build();

                        Usuario u2 = Usuario.builder()
                                .nombre("Ana").apellido("Felix")
                                .correo("ana.felix@agropacayales.com")
                                .password("ClaveAna123").rol("SUPERVISOR")
                                .fechaNacimiento(LocalDate.of(1997, 8, 25))
                                .fechaContratacion(LocalDate.of(2026, 2, 15))
                                .estado(true).createdAt(LocalDateTime.now()).build();

                        Usuario u3 = Usuario.builder()
                                .nombre("Axel").apellido("Huapaya")
                                .correo("axel.huapaya@agropacayales.com")
                                .password("ClaveAxel123").rol("OPERADOR")
                                .fechaNacimiento(LocalDate.of(1998, 11, 3))
                                .fechaContratacion(LocalDate.of(2026, 3, 1))
                                .estado(true).createdAt(LocalDateTime.now()).build();

                        return usuarioRepository.save(u1).then(usuarioRepository.save(u2)).then(usuarioRepository.save(u3)).then();
                    }
                    return Mono.empty();
                })
                .then(parcelaRepository.count())
                .flatMap(count -> {
                    if (count == 0) {
                        log.info("Sembrando parcelas en MongoDB...");
                        Parcela p1 = Parcela.builder()
                                .nombre("Lote A - Valle Norte").ubicacion("Sector Norte, Km 5")
                                .areaHectareas(BigDecimal.valueOf(4.5)).tipoSuelo("Arcilloso")
                                .responsable("Ana Felix").estadoRiego("Goteo")
                                .fechaUltimaSiembra(LocalDate.of(2026, 3, 10))
                                .produccionEstimada("8000 kg").cultivoActual("Maíz Híbrido")
                                .enUso(true).estado(true).createdAt(LocalDateTime.now()).build();

                        Parcela p2 = Parcela.builder()
                                .nombre("Lote B - La Ladera").ubicacion("Sector Sur, Zona Alta")
                                .areaHectareas(BigDecimal.valueOf(2.0)).tipoSuelo("Arenoso")
                                .responsable("Axel Huapaya").estadoRiego("Aspersión")
                                .fechaUltimaSiembra(LocalDate.of(2026, 4, 1))
                                .produccionEstimada("3500 kg").cultivoActual("Papa Yungay")
                                .enUso(true).estado(true).createdAt(LocalDateTime.now()).build();

                        return parcelaRepository.save(p1).then(parcelaRepository.save(p2)).then();
                    }
                    return Mono.empty();
                })
                .then(insumoRepository.count())
                .flatMap(count -> {
                    if (count == 0) {
                        log.info("Sembrando insumos en MongoDB...");
                        Insumo i1 = Insumo.builder().nombre("Fertilizante NPK").descripcion("Rico en nitrógeno y fósforo").precio(BigDecimal.valueOf(45.00)).stock(100).unidadMedida("kg").tipoInsumo("FERTILIZANTE").proveedor("AgroQuímica S.A.").presentacion("Saco 50kg").estado(true).build();
                        Insumo i2 = Insumo.builder().nombre("Urea Granulada").descripcion("Concentrado de nitrógeno").precio(BigDecimal.valueOf(35.00)).stock(120).unidadMedida("kg").tipoInsumo("FERTILIZANTE").proveedor("Abonos del Sur").presentacion("Saco 50kg").estado(true).build();
                        Insumo i3 = Insumo.builder().nombre("Herbicida Orgánico").descripcion("Sin residuos tóxicos").precio(BigDecimal.valueOf(60.00)).stock(30).unidadMedida("litro").tipoInsumo("HERBICIDA").proveedor("BioCrops").presentacion("Galón 5L").estado(true).build();
                        return insumoRepository.save(i1).then(insumoRepository.save(i2)).then(insumoRepository.save(i3)).then();
                    }
                    return Mono.empty();
                });
    }

    private Mono<Void> seedSqlData() {
        return cultivoRepository.count()
                .flatMap(count -> {
                    if (count == 0) {
                        log.info("Sembrando cultivos en SQL R2DBC...");
                        Cultivo c1 = Cultivo.builder()
                                .idParcela("lote-a")
                                .nombre("Maíz Primavera")
                                .tipoCultivo("Maíz")
                                .frecuenciaRiegoDias(4)
                                .temperaturaIdeal(BigDecimal.valueOf(25.0))
                                .fechaSiembra(LocalDate.of(2026, 3, 10))
                                .requiereSombra(false)
                                .observaciones("Desarrollo vegetal óptimo")
                                .estado(true)
                                .createdAt(LocalDateTime.now())
                                .build();

                        Cultivo c2 = Cultivo.builder()
                                .idParcela("lote-b")
                                .nombre("Papa Invierno")
                                .tipoCultivo("Papa")
                                .frecuenciaRiegoDias(6)
                                .temperaturaIdeal(BigDecimal.valueOf(18.0))
                                .fechaSiembra(LocalDate.of(2026, 4, 1))
                                .requiereSombra(false)
                                .observaciones("Variedad Yungay comercial")
                                .estado(true)
                                .createdAt(LocalDateTime.now())
                                .build();

                        return cultivoRepository.save(c1).then(cultivoRepository.save(c2)).then();
                    }
                    return Mono.empty();
                })
                .then(harvestRepository.count())
                .flatMap(count -> {
                    if (count == 0) {
                        log.info("Sembrando cosechas en SQL R2DBC...");
                        Harvest h1 = Harvest.builder()
                                .responsable("Ana Felix")
                                .fechaCosecha(LocalDate.of(2026, 6, 1))
                                .estado(true)
                                .createdAt(LocalDateTime.now())
                                .build();

                        return harvestRepository.save(h1).then();
                    }
                    return Mono.empty();
                });
    }
}
