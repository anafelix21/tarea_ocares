package Agropacayales.valleGrande.repository.r2dbc;

import Agropacayales.valleGrande.model.DetalleActividad;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface DetalleActividadRepository extends R2dbcRepository<DetalleActividad, Long> {
    Flux<DetalleActividad> findByIdActividad(Long idActividad);
    Mono<Void> deleteByIdActividad(Long idActividad);
}
