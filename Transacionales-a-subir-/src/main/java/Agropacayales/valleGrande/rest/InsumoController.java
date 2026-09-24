package Agropacayales.valleGrande.rest;

import Agropacayales.valleGrande.model.Insumo;
import Agropacayales.valleGrande.repository.mongo.InsumoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/insumos")
@RequiredArgsConstructor
@Tag(name = "Insumo-Controller", description = "Gestión de insumos agrícolas y stock (MongoDB)")
public class InsumoController {

    private final InsumoRepository insumoRepository;

    @GetMapping
    @Operation(summary = "Listar todos los insumos")
    public Flux<Insumo> listarTodos() {
        return insumoRepository.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar insumo por ID")
    public Mono<ResponseEntity<Insumo>> listarPorId(@PathVariable String id) {
        return insumoRepository.findById(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/estado/{estado}")
    @Operation(summary = "Filtrar insumos por estado")
    public Flux<Insumo> listarPorEstado(@PathVariable Boolean estado) {
        return insumoRepository.findByEstado(estado);
    }

    @GetMapping("/buscar")
    @Operation(summary = "Buscar insumos por nombre")
    public Flux<Insumo> buscarPorNombre(@RequestParam String nombre) {
        return insumoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    @GetMapping("/filtrar")
    @Operation(summary = "Filtrar insumos por tipo")
    public Flux<Insumo> filtrarPorTipo(@RequestParam String tipo) {
        return insumoRepository.findByTipoInsumoIgnoreCase(tipo);
    }

    @PostMapping
    @Operation(summary = "Crear nuevo insumo")
    public Mono<ResponseEntity<Insumo>> crear(@Valid @RequestBody Insumo insumo) {
        insumo.setEstado(true);
        return insumoRepository.save(insumo)
                .map(i -> ResponseEntity.status(HttpStatus.CREATED).body(i));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Editar insumo existente")
    public Mono<ResponseEntity<Insumo>> editar(@PathVariable String id, @Valid @RequestBody Insumo insumo) {
        return insumoRepository.findById(id)
                .flatMap(existente -> {
                    existente.setNombre(insumo.getNombre());
                    existente.setDescripcion(insumo.getDescripcion());
                    existente.setPrecio(insumo.getPrecio());
                    existente.setStock(insumo.getStock());
                    existente.setUnidadMedida(insumo.getUnidadMedida());
                    existente.setTipoInsumo(insumo.getTipoInsumo());
                    existente.setProveedor(insumo.getProveedor());
                    existente.setPresentacion(insumo.getPresentacion());
                    return insumoRepository.save(existente);
                })
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/eliminar")
    @Operation(summary = "Desactivar insumo (Lógico)")
    public Mono<ResponseEntity<Insumo>> eliminar(@PathVariable String id) {
        return insumoRepository.findById(id)
                .flatMap(i -> {
                    i.setEstado(false);
                    return insumoRepository.save(i);
                })
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/restaurar")
    @Operation(summary = "Restaurar insumo (Lógico)")
    public Mono<ResponseEntity<Insumo>> restaurar(@PathVariable String id) {
        return insumoRepository.findById(id)
                .flatMap(i -> {
                    i.setEstado(true);
                    return insumoRepository.save(i);
                })
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
