import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { HeroService } from '../../../../core/services/hero';
import { HeroDeleteDialog } from '../../components/hero-delete-dialog/hero-delete-dialog';
import { HeroListPage } from './hero-list-page';

describe('HeroListPage', () => {
  let component: HeroListPage;
  let fixture: ComponentFixture<HeroListPage>;

  let heroService: HeroService;
  let dialog: MatDialog;
  let snackBar: MatSnackBar;

  const heroes = [
    {
      id: '1',
      name: 'Superman',
      realName: 'Clark Kent',
      universe: 'DC' as const,
      description: 'Hero',
      powers: ['Strength'],
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'Batman',
      realName: 'Bruce Wayne',
      universe: 'DC' as const,
      description: 'Hero',
      powers: ['Intelligence'],
      createdAt: new Date(),
    },
  ];

  const heroServiceMock = {
    getAll: vi.fn(() => of(heroes)),

    searchByName: vi.fn((value: string) =>
      of(heroes.filter((hero) => hero.name.toLowerCase().includes(value.toLowerCase()))),
    ),

    getById: vi.fn((id: string) => of(heroes.find((hero) => hero.id === id))),

    delete: vi.fn(() => of(void 0)),
  };

  const router = {
    navigate: vi.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    vi.clearAllMocks();

    await TestBed.configureTestingModule({
      imports: [HeroListPage],
      providers: [
        {
          provide: HeroService,
          useValue: heroServiceMock,
        },
        {
          provide: Router,
          useValue: router,
        },
        {
          provide: MatDialog,
          useValue: {
            open: vi.fn(),
          },
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroListPage);

    component = fixture.componentInstance;

    heroService = component['heroService'];
    dialog = component['dialog'];
    snackBar = component['snackBar'];

    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render heroes', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Superman');
    expect(element.textContent).toContain('Batman');
  });

  it('should filter heroes by name', () => {
    const input = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;

    input.value = 'bat';
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Batman');
    expect(element.textContent).not.toContain('Superman');
  });

  it('should reset page index when searching', () => {
    component['pageIndex'].set(2);

    const input = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;

    input.value = 'bat';
    input.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(component['pageIndex']()).toBe(0);
  });

  it('should paginate heroes', () => {
    component['onPageChange']({
      pageIndex: 1,
      pageSize: 5,
      length: heroes.length,
      previousPageIndex: 0,
    });

    expect(component['pageIndex']()).toBe(1);
    expect(component['pageSize']()).toBe(5);
  });

  it('should navigate to create hero', () => {
    component['addHero']();

    expect(router.navigate).toHaveBeenCalledWith(['/heroes/new']);
  });

  it('should navigate to edit hero', () => {
    component['editHero']('1');

    expect(router.navigate).toHaveBeenCalledWith(['/heroes', '1', 'edit']);
  });

  it('should not delete hero when dialog is cancelled', () => {
    vi.spyOn(dialog, 'open').mockReturnValue(createDialogRef(false));

    const snackBarSpy = vi.spyOn(snackBar, 'open');

    component['deleteHero'](heroes[0]);

    expect(heroService.delete).not.toHaveBeenCalled();

    expect(snackBarSpy).not.toHaveBeenCalled();
  });

  it('should delete hero when dialog is confirmed', () => {
    vi.spyOn(dialog, 'open').mockReturnValue(createDialogRef(true));

    const snackBarSpy = vi.spyOn(snackBar, 'open');

    component['deleteHero'](heroes[0]);

    expect(heroService.delete).toHaveBeenCalledWith('1');

    expect(snackBarSpy).toHaveBeenCalledWith('Héroe eliminado correctamente', 'Cerrar', {
      duration: 3000,
    });
  });
});

function createDialogRef(result: boolean): MatDialogRef<HeroDeleteDialog, boolean> {
  return {
    afterClosed: () => of(result),
  } as unknown as MatDialogRef<HeroDeleteDialog, boolean>;
}
