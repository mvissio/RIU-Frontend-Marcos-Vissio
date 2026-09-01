# Heroes Challenge

[![CI](https://github.com/mvissio/RIU-Frontend-Marcos-Vissio/actions/workflows/ci.yml/badge.svg)](https://github.com/mvissio/RIU-Frontend-Marcos-Vissio/actions/workflows/ci.yml)

Aplicación SPA desarrollada en Angular para la gestión de superhéroes.

Permite listar, buscar, crear, editar y eliminar superhéroes mediante una arquitectura basada en componentes y servicios Angular.

La aplicación funciona por defecto utilizando datos en memoria dentro de `HeroService`, sin necesidad de backend.

Adicionalmente, se incorporó una implementación opcional utilizando `json-server` y `HttpClient` para poder ejecutar la misma aplicación contra una Mock API.

## Demo

La aplicación se encuentra publicada en GitHub Pages:

[Ver Heroes Challenge](https://mvissio.github.io/RIU-Frontend-Marcos-Vissio/)

La versión publicada utiliza la implementación en memoria, por lo que no requiere que la Mock API esté disponible.

## Tech Stack

- Angular 22
- TypeScript
- Angular Material
- Signals
- RxJS
- Vitest
- V8 Coverage
- Docker
- Nginx
- json-server

## Features

- Listado de héroes.
- Paginación.
- Búsqueda parcial por nombre.
- Creación de héroes.
- Edición de héroes.
- Eliminación de héroes.
- Confirmación antes de eliminar.
- Formularios con validaciones.
- Feedback al usuario mediante Angular Material SnackBar.
- Navegación mediante Angular Router.
- Comunicación entre componentes orientada a eventos.
- Diseño responsive.

## Servicios implementados

El servicio de héroes permite:

- Crear un nuevo héroe.
- Consultar todos los héroes.
- Consultar un héroe por ID.
- Buscar héroes por nombre.
- Actualizar héroes.
- Eliminar héroes.

La implementación principal se encuentra en `HeroService` y mantiene los datos en memoria, de acuerdo con el requerimiento de no utilizar backend.

## Mejoras adicionales implementadas

Además de los requerimientos principales de la prueba técnica, se incorporaron mejoras opcionales:

### Interceptores HTTP

- Interceptor para gestionar estados de carga durante operaciones HTTP.
- Interceptor global para manejo de errores HTTP.
- Componente visual de loading.

Estos interceptores se utilizan principalmente cuando la aplicación se ejecuta en modo Mock API.

Se recomienda utilizar el modo 3g para ver el comportamiento correcto.

### Mock API

Se incorporó una implementación alternativa utilizando `json-server` para simular una API HTTP.

Esta implementación es opcional y no reemplaza el comportamiento principal de la aplicación.

#### Decisión de implementación

Por defecto, la aplicación utiliza `HeroService`, que mantiene la información en memoria.

Esto permite ejecutar el proyecto sin levantar ningún backend adicional y mantiene el comportamiento solicitado para la prueba técnica.

Como alternativa, se incorporó `HeroApiService`, que implementa las mismas operaciones utilizando `HttpClient`.

La selección entre ambas implementaciones se realiza mediante configuración de environment:

- `environment.ts`: utiliza la implementación en memoria.
- `environment.api.ts`: habilita la implementación basada en Mock API.

Los componentes continúan dependiendo de `HeroService`, por lo que no necesitan cambios para utilizar una implementación u otra.

#### Datos de la Mock API

Los datos utilizados por `json-server` se encuentran en:

```text
mock-api/db.json
```

#### Ejecución de la Mock API

Para levantar `json-server` y la aplicación Angular con la configuración `api`, ejecutar:

```bash
npm run start:api
```

Este comando inicia ambos procesos. En este modo, `HeroService` es reemplazado por `HeroApiService` mediante Dependency Injection y las operaciones CRUD se realizan utilizando HTTP sobre los datos de `mock-api/db.json`.

La ejecución normal:

```bash
npm start
```

continúa utilizando exclusivamente la implementación en memoria.

### Docker

- Configuración mediante Docker Compose.
- Contenedores para la aplicación Angular y la Mock API.
- Servidor Nginx para servir la aplicación compilada.

### Directiva Uppercase

- Directiva personalizada para transformar automáticamente el nombre del héroe a mayúsculas durante la creación y edición.
- Mantiene sincronizado el valor del input con el control del formulario.

## Testing

El proyecto cuenta con tests unitarios utilizando:

- Vitest.
- V8 Coverage.

Incluye pruebas para:

- Servicios.
- Componentes.
- Directivas.
- Interceptores.
- Flujos principales de la aplicación.

La suite cuenta con 58 tests y la cobertura supera el mínimo solicitado del 80%.

## Integración continua y despliegue

El workflow `.github/workflows/ci.yml` se ejecuta automáticamente ante cada `push` y `pull request` sobre `main`. También puede iniciarse manualmente desde la pestaña **Actions** de GitHub.

El job de calidad realiza las siguientes validaciones:

- Instalación reproducible de dependencias mediante `npm ci`.
- Verificación de formato con Prettier.
- Auditoría de vulnerabilidades críticas.
- Ejecución de tests con cobertura.
- Compilación de producción de la aplicación.

Cada ejecución publica durante 7 días dos artefactos descargables desde GitHub Actions:

- `coverage-report`: reporte HTML de cobertura.
- `application-build`: aplicación Angular compilada.

Cuando todas las validaciones finalizan correctamente en la rama `main`, el job de deploy compila la aplicación con la ruta base del repositorio y la publica automáticamente en GitHub Pages. Los pull requests solo ejecutan las validaciones y no realizan despliegues.

## Project Structure

```text
src/app/
├── core/
│   ├── data/
│   ├── interceptors/
│   ├── models/
│   └── services/
├── features/
│   └── heroes/
│       ├── components/
│       └── pages/
├── shared/
│   ├── directives/
│   └── helpers/
├── app.config.ts
├── app.routes.ts
└── app.ts

src/environments/
├── environment.ts
└── environment.api.ts

mock-api/
└── db.json

docker/
├── Dockerfile
├── docker-compose.yml
└── nginx.conf

.github/workflows/
└── ci.yml
```

# Ejecución del proyecto

## Instalación de dependencias

```bash
npm install
```

---

## Ejecución local sin Docker

La ejecución por defecto utiliza los datos en memoria y no requiere backend.

```bash
npm start
```

La aplicación estará disponible mediante Angular CLI.

---

## Ejecución local con Mock API

Iniciar conjuntamente `json-server` y Angular con la configuración API:

```bash
npm run start:api
```

---

## Tests

Ejecutar tests:

```bash
npm run test
```

Ejecutar tests con cobertura:

```bash
npm run test:coverage
```

---

# Ejecución utilizando Docker

El proyecto incluye Docker Compose para levantar:

- Aplicación Angular mediante Nginx.
- Mock API mediante json-server.

## Levantar servicios

```bash
npm run docker:up
```

## Detener servicios

```bash
npm run docker:down
```

## Consultar logs

```bash
npm run docker:logs
```

---

## Calidad de código

Se incorporaron validaciones automáticas mediante Husky:

### Pre-commit

Ejecuta:

- Prettier.

### Pre-push

Ejecuta:

- Tests unitarios.
- Validación de cobertura mínima.
