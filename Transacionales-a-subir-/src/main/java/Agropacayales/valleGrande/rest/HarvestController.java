package Agropacayales.valleGrande.rest;

import Agropacayales.valleGrande.model.Harvest;
import Agropacayales.valleGrande.model.HarvestPlantingCycle;
import Agropacayales.valleGrande.repository.r2dbc.HarvestPlantingCycleRepository;
import Agropacayales.valleGrande.repository.r2dbc.HarvestRepository;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping({"/api/harvest", "/api/cosechas"})
@RequiredArgsConstructor
@Tag(name = "Harvest-Controller", description = "Gestión de cosechas, kilos óptimos y merma (SQL R2DBC)")
public class HarvestController {

    private final HarvestRepository harvestRepository;
    private final HarvestPlantingCycleRepository detailRepository;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HarvestDTO {
        private Long idHarvest;
        private String responsable;
        private LocalDate fechaCosecha;
        private Boolean estado;
        private LocalDateTime createdAt;
        private List<HarvestPlantingCycle> detalles;
    }

    @GetMapping({"", "/listar"})
    @Operation(summary = "Listar todas las cosechas")
    public Flux<HarvestDTO> listarTodas() {
        return harvestRepository.findAll()
                .flatMap(h -> detailRepository.findByIdHarvest(h.getIdHarvest())
                        .collectList()
                        .map(dets -> new HarvestDTO(
                                h.getIdHarvest(),
                                h.getResponsable(),
                                h.getFechaCosecha(),
                                h.getEstado(),
                                h.getCreatedAt(),
                                dets
                        ))
                );
    }

    @GetMapping({"/buscar/{id}", "/{id}"})
    @Operation(summary = "Buscar cosecha por ID")
    public Mono<ResponseEntity<HarvestDTO>> obtenerPorId(@PathVariable Long id) {
        return harvestRepository.findById(id)
                .flatMap(h -> detailRepository.findByIdHarvest(h.getIdHarvest())
                        .collectList()
                        .map(dets -> new HarvestDTO(
                                h.getIdHarvest(),
                                h.getResponsable(),
                                h.getFechaCosecha(),
                                h.getEstado(),
                                h.getCreatedAt(),
                                dets
                        ))
                )
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PostMapping({"", "/registrar"})
    @Operation(summary = "Registrar nueva cosecha con detalle por cultivo")
    public Mono<ResponseEntity<HarvestDTO>> crear(@Valid @RequestBody HarvestDTO dto) {
        Harvest h = Harvest.builder()
                .responsable(dto.getResponsable())
                .fechaCosecha(dto.getFechaCosecha() != null ? dto.getFechaCosecha() : LocalDate.now())
                .estado(true)
                .createdAt(LocalDateTime.now())
                .build();

        return harvestRepository.save(h)
                .flatMap(guardada -> {
                    if (dto.getDetalles() != null && !dto.getDetalles().isEmpty()) {
                        dto.getDetalles().forEach(d -> d.setIdHarvest(guardada.getIdHarvest()));
                        return detailRepository.saveAll(dto.getDetalles())
                                .collectList()
                                .map(savedDets -> new HarvestDTO(
                                        guardada.getIdHarvest(),
                                        guardada.getResponsable(),
                                        guardada.getFechaCosecha(),
                                        guardada.getEstado(),
                                        guardada.getCreatedAt(),
                                        savedDets
                                ));
                    }
                    return Mono.just(new HarvestDTO(
                            guardada.getIdHarvest(),
                            guardada.getResponsable(),
                            guardada.getFechaCosecha(),
                            guardada.getEstado(),
                            guardada.getCreatedAt(),
                            List.of()
                    ));
                })
                .map(res -> ResponseEntity.status(HttpStatus.CREATED).body(res));
    }

    @PutMapping({"/eliminar/{id}", "/{id}/eliminar"})
    @Operation(summary = "Desactivar cosecha (Lógico)")
    public Mono<ResponseEntity<String>> eliminar(@PathVariable Long id) {
        return harvestRepository.findById(id)
                .flatMap(h -> {
                    h.setEstado(false);
                    return harvestRepository.save(h);
                })
                .map(h -> ResponseEntity.ok("Cosecha desactivada exitosamente"))
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
