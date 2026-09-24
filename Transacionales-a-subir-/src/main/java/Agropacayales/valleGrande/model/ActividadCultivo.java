package Agropacayales.valleGrande.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Table("actividad_cultivo")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ActividadCultivo {

    @Id
    @Column("id_actividad")
    private Long idActividad;

    @Column("id_cultivo")
    private Long idCultivo;

    @Column("tipo_actividad")
    private String tipoActividad;

    @Column("descripcion")
    private String descripcion;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "America/Lima")
    @Column("fecha_actividad")
    private LocalDateTime fechaActividad;

    @Column("costo_total")
    private BigDecimal costoTotal;

    @Builder.Default
    @Column("estado")
    private Boolean estado = true;

    @Builder.Default
    @Column("completado")
    private Boolean completado = false;
}
