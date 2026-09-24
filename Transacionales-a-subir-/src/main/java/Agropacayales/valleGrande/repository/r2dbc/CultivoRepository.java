package Agropacayales.valleGrande.repository.r2dbc;

import Agropacayales.valleGrande.model.Cultivo;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface CultivoRepository extends R2dbcRepository<Cultivo, Long> {
    Flux<Cultivo> findByEstado(Boolean estado);
    Flux<Cultivo> findByIdParcela(String idParcela);
    Flux<Cultivo> findByIdParcelaAndEstado(String idParcela, Boolean estado);
}
