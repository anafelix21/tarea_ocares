package Agropacayales.valleGrande.rest;

import Agropacayales.valleGrande.model.ActividadCultivo;
import Agropacayales.valleGrande.model.DetalleActividad;
import Agropacayales.valleGrande.repository.r2dbc.ActividadCultivoRepository;
import Agropacayales.valleGrande.repository.r2dbc.DetalleActividadRepository;
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
@RequestMapping({"/api/actividades-cultivos", "/api/actividades"})
@RequiredArgsConstructor
@Tag(name = "ActividadCultivo-Controller", description = "Labores de mantenimiento y consumo de insumos (SQL R2DBC)")
public class ActividadCultivoController {

    private final ActividadCultivoRepository actividadRepository;
    private final DetalleActividadRepository detalleRepository;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActividadDTO {
        private Long idActividad;
        private Long idCultivo;
        private String tipoActividad;
        private String descripcion;
        private LocalDateTime fechaActividad;
        private BigDecimal costoTotal;
        private Boolean estado;
        private Boolean completado;
        private List<DetalleActividad> detalles;
    }

    @GetMapping
    @Operation(summary = "Listar todas las actividades")
    public Flux<ActividadDTO> listarTodas() {
        return actividadRepository.findAll()
                .flatMap(act -> detalleRepository.findByIdActividad(act.getIdActividad())
                        .collectList()
                        .map(dets -> new ActividadDTO(
                                act.getIdActividad(),
                                act.getIdCultivo(),
                                act.getTipoActividad(),
                                act.getDescripcion(),
                                act.getFechaActividad(),
                                act.getCostoTotal(),
                                act.getEstado(),
                                act.getCompletado(),
                                dets
                        ))
                );
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar actividad por ID")
    public Mono<ResponseEntity<ActividadDTO>> listarPorId(@PathVariable Long id) {
        return actividadRepository.findById(id)
                .flatMap(act -> detalleRepository.findByIdActividad(act.getIdActividad())
                        .collectList()
                        .map(dets -> new ActividadDTO(
                                act.getIdActividad(),
                                act.getIdCultivo(),
                                act.getTipoActividad(),
                                act.getDescripcion(),
                                act.getFechaActividad(),
                                act.getCostoTotal(),
                                act.getEstado(),
                                act.getCompletado(),
                                dets
                        ))
                )
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/estado/{estado}")
    @Operation(summary = "Filtrar actividades por estado")
    public Flux<ActividadCultivo> listarPorEstado(@PathVariable Boolean estado) {
        return actividadRepository.findByEstado(estado);
    }

    @PostMapping
    @Operation(summary = "Crear nueva actividad con detalles de insumos")
    public Mono<ResponseEntity<ActividadDTO>> crear(@Valid @RequestBody ActividadDTO dto) {
        ActividadCultivo act = ActividadCultivo.builder()
                .idCultivo(dto.getIdCultivo())
                .tipoActividad(dto.getTipoActividad())
                .descripcion(dto.getDescripcion())
                .fechaActividad(dto.getFechaActividad() != null ? dto.getFechaActividad() : LocalDateTime.now())
                .costoTotal(dto.getCostoTotal() != null ? dto.getCostoTotal() : BigDecimal.ZERO)
                .estado(true)
                .completado(false)
                .build();

        return actividadRepository.save(act)
                .flatMap(guardada -> {
                    if (dto.getDetalles() != null && !dto.getDetalles().isEmpty()) {
                        dto.getDetalles().forEach(d -> d.setIdActividad(guardada.getIdActividad()));
                        return detalleRepository.saveAll(dto.getDetalles())
                                .collectList()
                                .map(savedDets -> new ActividadDTO(
                                        guardada.getIdActividad(),
                                        guardada.getIdCultivo(),
                                        guardada.getTipoActividad(),
                                        guardada.getDescripcion(),
                                        guardada.getFechaActividad(),
                                        guardada.getCostoTotal(),
                                        guardada.getEstado(),
                                        guardada.getCompletado(),
                                        savedDets
                                ));
                    }
                    return Mono.just(new ActividadDTO(
                            guardada.getIdActividad(),
                            guardada.getIdCultivo(),
                            guardada.getTipoActividad(),
                            guardada.getDescripcion(),
                            guardada.getFechaActividad(),
                            guardada.getCostoTotal(),
                            guardada.getEstado(),
                            guardada.getCompletado(),
                            List.of()
                    ));
                })
                .map(res -> ResponseEntity.status(HttpStatus.CREATED).body(res));
    }

    @PatchMapping("/{id}/eliminar")
    @Operation(summary = "Desactivar actividad (Lógico)")
    public Mono<ResponseEntity<ActividadCultivo>> eliminar(@PathVariable Long id) {
        return actividadRepository.findById(id)
                .flatMap(a -> {
                    a.setEstado(false);
                    return actividadRepository.save(a);
                })
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/restaurar")
    @Operation(summary = "Restaurar actividad (Lógico)")
    public Mono<ResponseEntity<ActividadCultivo>> restaurar(@PathVariable Long id) {
        return actividadRepository.findById(id)
                .flatMap(a -> {
                    a.setEstado(true);
                    return actividadRepository.save(a);
                })
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
