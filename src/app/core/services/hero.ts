import { Injectable, signal } from '@angular/core';

import { HEROES_SEED } from '../data/heroes.seed';
import { CreateHero, Hero, UpdateHero } from '../models/hero.model';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private readonly heroesState = signal<Hero[]>([...HEROES_SEED]);

  readonly heroes = this.heroesState.asReadonly();

  getAll(): Hero[] {
    return this.heroesState();
  }

  getById(id: string): Hero | undefined {
    return this.heroesState().find((hero) => hero.id === id);
  }

  searchByName(query: string): Hero[] {
    const searchTerm = query.trim().toLowerCase();

    if (!searchTerm) {
      return this.getAll();
    }

    return this.heroesState().filter((hero) => hero.name.toLowerCase().includes(searchTerm));
  }

  create(hero: CreateHero): Hero {
    const newHero = {
      ...hero,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    this.heroesState.update((heroes) => [...heroes, newHero]);

    return newHero;
  }

  update(id: string, changes: UpdateHero): Hero | undefined {
    const currentHero = this.getById(id);

    if (!currentHero) {
      return undefined;
    }

    const updatedHero = {
      ...currentHero,
      ...changes,
      id: currentHero.id,
      createdAt: currentHero.createdAt,
    };

    this.heroesState.update((heroes) =>
      heroes.map((hero) => (hero.id === id ? updatedHero : hero)),
    );

    return updatedHero;
  }

  delete(id: string): boolean {
    const exists = this.heroesState().some((hero) => hero.id === id);

    if (!exists) {
      return false;
    }

    this.heroesState.update((heroes) => heroes.filter((hero) => hero.id !== id));

    return true;
  }
}
