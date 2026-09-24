package Agropacayales.valleGrande.repository.r2dbc;

import Agropacayales.valleGrande.model.ActividadCultivo;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface ActividadCultivoRepository extends R2dbcRepository<ActividadCultivo, Long> {
    Flux<ActividadCultivo> findByEstado(Boolean estado);
    Flux<ActividadCultivo> findByIdCultivo(Long idCultivo);
}
