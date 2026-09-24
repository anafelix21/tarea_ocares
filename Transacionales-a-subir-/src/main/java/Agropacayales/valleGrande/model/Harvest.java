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

import java.time.LocalDate;
import java.time.LocalDateTime;

@Table("harvest")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Harvest {

    @Id
    @Column("id_harvest")
    private Long idHarvest;

    @Column("responsable")
    private String responsable;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column("fecha_cosecha")
    private LocalDate fechaCosecha;

    @Builder.Default
    @Column("estado")
    private Boolean estado = true;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "America/Lima")
    @Column("created_at")
    private LocalDateTime createdAt;
}
