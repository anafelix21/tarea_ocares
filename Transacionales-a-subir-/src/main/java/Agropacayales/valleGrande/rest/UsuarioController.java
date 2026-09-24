package Agropacayales.valleGrande.rest;

import Agropacayales.valleGrande.model.Usuario;
import Agropacayales.valleGrande.repository.mongo.UsuarioRepository;
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
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@Tag(name = "Usuario-Controller", description = "Gestión de usuarios de AgroPacayales (MongoDB)")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    @GetMapping
    @Operation(summary = "Listar todos los usuarios")
    public Flux<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar usuario por ID")
    public Mono<ResponseEntity<Usuario>> listarPorId(@PathVariable String id) {
        return usuarioRepository.findById(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/estado/{estado}")
    @Operation(summary = "Filtrar usuarios por estado (activo/inactivo)")
    public Flux<Usuario> listarPorEstado(@PathVariable Boolean estado) {
        return usuarioRepository.findByEstado(estado);
    }

    @PostMapping
    @Operation(summary = "Crear nuevo usuario")
    public Mono<ResponseEntity<Usuario>> crear(@Valid @RequestBody Usuario usuario) {
        usuario.setCreatedAt(LocalDateTime.now());
        usuario.setEstado(true);
        return usuarioRepository.save(usuario)
                .map(u -> ResponseEntity.status(HttpStatus.CREATED).body(u));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Editar usuario existente")
    public Mono<ResponseEntity<Usuario>> editar(@PathVariable String id, @Valid @RequestBody Usuario usuario) {
        return usuarioRepository.findById(id)
                .flatMap(existente -> {
                    existente.setNombre(usuario.getNombre());
                    existente.setApellido(usuario.getApellido());
                    existente.setCorreo(usuario.getCorreo());
                    if (usuario.getPassword() != null && !usuario.getPassword().isBlank()) {
                        existente.setPassword(usuario.getPassword());
                    }
                    existente.setRol(usuario.getRol());
                    existente.setFechaNacimiento(usuario.getFechaNacimiento());
                    existente.setFechaContratacion(usuario.getFechaContratacion());
                    existente.setUpdatedAt(LocalDateTime.now());
                    return usuarioRepository.save(existente);
                })
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/eliminar")
    @Operation(summary = "Desactivar usuario (Lógico)")
    public Mono<ResponseEntity<Usuario>> eliminar(@PathVariable String id) {
        return usuarioRepository.findById(id)
                .flatMap(u -> {
                    u.setEstado(false);
                    u.setUpdatedAt(LocalDateTime.now());
                    return usuarioRepository.save(u);
                })
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/restaurar")
    @Operation(summary = "Restaurar usuario (Lógico)")
    public Mono<ResponseEntity<Usuario>> restaurar(@PathVariable String id) {
        return usuarioRepository.findById(id)
                .flatMap(u -> {
                    u.setEstado(true);
                    u.setUpdatedAt(LocalDateTime.now());
                    return usuarioRepository.save(u);
                })
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }
}
