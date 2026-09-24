package Agropacayales.valleGrande.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("AgroPacayales - Módulo de Parcelas API (Spring WebFlux + MongoDB)")
                        .version("1.0.0")
                        .description("API REST Reactiva para la gestión de Parcelas y Terrenos de Cultivo (Ana Cristina Félix Mendoza).")
                        .contact(new Contact()
                                .name("Ana Cristina Félix Mendoza - Valle Grande")
                                .email("ana.felix@vallegrande.edu.pe"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://springdoc.org")));
    }
}

