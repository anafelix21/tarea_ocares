package Agropacayales.valleGrande.rest;

import Agropacayales.valleGrande.model.Cultivo;
import Agropacayales.valleGrande.repository.r2dbc.CultivoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/cultivos")
@RequiredArgsConstructor
@Tag(name = "Cultivo-Controller", description = "Gestión de cultivos y ciclos de siembra (SQL R2DBC)")
public class CultivoController {

    private final CultivoRepository cultivoRepository;

    @GetMapping
    @Operation(summary = "Listar todos los cultivos")
    public Flux<Cultivo> listarTodos() {
        return cultivoRepository.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar cultivo por ID")
    public Mono<ResponseEntity<Cultivo>> listarPorId(@PathVariable Long id) {
        return cultivoRepository.findById(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/estado/{estado}")
    @Operation(summary = "Filtrar por estado")
    public Flux<Cultivo> listarPorEstado(@PathVariable Boolean estado) {
        return cultivoRepository.findByEstado(estado);
    }

    @GetMapping("/parcela/{idParcela}")
    @Operation(summary = "Filtrar cultivos por parcela")
    public Flux<Cultivo> obtenerPorParcela(@PathVariable String idParcela) {
        return cultivoRepository.findByIdParcela(idParcela);
    }

    @GetMapping("/parcela/{idParcela}/estado/{estado}")
    @Operation(summary = "Filtrar cultivos por parcela y estado")
    public Flux<Cultivo> obtenerPorParcelaYEstado(@PathVariable String idParcela, @PathVariable Boolean estado) {
        return cultivoRepository.findByIdParcelaAndEstado(idParcela, estado);
    }

    @PostMapping
    @Operation(summary = "Crear nuevo cultivo")
    public Mono<ResponseEntity<Cultivo>> crear(@Valid @RequestBody Cultivo cultivo) {
        if (cultivo.getFechaSiembra() == null) {
            cultivo.setFechaSiembra(LocalDate.now());
        }
        cultivo.setCreatedAt(LocalDateTime.now());
        cultivo.setEstado(true);
        return cultivoRepository.save(cultivo)
                .map(c -> ResponseEntity.status(HttpStatus.CREATED).body(c));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Editar cultivo")
    public Mono<ResponseEntity<Cultivo>> editar(@PathVariable Long id, @Valid @RequestBody Cultivo cultivo) {
        return cultivoRepository.findById(id)
                .flatMap(existente -> {
                    existente.setIdParcela(cultivo.getIdParcela());
                    existente.setNombre(cultivo.getNombre());
                    existente.setTipoCultivo(cultivo.getTipoCultivo());
                    existente.setFrecuenciaRiegoDias(cultivo.getFrecuenciaRiegoDias());
                    existente.setTemperaturaIdeal(cultivo.getTemperaturaIdeal());
                    existente.setFechaSiembra(cultivo.getFechaSiembra());
                    existente.setRequiereSombra(cultivo.getRequiereSombra());
                    existente.setObservaciones(cultivo.getObservaciones());
                    return cultivoRepository.save(existente);
                })
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/eliminar")
    @Operation(summary = "Desactivar cultivo (Lógico)")
    public Mono<ResponseEntity<Cultivo>> eliminar(@PathVariable Long id) {
        return cultivoRepository.findById(id)
                .flatMap(c -> {
                    c.setEstado(false);
                    return cultivoRepository.save(c);
                })
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/restaurar")
    @Operation(summary = "Restaurar cultivo (Lógico)")
    public Mono<ResponseEntity<Cultivo>> restaurar(@PathVariable Long id) {
        return cultivoRepository.findById(id)
                .flatMap(c -> {
                    c.setEstado(true);
                    return cultivoRepository.save(c);
                })
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
