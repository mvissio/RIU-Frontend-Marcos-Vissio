import { TestBed } from '@angular/core/testing';

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
      const heroes = service.getAll();

      expect(heroes.length).toBeGreaterThan(0);
    });
  });

  describe('getById', () => {
    it('should return a hero by id', () => {
      const hero = service.getById('1');

      expect(hero).toBeDefined();
      expect(hero?.name).toBe('Superman');
    });

    it('should return undefined when hero does not exist', () => {
      expect(service.getById('test-id')).toBeUndefined();
    });
  });

  describe('searchByName', () => {
    it('should search heroes by partial name', () => {
      const heroes = service.searchByName('man');

      expect(heroes.length).toBeGreaterThan(0);

      expect(heroes.every((hero) => hero.name.toLowerCase().includes('man'))).toBe(true);
    });

    it('should be case insensitive', () => {
      const lowerCase = service.searchByName('man');
      const upperCase = service.searchByName('MAN');

      expect(upperCase).toEqual(lowerCase);
    });

    it('should trim the search term', () => {
      const normalSearch = service.searchByName('man');

      const searchWithSpaces = service.searchByName('  man  ');

      expect(searchWithSpaces).toEqual(normalSearch);
    });

    it('should return all heroes when query is empty', () => {
      expect(service.searchByName('')).toEqual(service.getAll());
    });

    it('should return an empty array when there are no matches', () => {
      expect(service.searchByName('zzzzzz')).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a new hero', () => {
      const totalBefore = service.getAll().length;

      const hero = service.create({
        name: 'Daredevil',
        realName: 'Matt Murdock',
        universe: 'Marvel',
        description: 'Héroe de Hell’s Kitchen.',
        powers: ['Sentidos', 'Combate'],
      });

      expect(hero.id).toBeTruthy();
      expect(hero.createdAt).toBeInstanceOf(Date);

      expect(service.getAll().length).toBe(totalBefore + 1);

      expect(service.getById(hero.id)).toEqual(hero);
    });
  });

  describe('update', () => {
    it('should update an existing hero', () => {
      const originalHero = service.getById('1');

      const updatedHero = service.update('1', {
        name: 'Superman Updated',
      });

      expect(updatedHero).toBeDefined();
      expect(updatedHero?.name).toBe('Superman Updated');

      expect(updatedHero?.id).toBe(originalHero?.id);

      expect(updatedHero?.createdAt).toEqual(originalHero?.createdAt);
    });

    it('should return undefined when hero does not exist', () => {
      const hero = service.update('test-id', {
        name: 'Test',
      });

      expect(hero).toBeUndefined();
    });
  });

  describe('delete', () => {
    it('should delete an existing hero', () => {
      const totalBefore = service.getAll().length;

      const deleted = service.delete('1');

      expect(deleted).toBe(true);
      expect(service.getById('1')).toBeUndefined();

      expect(service.getAll().length).toBe(totalBefore - 1);
    });

    it('should return false when hero does not exist', () => {
      const totalBefore = service.getAll().length;

      const deleted = service.delete('test-id');

      expect(deleted).toBe(false);

      expect(service.getAll().length).toBe(totalBefore);
    });
  });
});
