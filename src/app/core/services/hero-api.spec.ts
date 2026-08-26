import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { HeroApiService } from './hero-api';
import { CreateHero } from '../models/hero.model';

describe('HeroApiService', () => {
  let service: HeroApiService;
  let httpMock: HttpTestingController;

  const apiUrl = 'http://localhost:3000/heroes';

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(HeroApiService);

    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all heroes', () => {
      service.getAll().subscribe((heroes) => {
        expect(heroes.length).toBeGreaterThan(0);
      });

      const req = httpMock.expectOne(apiUrl);

      expect(req.request.method).toBe('GET');

      req.flush([
        {
          id: '1',
          name: 'Superman',
          realName: 'Clark Kent',
          universe: 'DC',
          description: 'Hero',
          powers: ['Strength'],
          createdAt: new Date(),
        },
      ]);
    });
  });

  describe('getById', () => {
    it('should return a hero by id', () => {
      service.getById('1').subscribe((hero) => {
        expect(hero.name).toBe('Superman');
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);

      expect(req.request.method).toBe('GET');

      req.flush({
        id: '1',
        name: 'Superman',
        realName: 'Clark Kent',
        universe: 'DC',
        description: 'Hero',
        powers: ['Strength'],
        createdAt: new Date(),
      });
    });
  });

  describe('searchByName', () => {
    it('should search heroes by name', () => {
      service.searchByName('man').subscribe((heroes) => {
        expect(heroes.length).toBe(2);
      });

      const req = httpMock.expectOne(`${apiUrl}?name_like=man`);

      expect(req.request.method).toBe('GET');

      req.flush([
        {
          id: '1',
          name: 'Superman',
          realName: 'Clark',
          universe: 'DC',
          description: '',
          powers: [],
          createdAt: new Date(),
        },
        {
          id: '2',
          name: 'Spiderman',
          realName: 'Peter',
          universe: 'Marvel',
          description: '',
          powers: [],
          createdAt: new Date(),
        },
      ]);
    });
  });

  describe('create', () => {
    it('should create a hero', () => {
      const hero: CreateHero = {
        name: 'Daredevil',
        realName: 'Matt Murdock',
        universe: 'Marvel',
        description: 'Hero',
        powers: ['Combat'],
      };

      service.create(hero).subscribe((createdHero) => {
        expect(createdHero.id).toBeTruthy();
      });

      const req = httpMock.expectOne(apiUrl);

      expect(req.request.method).toBe('POST');

      req.flush({
        ...hero,
        id: '10',
        createdAt: new Date(),
      });
    });
  });

  describe('update', () => {
    it('should update a hero', () => {
      service
        .update('1', {
          name: 'Superman Updated',
        })
        .subscribe((hero) => {
          expect(hero?.name).toBe('Superman Updated');
        });

      const req = httpMock.expectOne(`${apiUrl}/1`);

      expect(req.request.method).toBe('PUT');

      req.flush({
        id: '1',
        name: 'Superman Updated',
        realName: 'Clark Kent',
        universe: 'DC',
        description: '',
        powers: [],
        createdAt: new Date(),
      });
    });
  });

  describe('delete', () => {
    it('should delete a hero', () => {
      service.delete('1').subscribe(() => {
        expect(true).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);

      expect(req.request.method).toBe('DELETE');

      req.flush(null);
    });
  });
});
