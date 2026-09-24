package Agropacayales.valleGrande.repository.mongo;

import Agropacayales.valleGrande.model.Insumo;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

@Repository
public interface InsumoRepository extends ReactiveMongoRepository<Insumo, String> {
    Flux<Insumo> findByEstado(Boolean estado);
    Flux<Insumo> findByNombreContainingIgnoreCase(String nombre);
    Flux<Insumo> findByTipoInsumoIgnoreCase(String tipoInsumo);
}
