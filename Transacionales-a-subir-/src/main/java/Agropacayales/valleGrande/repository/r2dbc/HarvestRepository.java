package Agropacayales.valleGrande.repository.r2dbc;

import Agropacayales.valleGrande.model.Harvest;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface HarvestRepository extends R2dbcRepository<Harvest, Long> {
    Flux<Harvest> findByEstado(Boolean estado);
}
