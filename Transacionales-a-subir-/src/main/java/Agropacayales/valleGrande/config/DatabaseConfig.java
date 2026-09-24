package Agropacayales.valleGrande.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableReactiveMongoRepositories;
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories;

/**
 * Configuración de Persistencia Políglota (MongoDB + R2DBC SQL):
 * - MongoDB para Documentos (Usuarios, Parcelas, Insumos, Fichas, Movimientos)
 * - R2DBC para Tablas Relacionales (Cultivos, Actividades, Asignaciones, Cosechas)
 */
@Configuration
@EnableReactiveMongoRepositories(basePackages = "Agropacayales.valleGrande.repository.mongo")
@EnableR2dbcRepositories(basePackages = "Agropacayales.valleGrande.repository.r2dbc")
public class DatabaseConfig {
}
