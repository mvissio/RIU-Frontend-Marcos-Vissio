# Heroes Challenge

Aplicación SPA desarrollada en Angular para la gestión de superhéroes.

Permite listar, buscar, crear, editar y eliminar superhéroes utilizando un servicio en memoria.
## Tech Stack

- Angular 22
- TypeScript
- Angular Material
- RxJS
- Vitest
- V8 Coverage
- Docker
- Nginx

## Features

- Hero listing
- Pagination
- Partial search by hero name
- Create hero
- Edit hero
- Delete hero
- Delete confirmation dialog
- Form validations
- User feedback with Angular Material SnackBar
- Angular Router navigation
- Responsive layout

## Project Structure

```text
src/app/
├── core/
│   ├── data/
│   ├── models/
│   └── services/
├── features/
│   └── heroes/
│       ├── components/
│       └── pages/
├── app.config.ts
├── app.routes.ts
└── app.ts
```

## Cambios implementados en la rama `optionals`

Esta rama incorpora las mejoras opcionales propuestas en la prueba técnica sobre la implementación base disponible en `main`.

### Interceptores y Mock API

- Se incorporó un interceptor para gestionar el estado de loading durante las peticiones HTTP.
- Se agregó un interceptor para el manejo de errores HTTP.
- Se agregó un componente visual de loading.
- Se integró `json-server` como Mock API.
- El servicio de héroes utiliza `HttpClient` para realizar las operaciones contra la API mock.

### Testing

- Se actualizaron y agregaron tests unitarios para contemplar las funcionalidades incorporadas en esta rama.
- Se agregaron pruebas para los servicios e interceptores asociados al manejo de loading y errores.
- Se actualizaron los tests de los componentes afectados por la integración HTTP.

### Docker Compose

- Se actualizó `docker-compose.yml` para incluir `json-server`.
- La aplicación y la Mock API pueden levantarse desde Docker Compose.
- La información de la API mock se obtiene desde `mock-api/db.json`.

### Directiva Uppercase

- Se agregó una directiva personalizada para transformar automáticamente a mayúsculas el nombre del héroe durante la creación y edición.
- La directiva se aplica directamente sobre el campo de nombre del formulario.
