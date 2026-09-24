package Agropacayales.valleGrande.repository.r2dbc;

import Agropacayales.valleGrande.model.AsignacionCabecera;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface AsignacionCabeceraRepository extends R2dbcRepository<AsignacionCabecera, Long> {
    Flux<AsignacionCabecera> findByEstado(Boolean estado);
    Flux<AsignacionCabecera> findByIdActividad(Long idActividad);
}
