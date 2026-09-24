package Agropacayales.valleGrande.rest;

import Agropacayales.valleGrande.model.MovimientoInsumo;
import Agropacayales.valleGrande.repository.mongo.InsumoRepository;
import Agropacayales.valleGrande.repository.mongo.MovimientoInsumoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/movimiento-insumos")
@RequiredArgsConstructor
@Tag(name = "MovimientoInsumo-Controller", description = "Auditoría y control de kardex / movimientos de inventario (MongoDB)")
public class MovimientoInsumoController {

    private final MovimientoInsumoRepository movimientoRepository;
    private final InsumoRepository insumoRepository;

    @GetMapping
    @Operation(summary = "Listar todos los movimientos")
    public Flux<MovimientoInsumo> listarTodos() {
        return movimientoRepository.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar movimiento por ID")
    public Mono<ResponseEntity<MovimientoInsumo>> listarPorId(@PathVariable String id) {
        return movimientoRepository.findById(id)
                .map(ResponseEntity::ok)
                .defaultIfEmpty(ResponseEntity.notFound().build());
    }

    @GetMapping("/insumo/{idInsumo}")
    @Operation(summary = "Obtener movimientos de un insumo específico")
    public Flux<MovimientoInsumo> obtenerPorInsumo(@PathVariable String idInsumo) {
        return movimientoRepository.findByIdInsumo(idInsumo);
    }

    @PostMapping
    @Operation(summary = "Registrar entrada o salida de insumo con actualización de stock")
    public Mono<ResponseEntity<MovimientoInsumo>> crear(@Valid @RequestBody MovimientoInsumo mov) {
        return insumoRepository.findById(mov.getIdInsumo())
                .flatMap(insumo -> {
                    int stockAnterior = insumo.getStock() != null ? insumo.getStock() : 0;
                    int cantidad = mov.getCantidad() != null ? mov.getCantidad() : 0;
                    int stockNuevo = "ENTRADA".equalsIgnoreCase(mov.getTipoMovimiento())
                            ? stockAnterior + cantidad
                            : Math.max(0, stockAnterior - cantidad);

                    insumo.setStock(stockNuevo);

                    mov.setStockAnterior(stockAnterior);
                    mov.setStockNuevo(stockNuevo);
                    if (mov.getPrecioUnitario() == null) {
                        mov.setPrecioUnitario(insumo.getPrecio());
                    }
                    if (mov.getPrecioUnitario() != null) {
                        mov.setSubtotal(mov.getPrecioUnitario().multiply(BigDecimal.valueOf(cantidad)));
                    }
                    mov.setFechaMovimiento(LocalDateTime.now());

                    return insumoRepository.save(insumo)
                            .then(movimientoRepository.save(mov));
                })
                .map(m -> ResponseEntity.status(HttpStatus.CREATED).body(m))
                .defaultIfEmpty(ResponseEntity.badRequest().build());
    }
}
