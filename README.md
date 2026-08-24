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
