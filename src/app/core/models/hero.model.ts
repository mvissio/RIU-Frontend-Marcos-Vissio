export type HeroUniverse = 'Marvel' | 'DC' | 'Independent';

export interface Hero {
  id: string;
  name: string;
  realName: string;
  universe: HeroUniverse;
  description: string;
  powers: string[];
  createdAt: Date;
}

export type CreateHero = Omit<Hero, 'id' | 'createdAt'>;

export type UpdateHero = Partial<CreateHero>;
