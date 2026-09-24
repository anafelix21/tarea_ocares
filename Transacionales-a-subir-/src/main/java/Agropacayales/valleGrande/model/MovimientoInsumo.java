package Agropacayales.valleGrande.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Document(collection = "movimiento_insumos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class MovimientoInsumo {

    @Id
    private String id;

    @Field("id_insumo")
    private String idInsumo;

    @Field("id_usuario")
    private String idUsuario;

    @Field("tipo_movimiento")
    private String tipoMovimiento; // ENTRADA, SALIDA

    @Field("motivo")
    private String motivo;

    @Field("cantidad")
    private Integer cantidad;

    @Field("precio_unitario")
    private BigDecimal precioUnitario;

    @Field("subtotal")
    private BigDecimal subtotal;

    @Field("stock_anterior")
    private Integer stockAnterior;

    @Field("stock_nuevo")
    private Integer stockNuevo;

    @Field("referencia")
    private String referencia;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "America/Lima")
    @Field("fecha_movimiento")
    private LocalDateTime fechaMovimiento;
}
