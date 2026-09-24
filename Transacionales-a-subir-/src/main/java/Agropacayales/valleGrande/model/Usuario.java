package Agropacayales.valleGrande.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Document(collection = "usuarios")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Usuario {

    @Id
    private String id;

    @NotBlank(message = "El nombre es obligatorio")
    @Field("nombre")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Field("apellido")
    private String apellido;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "Formato de correo inválido")
    @Field("correo")
    private String correo;

    @NotBlank(message = "La contraseña es obligatoria")
    @Field("password")
    private String password;

    @Builder.Default
    @Field("rol")
    private String rol = "OPERADOR"; // ADMIN, SUPERVISOR, OPERADOR, SUPERVISOR_ALMACEN

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Field("fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Field("fecha_contratacion")
    private LocalDate fechaContratacion;

    @Builder.Default
    @Field("estado")
    private Boolean estado = true;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "America/Lima")
    @Field("created_at")
    private LocalDateTime createdAt;

    @JsonFormat(pattern = "dd/MM/yyyy HH:mm:ss", timezone = "America/Lima")
    @Field("updated_at")
    private LocalDateTime updatedAt;
}
