import { Routes } from '@angular/router';

export const HEROES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/hero-list-page/hero-list-page').then((m) => m.HeroListPage),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./pages/hero-form-page/hero-form-page').then((m) => m.HeroFormPage),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./pages/hero-form-page/hero-form-page').then((m) => m.HeroFormPage),
  },
];
