package Agropacayales.valleGrande.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.math.BigDecimal;

@Document(collection = "insumos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Insumo {

    @Id
    private String id;

    @NotBlank(message = "El nombre del insumo es obligatorio")
    @Field("nombre")
    private String nombre;

    @Field("descripcion")
    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @Min(value = 0, message = "El precio no puede ser negativo")
    @Field("precio")
    private BigDecimal precio;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    @Field("stock")
    private Integer stock;

    @Field("unidad_medida")
    private String unidadMedida;

    @Field("tipo_insumo")
    private String tipoInsumo; // FERTILIZANTE, SEMILLA, FUNGICIDA, INSECTICIDA, HERBICIDA

    @Field("proveedor")
    private String proveedor;

    @Field("presentacion")
    private String presentacion;

    @Builder.Default
    @Field("estado")
    private Boolean estado = true;
}
