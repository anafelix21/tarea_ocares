package Agropacayales.valleGrande.repository.r2dbc;

import Agropacayales.valleGrande.model.HarvestPlantingCycle;
import org.springframework.data.r2dbc.repository.R2dbcRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
public interface HarvestPlantingCycleRepository extends R2dbcRepository<HarvestPlantingCycle, Long> {
    Flux<HarvestPlantingCycle> findByIdHarvest(Long idHarvest);
    Mono<Void> deleteByIdHarvest(Long idHarvest);
}
