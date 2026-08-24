import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { CreateHero, Hero, UpdateHero } from '../models/hero.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/heroes`;

  getAll(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.apiUrl);
  }

  getById(id: string): Observable<Hero> {
    return this.http.get<Hero>(`${this.apiUrl}/${id}`);
  }

  searchByName(query: string): Observable<Hero[]> {
    const searchTerm = query.trim();

    return this.http.get<Hero[]>(`${this.apiUrl}?name_like=${searchTerm}`);
  }

  create(hero: CreateHero): Observable<Hero> {
    return this.http.post<Hero>(this.apiUrl, {
      ...hero,
      createdAt: new Date(),
    });
  }

  update(id: string, changes: UpdateHero): Observable<Hero | null> {
    return this.http.put<Hero>(`${this.apiUrl}/${id}`, changes);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
