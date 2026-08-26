# Heroes Challenge

Aplicación SPA desarrollada en Angular para la gestión de superhéroes.

Permite listar, buscar, crear, editar y eliminar superhéroes mediante una arquitectura basada en componentes y servicios Angular.

La aplicación funciona por defecto utilizando datos en memoria dentro de `HeroService`, sin necesidad de backend.

Adicionalmente, se incorporó una implementación opcional utilizando `json-server` y `HttpClient` para poder ejecutar la misma aplicación contra una Mock API.

## Tech Stack

- Angular 22
- TypeScript
- Angular Material
- Singals
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

Para utilizar la implementación HTTP es necesario levantar `json-server` y la aplicación Angular con la configuración `api`.

En una primera terminal:

```bash
npm run api
```

Esto levanta `json-server` utilizando:

```text
mock-api/db.json
```

En una segunda terminal:

```bash
npm run start:api
```

En este modo, `HeroService` es reemplazado por `HeroApiService` mediante Dependency Injection y las operaciones CRUD se realizan utilizando HTTP.

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

La cobertura actual supera el mínimo solicitado del 80%.

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

Levantar `json-server`:

```bash
npm run api
```

En otra terminal, iniciar Angular utilizando la configuración API:

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
