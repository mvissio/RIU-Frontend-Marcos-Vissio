import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { CreateHero } from '../../../../core/models/hero.model';
import { HeroService } from '../../../../core/services/hero';
import { HeroFormPage } from './hero-form-page';

describe('HeroFormPage', () => {
  let component: HeroFormPage;
  let fixture: ComponentFixture<HeroFormPage>;

  const router = {
    navigate: vi.fn().mockResolvedValue(true),
  };

  const snackBar = {
    open: vi.fn(),
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

    snackBar.open.mockClear();

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

    expect(snackBar.open).toHaveBeenCalledWith('Héroe creado correctamente', 'Cerrar', {
      duration: 3000,
    });

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

    expect(snackBar.open).toHaveBeenCalledWith('Héroe actualizado correctamente', 'Cerrar', {
      duration: 3000,
    });

    expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
  });

  it('should show an error when update fails', async () => {
    await createComponent({
      id: '1',
    });

    heroServiceMock.update.mockReturnValue(throwError(() => new Error('Update error')));

    component['onSave'](hero);

    expect(snackBar.open).toHaveBeenCalledWith('No se pudo actualizar el héroe', 'Cerrar', {
      duration: 3000,
    });

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

    expect(snackBar.open).toHaveBeenCalledWith('El héroe no existe', 'Cerrar', {
      duration: 3000,
    });

    expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
  });

  async function createComponent(params: Record<string, string> = {}): Promise<void> {
    router.navigate.mockClear();

    snackBar.open.mockClear();

    await TestBed.configureTestingModule({
      imports: [HeroFormPage],

      providers: [
        {
          provide: HeroService,
          useValue: heroServiceMock,
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
    })

      .overrideProvider(MatSnackBar, {
        useValue: snackBar,
      })

      .compileComponents();

    fixture = TestBed.createComponent(HeroFormPage);

    component = fixture.componentInstance;

    fixture.detectChanges();
  }
});
