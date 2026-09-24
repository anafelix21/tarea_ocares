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
import java.time.LocalDate;
import java.time.LocalDateTime;

@Table("cultivos")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Cultivo {

    @Id
    @Column("id_cultivo")
    private Long idCultivo;

    @Column("id_parcela")
    private String idParcela;

    @Column("nombre")
    private String nombre;

    @Column("tipo_cultivo")
    private String tipoCultivo;

    @Column("frecuencia_riego_dias")
    private Integer frecuenciaRiegoDias;

    @Column("temperatura_ideal")
    private BigDecimal temperaturaIdeal;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column("fecha_siembra")
    private LocalDate fechaSiembra;

    @Builder.Default
    @Column("requiere_sombra")
    private Boolean requiereSombra = false;

    @Column("observaciones")
    private String observaciones;

    @Builder.Default
    @Column("estado")
    private Boolean estado = true;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "America/Lima")
    @Column("created_at")
    private LocalDateTime createdAt;
}
