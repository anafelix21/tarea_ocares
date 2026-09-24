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

@Document(collection = "fichas_campo")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FichaCampo {

    @Id
    private String id;

    @Field("id_cultivo")
    private String idCultivo;

    @Field("id_usuario")
    private String idUsuario;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "America/Lima")
    @Field("fecha_registro")
    private LocalDateTime fechaRegistro;

    @Field("etapa_fenologica")
    private String etapaFenologica;

    @Field("temperatura_amb")
    private BigDecimal temperaturaAmb;

    @Field("humedad_relativa")
    private BigDecimal humedadRelativa;

    @Field("condicion_clima")
    private String condicionClima;

    @Field("estado_cultivo")
    private String estadoCultivo;

    @Builder.Default
    @Field("necesita_riego")
    private Boolean necesitaRiego = false;

    @Builder.Default
    @Field("necesita_fumigacion")
    private Boolean necesitaFumigacion = false;

    @Field("diagnostico")
    private String diagnostico;

    @Field("accion_tomada")
    private String accionTomada;

    @Builder.Default
    @Field("estado")
    private Boolean estado = true;
}
