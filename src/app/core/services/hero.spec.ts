import { TestBed } from '@angular/core/testing';

import { CreateHero, Hero } from '../models/hero.model';
import { HeroService } from './hero';

describe('HeroService', () => {
  let service: HeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all heroes', () => {
      service.getAll().subscribe((heroes) => {
        expect(heroes.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getById', () => {
    it('should return a hero by id', () => {
      service.getById('1').subscribe((hero) => {
        expect(hero.name).toBe('Superman');
      });
    });

    it('should return an error when hero does not exist', () => {
      service.getById('unknown-id').subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(Error);
        },
      });
    });
  });

  describe('searchByName', () => {
    it('should search heroes by partial name', () => {
      service.searchByName('man').subscribe((heroes) => {
        expect(heroes.length).toBeGreaterThan(0);
        expect(heroes.every((hero) => hero.name.toLowerCase().includes('man'))).toBe(true);
      });
    });

    it('should be case insensitive', () => {
      let lowerCaseResult: Hero[] = [];
      let upperCaseResult: Hero[] = [];

      service.searchByName('man').subscribe((heroes) => {
        lowerCaseResult = heroes;
      });

      service.searchByName('MAN').subscribe((heroes) => {
        upperCaseResult = heroes;
      });

      expect(upperCaseResult).toEqual(lowerCaseResult);
    });

    it('should return all heroes when query is empty', () => {
      let allHeroes: Hero[] = [];
      let searchResult: Hero[] = [];

      service.getAll().subscribe((heroes) => {
        allHeroes = heroes;
      });

      service.searchByName('').subscribe((heroes) => {
        searchResult = heroes;
      });

      expect(searchResult).toEqual(allHeroes);
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

      let totalBefore = 0;
      service.getAll().subscribe((heroes) => {
        totalBefore = heroes.length;
      });

      service.create(hero).subscribe((createdHero) => {
        expect(createdHero.id).toBeTruthy();
        expect(createdHero.createdAt).toBeInstanceOf(Date);
      });

      service.getAll().subscribe((heroes) => {
        expect(heroes.length).toBe(totalBefore + 1);
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
          expect(hero.name).toBe('Superman Updated');
        });
    });
    it('should return an error when hero does not exist', () => {
      service.update('unknown-id', { name: 'Unknown' }).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(Error);
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete a hero', () => {
      service.delete('1').subscribe();
      service.getAll().subscribe((heroes) => {
        expect(heroes.some((hero) => hero.id === '1')).toBe(false);
      });
    });

    it('should return an error when hero does not exist', () => {
      service.delete('unknown-id').subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(Error);
        },
      });
    });
  });
});
