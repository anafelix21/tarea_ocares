package Agropacayales.valleGrande.repository.r2dbc;

import Agropacayales.valleGrande.model.AsignacionDetalle;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface AsignacionDetalleRepository extends R2dbcRepository<AsignacionDetalle, Long> {
    Flux<AsignacionDetalle> findByIdAsignacionCabecera(Long idAsignacionCabecera);
    Mono<Void> deleteByIdAsignacionCabecera(Long idAsignacionCabecera);
}
