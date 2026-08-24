import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';

import { CreateHero } from '../../../../core/models/hero.model';
import { HeroService } from '../../../../core/services/hero';
import { HeroFormPage } from './hero-form-page';

describe('HeroFormPage', () => {
  let component: HeroFormPage;
  let fixture: ComponentFixture<HeroFormPage>;
  let heroService: HeroService;

  const router = {
    navigate: vi.fn().mockResolvedValue(true),
  };

  const hero: CreateHero = {
    name: 'Daredevil',
    realName: 'Matt Murdock',
    universe: 'Marvel',
    description: 'Héroe de Hell Kitchen.',
    powers: ['Sentidos', 'Combate'],
  };

  afterEach(() => {
    vi.restoreAllMocks();
    TestBed.resetTestingModule();
  });

  it('should create in create mode', async () => {
    await createComponent();

    expect(component).toBeTruthy();
    expect(component['isEditMode']).toBe(false);
    expect(component['hero']).toBeNull();
  });

  it('should create a hero', async () => {
    await createComponent();

    const createSpy = vi.spyOn(heroService, 'create');

    const snackBarSpy = vi.spyOn(component['snackBar'], 'open');

    component['onSave'](hero);

    expect(createSpy).toHaveBeenCalledWith(hero);

    expect(snackBarSpy).toHaveBeenCalledWith('Héroe creado correctamente', 'Cerrar', {
      duration: 3000,
    });

    expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
  });

  it('should update an existing hero', async () => {
    await createComponent({ id: '1' });

    const updateSpy = vi.spyOn(heroService, 'update');

    const snackBarSpy = vi.spyOn(component['snackBar'], 'open');

    component['onSave']({
      ...hero,
      name: 'Superman Updated',
    });

    expect(updateSpy).toHaveBeenCalledWith(
      '1',
      expect.objectContaining({
        name: 'Superman Updated',
      }),
    );

    expect(snackBarSpy).toHaveBeenCalledWith('Héroe actualizado correctamente', 'Cerrar', {
      duration: 3000,
    });

    expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
  });

  it('should show an error when update fails', async () => {
    await createComponent({ id: '1' });

    vi.spyOn(heroService, 'update').mockReturnValue(undefined);

    const snackBarSpy = vi.spyOn(component['snackBar'], 'open');

    component['onSave'](hero);

    expect(snackBarSpy).toHaveBeenCalledWith('No se pudo actualizar el héroe', 'Cerrar', {
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
    const snackBarSpy = vi.spyOn(MatSnackBar.prototype, 'open');

    await createComponent({
      id: 'unknown-id',
    });

    expect(snackBarSpy).toHaveBeenCalledWith('El héroe no existe', 'Cerrar', {
      duration: 3000,
    });

    expect(router.navigate).toHaveBeenCalledWith(['/heroes']);
  });

  async function createComponent(params: Record<string, string> = {}): Promise<void> {
    router.navigate.mockClear();

    await TestBed.configureTestingModule({
      imports: [HeroFormPage],
      providers: [
        HeroService,
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

    heroService = component['heroService'];

    fixture.detectChanges();
  }
});
