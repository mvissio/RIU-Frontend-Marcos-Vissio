import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { CreateHero, Hero, UpdateHero } from '../models/hero.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HeroApiService {
  private readonly _http = inject(HttpClient);
  private readonly _apiUrl = `${environment.apiUrl}/heroes`;

  getAll(): Observable<Hero[]> {
    return this._http.get<Hero[]>(this._apiUrl);
  }

  getById(id: string): Observable<Hero> {
    return this._http.get<Hero>(`${this._apiUrl}/${id}`);
  }

  searchByName(query: string): Observable<Hero[]> {
    const searchTerm = query.trim();
    return this._http.get<Hero[]>(`${this._apiUrl}?name_like=${searchTerm}`);
  }

  create(hero: CreateHero): Observable<Hero> {
    return this._http.post<Hero>(this._apiUrl, {
      ...hero,
      createdAt: new Date(),
    });
  }

  update(id: string, changes: UpdateHero): Observable<Hero | null> {
    return this._http.put<Hero>(`${this._apiUrl}/${id}`, changes);
  }

  delete(id: string): Observable<void> {
    return this._http.delete<void>(`${this._apiUrl}/${id}`);
  }
}
