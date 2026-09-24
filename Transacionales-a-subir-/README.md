# AgroPacayales - Módulo de Parcelas (Spring WebFlux + MongoDB Reactivo)

**Estudiante:** Ana Cristina Félix Mendoza  
**Curso:** Desarrollo de Aplicaciones Móviles (DAM)  
**Grupo:** ASE251S4_T05  
**Repositorio:** `ASE251S4_FelixMendozaAnaCristina_mo`  
**Rama principal de desarrollo:** `develop`

Este repositorio contiene la solución backend reactiva del **CRUD Maestro de Parcelas** para el proyecto **AgroPacayales**, implementado con **Spring WebFlux** y **Spring Data MongoDB Reactive**.

---

## 🚀 1. Arquitectura y Tecnologías
- **Java 21 LTS**
- **Spring Boot 3.4.3**
- **Spring WebFlux (Reactor / Netty)**: Procesamiento asíncrono y no bloqueante (`Mono` y `Flux`).
- **Spring Data MongoDB Reactive**: Persistencia NoSQL asíncrona.
- **SpringDoc OpenAPI 2.8.5**: Documentación Swagger UI en tiempo real.
- **Docker & Kubernetes**: Despliegue contenerizado en AWS.

---

## ⚙️ 2. Ejecución Local y Entornos

### Ejecutar en modo LOCAL (MongoDB Local):
```bash
mvn spring-boot:run
```

### Ejecutar en modo NUBE (MongoDB Atlas):
```bash
mvn spring-boot:run "-Dspring-boot.run.profiles=cloud"
```

---

## 🌐 3. Acceso a la Documentación (Swagger UI)

Accede a la consola interactiva de Swagger UI en:  
👉 **[http://localhost:8081/swagger-ui.html](http://localhost:8081/swagger-ui.html)**

---

## 📝 4. JSON de Pruebas para Crear Parcela (POST `/api/parcelas`)

```json
{
  "nombre": "Sector Norte A1",
  "ubicacion": "Coordenadas -12.043, -77.028",
  "areaHectareas": 5.5,
  "tipoSuelo": "ARCILLOSO",
  "responsable": "Ana Cristina Félix",
  "estadoRiego": "ACTIVO",
  "fechaUltimaSiembra": "2024-10-01",
  "produccionEstimada": "15000 kg",
  "cultivoActual": "Palta Hass",
  "observaciones": "Terreno optimizado con riego por goteo",
  "enUso": true,
  "estado": true
}
```

---

## 🛠️ 5. Endpoints del Módulo de Parcelas

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/parcelas` | Obtener todas las parcelas (`Flux<Parcela>`) |
| `GET` | `/api/parcelas/{id}` | Buscar parcela por ID (`Mono<Parcela>`) |
| `GET` | `/api/parcelas/estado/{estado}` | Filtrar parcelas por estado (true/false) |
| `POST` | `/api/parcelas` | Registrar nueva parcela |
| `PUT` | `/api/parcelas/{id}` | Modificar datos de parcela existente |
| `PATCH` | `/api/parcelas/{id}/eliminar` | Eliminación lógica (`estado = false`) |
| `PATCH` | `/api/parcelas/{id}/restaurar` | Restauración lógica (`estado = true`) |
