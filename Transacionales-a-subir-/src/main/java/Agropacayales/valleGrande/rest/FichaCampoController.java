package Agropacayales.valleGrande.rest;

import Agropacayales.valleGrande.model.FichaCampo;
import Agropacayales.valleGrande.repository.mongo.FichaCampoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/fichas-campo")
@RequiredArgsConstructor
@Tag(name = "FichaCampo-Controller", description = "Monitoreo diario de salud y diagnóstico de cultivos (MongoDB)")
public class FichaCampoController {

    private final FichaCampoRepository fichaCampoRepository;

    @GetMapping
    @Operation(summary = "Listar todas las fichas de campo")
    public Flux<FichaCampo> listarTodos() {
        return fichaCampoRepository.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar ficha por ID")
    public Mono<ResponseEntity<FichaCampo>> listarPorId(@PathVariable String id) {
        return fichaCampoRepository.findById(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/estado/{estado}")
    @Operation(summary = "Filtrar por estado (activo/inactivo)")
    public Flux<FichaCampo> listarPorEstado(@PathVariable Boolean estado) {
        return fichaCampoRepository.findByEstado(estado);
    }

    @PostMapping
    @Operation(summary = "Registrar nueva ficha de campo")
    public Mono<ResponseEntity<FichaCampo>> crear(@Valid @RequestBody FichaCampo ficha) {
        if (ficha.getFechaRegistro() == null) {
            ficha.setFechaRegistro(LocalDateTime.now());
        }
        ficha.setEstado(true);
        return fichaCampoRepository.save(ficha)
                .map(f -> ResponseEntity.status(HttpStatus.CREATED).body(f));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Editar ficha de campo")
    public Mono<ResponseEntity<FichaCampo>> editar(@PathVariable String id, @Valid @RequestBody FichaCampo ficha) {
        return fichaCampoRepository.findById(id)
                .flatMap(existente -> {
                    existente.setIdCultivo(ficha.getIdCultivo());
                    existente.setIdUsuario(ficha.getIdUsuario());
                    existente.setEtapaFenologica(ficha.getEtapaFenologica());
                    existente.setTemperaturaAmb(ficha.getTemperaturaAmb());
                    existente.setHumedadRelativa(ficha.getHumedadRelativa());
                    existente.setCondicionClima(ficha.getCondicionClima());
                    existente.setEstadoCultivo(ficha.getEstadoCultivo());
                    existente.setNecesitaRiego(ficha.getNecesitaRiego());
                    existente.setNecesitaFumigacion(ficha.getNecesitaFumigacion());
                    existente.setDiagnostico(ficha.getDiagnostico());
                    existente.setAccionTomada(ficha.getAccionTomada());
                    return fichaCampoRepository.save(existente);
                })
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/eliminar")
    @Operation(summary = "Desactivar ficha (Lógico)")
    public Mono<ResponseEntity<FichaCampo>> eliminar(@PathVariable String id) {
        return fichaCampoRepository.findById(id)
                .flatMap(f -> {
                    f.setEstado(false);
                    return fichaCampoRepository.save(f);
                })
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/restaurar")
    @Operation(summary = "Restaurar ficha (Lógico)")
    public Mono<ResponseEntity<FichaCampo>> restaurar(@PathVariable String id) {
        return fichaCampoRepository.findById(id)
                .flatMap(f -> {
                    f.setEstado(true);
                    return fichaCampoRepository.save(f);
                })
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
