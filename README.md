# Heroes Challenge

Aplicación SPA desarrollada en Angular para la gestión de superhéroes.

Permite listar, buscar, crear, editar y eliminar superhéroes mediante una arquitectura basada en componentes, servicios Angular y una Mock API para simular persistencia de datos.

## Tech Stack

- Angular 22
- TypeScript
- Angular Material
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

## Mejoras adicionales implementadas

Además de los requerimientos principales de la prueba técnica, se incorporaron mejoras opcionales:

### Interceptores HTTP

- Interceptor para gestionar estados de carga durante operaciones HTTP.
- Interceptor global para manejo de errores HTTP.
- Componente visual de loading.

### Mock API

- Integración con `json-server` como API simulada.
- El servicio de héroes utiliza `HttpClient` para comunicarse con la API.
- Datos mock almacenados en:

```text
mock-api/db.json
```

### Docker

- Configuración mediante Docker Compose.
- Contenedores para la aplicación Angular y la Mock API.
- Servidor Nginx para servir la aplicación compilada.

### Directiva Uppercase

- Directiva personalizada para transformar automáticamente el nombre del héroe a mayúsculas durante la creación y edición.

## Testing

El proyecto cuenta con tests unitarios utilizando:

- Vitest.
- V8 Coverage.

Incluye pruebas para:

- Servicios.
- Componentes.
- Interceptores.
- Flujos principales de la aplicación.

La cobertura actual supera el mínimo solicitado del 80%.

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
├── shared/
├── app.config.ts
├── app.routes.ts
└── app.ts
```

# Ejecución del proyecto

## Instalación de dependencias

```bash
npm install
```

---

## Ejecución local sin Docker

Iniciar aplicación Angular:

```bash
npm start
```

La aplicación estará disponible mediante Angular CLI.

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
