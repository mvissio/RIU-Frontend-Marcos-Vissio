import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CreateHero } from '../../../../core/models/hero.model';
import { HeroService } from '../../../../core/services/hero';
import { NotificationService } from '../../../../core/services/notification';
import { HeroFormPage } from './hero-form-page';

describe('HeroFormPage', () => {
  let component: HeroFormPage;
  let fixture: ComponentFixture<HeroFormPage>;

  const router = {
    navigate: vi.fn().mockResolvedValue(true),
  };

  const notificationService = {
    show: vi.fn(),
  };

  const hero: CreateHero = {
    name: 'Daredevil',
    realName: 'Matt Murdock',
    universe: 'Marvel',
    description: 'Héroe de Hell Kitchen.',
    powers: ['Sentidos', 'Combate'],
  };

  const existingHero = {
    id: '1',
    name: 'Daredevil',
    realName: 'Matt Murdock',
    universe: 'Marvel' as const,
    description: 'Héroe de Hell Kitchen.',
    powers: ['Sentidos', 'Combate'],
    createdAt: new Date(),
  };

  const heroServiceMock = {
    getById: vi.fn((id: string) =>
      id === '1' ? of(existingHero) : throwError(() => new Error('Hero not found')),
    ),

    create: vi.fn(() => of(existingHero)),

    update: vi.fn(() => of(existingHero)),
  };

  afterEach(() => {
    router.navigate.mockClear();
    notificationService.show.mockClear();
    heroServiceMock.getById.mockClear();
    heroServiceMock.create.mockClear();
    heroServiceMock.update.mockClear();

    TestBed.resetTestingModule();
  });

  it('should create in create mode', async () => {
    await createComponent();

    expect(component).toBeTruthy();
    expect(component['isEditMode']).toBe(false);
    expect(component['hero']()).toBeNull();
  });

  it('should create a hero', async () => {
    await createComponent();

    component['onSave'](hero);

    expect(heroServiceMock.create).toHaveBeenCalledWith(hero);

    expect(notificationService.show).toHaveBeenCalledWith('Héroe creado correctamente');

    expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
  });

  it('should update an existing hero', async () => {
    await createComponent({
      id: '1',
    });

    component['onSave']({
      ...hero,
      name: 'Superman Updated',
    });

    expect(heroServiceMock.update).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({
        name: 'Superman Updated',
      }),
    );

    expect(notificationService.show).toHaveBeenCalledWith('Héroe actualizado correctamente');

    expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
  });

  it('should show an error when update fails', async () => {
    await createComponent({
      id: '1',
    });

    heroServiceMock.update.mockReturnValue(throwError(() => new Error('Update error')));

    component['onSave'](hero);

    expect(notificationService.show).toHaveBeenCalledWith('No se pudo actualizar el héroe');

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to the list when cancelling', async () => {
    await createComponent();

    component['onCancel']();

    expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
  });

  it('should handle an unknown hero id', async () => {
    heroServiceMock.getById.mockReturnValue(throwError(() => new Error('Hero not found')));

    await createComponent({
      id: 'unknown-id',
    });

    expect(notificationService.show).toHaveBeenCalledWith('El héroe no existe');

    expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
  });

  async function createComponent(params: Record<string, string> = {}): Promise<void> {
    router.navigate.mockClear();

    notificationService.show.mockClear();

    await TestBed.configureTestingModule({
      imports: [HeroFormPage],

      providers: [
        {
          provide: HeroService,
          useValue: heroServiceMock,
        },

        {
          provide: NotificationService,
          useValue: notificationService,
        },

        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap(params),
            },
          },
        },

        {
          provide: Router,
          useValue: router,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroFormPage);

    component = fixture.componentInstance;

    fixture.detectChanges();
  }
});
