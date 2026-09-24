package Agropacayales.valleGrande.repository.mongo;

import Agropacayales.valleGrande.model.Usuario;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface UsuarioRepository extends ReactiveMongoRepository<Usuario, String> {
    Mono<Usuario> findByCorreo(String correo);
    Flux<Usuario> findByEstado(Boolean estado);
    Flux<Usuario> findByRol(String rol);
}
