import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

import { HEROES_SEED } from '../data/heroes.seed';
import { CreateHero, Hero, UpdateHero } from '../models/hero.model';
import idGenerator from '../../shared/helpers/id-generator';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private readonly heroes = signal<Hero[]>([...HEROES_SEED]);

  getAll(): Observable<Hero[]> {
    return of(this.heroes());
  }

  getById(id: string): Observable<Hero> {
    const hero = this.heroes().find((hero) => hero.id === id);

    if (!hero) {
      return throwError(() => new Error('Hero not found'));
    }

    return of(hero);
  }

  searchByName(query: string): Observable<Hero[]> {
    const searchTerm = query.trim().toLowerCase();

    if (!searchTerm) {
      return this.getAll();
    }

    const heroes = this.heroes().filter((hero) => hero.name.toLowerCase().includes(searchTerm));

    return of(heroes);
  }

  create(hero: CreateHero): Observable<Hero> {
    const newHero: Hero = {
      ...hero,
      id: idGenerator(),
      createdAt: new Date(),
    };

    this.heroes.update((heroes) => [...heroes, newHero]);

    return of(newHero);
  }

  update(id: string, changes: UpdateHero): Observable<Hero> {
    const hero = this.heroes().find((hero) => hero.id === id);

    if (!hero) {
      return throwError(() => new Error('Hero not found'));
    }

    const updatedHero: Hero = {
      ...hero,
      ...changes,
      id: hero.id,
      createdAt: hero.createdAt,
    };

    this.heroes.update((heroes) => heroes.map((hero) => (hero.id === id ? updatedHero : hero)));

    return of(updatedHero);
  }

  delete(id: string): Observable<void> {
    const heroExists = this.heroes().some((hero) => hero.id === id);

    if (!heroExists) {
      return throwError(() => new Error('Hero not found'));
    }

    this.heroes.update((heroes) => heroes.filter((hero) => hero.id !== id));

    return of(undefined);
  }
}
