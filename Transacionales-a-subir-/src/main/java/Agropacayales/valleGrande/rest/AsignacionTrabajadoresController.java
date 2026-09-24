package Agropacayales.valleGrande.rest;

import Agropacayales.valleGrande.model.AsignacionCabecera;
import Agropacayales.valleGrande.model.AsignacionDetalle;
import Agropacayales.valleGrande.repository.r2dbc.AsignacionCabeceraRepository;
import Agropacayales.valleGrande.repository.r2dbc.AsignacionDetalleRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping({"/api/asignaciones-trabajadores", "/api/asignaciones"})
@RequiredArgsConstructor
@Tag(name = "AsignacionTrabajadores-Controller", description = "Asignación de mano de obra y registro de jornadas de operadores (SQL R2DBC)")
public class AsignacionTrabajadoresController {

    private final AsignacionCabeceraRepository cabeceraRepository;
    private final AsignacionDetalleRepository detalleRepository;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AsignacionDTO {
        private Long idAsignacionCabecera;
        private Long idActividad;
        private LocalDateTime fechaAsignacion;
        private BigDecimal horasTrabajadas;
        private BigDecimal costoTotalManoObra;
        private String observacion;
        private Boolean estado;
        private List<AsignacionDetalle> detalles;
    }

    @GetMapping
    @Operation(summary = "Listar todas las asignaciones de trabajadores")
    public Flux<AsignacionDTO> listarTodas() {
        return cabeceraRepository.findAll()
                .flatMap(cab -> detalleRepository.findByIdAsignacionCabecera(cab.getIdAsignacionCabecera())
                        .collectList()
                        .map(dets -> new AsignacionDTO(
                                cab.getIdAsignacionCabecera(),
                                cab.getIdActividad(),
                                cab.getFechaAsignacion(),
                                cab.getHorasTrabajadas(),
                                cab.getCostoTotalManoObra(),
                                cab.getObservacion(),
                                cab.getEstado(),
                                dets
                        ))
                );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar asignación por ID")
    public Mono<ResponseEntity<AsignacionDTO>> listarPorId(@PathVariable Long id) {
        return cabeceraRepository.findById(id)
                .flatMap(cab -> detalleRepository.findByIdAsignacionCabecera(cab.getIdAsignacionCabecera())
                        .collectList()
                        .map(dets -> new AsignacionDTO(
                                cab.getIdAsignacionCabecera(),
                                cab.getIdActividad(),
                                cab.getFechaAsignacion(),
                                cab.getHorasTrabajadas(),
                                cab.getCostoTotalManoObra(),
                                cab.getObservacion(),
                                cab.getEstado(),
                                dets
                        ))
                )
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/estado/{estado}")
    @Operation(summary = "Filtrar asignaciones por estado")
    public Flux<AsignacionCabecera> listarPorEstado(@PathVariable Boolean estado) {
        return cabeceraRepository.findByEstado(estado);
    }

    @PostMapping
    @Operation(summary = "Crear asignación de trabajadores")
    public Mono<ResponseEntity<AsignacionDTO>> crear(@Valid @RequestBody AsignacionDTO dto) {
        AsignacionCabecera cab = AsignacionCabecera.builder()
                .idActividad(dto.getIdActividad())
                .fechaAsignacion(dto.getFechaAsignacion() != null ? dto.getFechaAsignacion() : LocalDateTime.now())
                .horasTrabajadas(dto.getHorasTrabajadas() != null ? dto.getHorasTrabajadas() : BigDecimal.valueOf(8))
                .costoTotalManoObra(dto.getCostoTotalManoObra() != null ? dto.getCostoTotalManoObra() : BigDecimal.ZERO)
                .observacion(dto.getObservacion())
                .estado(true)
                .build();

        return cabeceraRepository.save(cab)
                .flatMap(guardada -> {
                    if (dto.getDetalles() != null && !dto.getDetalles().isEmpty()) {
                        dto.getDetalles().forEach(d -> d.setIdAsignacionCabecera(guardada.getIdAsignacionCabecera()));
                        return detalleRepository.saveAll(dto.getDetalles())
                                .collectList()
                                .map(savedDets -> new AsignacionDTO(
                                        guardada.getIdAsignacionCabecera(),
                                        guardada.getIdActividad(),
                                        guardada.getFechaAsignacion(),
                                        guardada.getHorasTrabajadas(),
                                        guardada.getCostoTotalManoObra(),
                                        guardada.getObservacion(),
                                        guardada.getEstado(),
                                        savedDets
                                ));
                    }
                    return Mono.just(new AsignacionDTO(
                            guardada.getIdAsignacionCabecera(),
                            guardada.getIdActividad(),
                            guardada.getFechaAsignacion(),
                            guardada.getHorasTrabajadas(),
                            guardada.getCostoTotalManoObra(),
                            guardada.getObservacion(),
                            guardada.getEstado(),
                            List.of()
                    ));
                })
                .map(res -> ResponseEntity.status(HttpStatus.CREATED).body(res));
    }

    @PatchMapping("/{id}/eliminar")
    @Operation(summary = "Desactivar asignación (Lógico)")
    public Mono<ResponseEntity<AsignacionCabecera>> eliminar(@PathVariable Long id) {
        return cabeceraRepository.findById(id)
                .flatMap(c -> {
                    c.setEstado(false);
                    return cabeceraRepository.save(c);
                })
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/restaurar")
    @Operation(summary = "Restaurar asignación (Lógico)")
    public Mono<ResponseEntity<AsignacionCabecera>> restaurar(@PathVariable Long id) {
        return cabeceraRepository.findById(id)
                .flatMap(c -> {
                    c.setEstado(true);
                    return cabeceraRepository.save(c);
                })
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
