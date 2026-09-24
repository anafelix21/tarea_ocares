package Agropacayales.valleGrande.rest;

import Agropacayales.valleGrande.model.Usuario;
import Agropacayales.valleGrande.model.dto.AuthRequest;
import Agropacayales.valleGrande.repository.mongo.UsuarioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Auth-Controller", description = "Autenticación de usuarios y login")
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    @Operation(summary = "Iniciar Sesión", description = "Valida correo y contraseña del usuario")
    public Mono<ResponseEntity<Usuario>> login(@Valid @RequestBody AuthRequest request) {
        return usuarioRepository.findByCorreo(request.getCorreo())
                .filter(u -> u.getPassword().equals(request.getPassword()))
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }
}
