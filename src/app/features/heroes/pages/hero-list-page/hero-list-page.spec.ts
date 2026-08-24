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

  const router = {
    navigate: vi.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroListPage],
      providers: [
        HeroService,
        {
          provide: Router,
          useValue: router,
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
    expect(component['paginatedHeroes']().length).toBe(5);

    component['onPageChange']({
      pageIndex: 1,
      pageSize: 5,
      length: heroService.getAll().length,
      previousPageIndex: 0,
    });

    expect(component['pageIndex']()).toBe(1);
    expect(component['pageSize']()).toBe(5);
    expect(component['paginatedHeroes']().length).toBe(5);
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

    const hero = heroService.getById('1');

    expect(hero).toBeDefined();

    component['deleteHero'](hero!);

    expect(heroService.getById('1')).toBeDefined();
    expect(snackBarSpy).not.toHaveBeenCalled();
  });

  it('should delete hero when dialog is confirmed', () => {
    vi.spyOn(dialog, 'open').mockReturnValue(createDialogRef(true));

    const deleteSpy = vi.spyOn(heroService, 'delete');

    const snackBarSpy = vi
      .spyOn(snackBar, 'open')
      .mockReturnValue({} as ReturnType<MatSnackBar['open']>);

    const hero = heroService.getById('1');

    expect(hero).toBeDefined();

    component['deleteHero'](hero!);

    expect(deleteSpy).toHaveBeenCalledWith('1');
    expect(heroService.getById('1')).toBeUndefined();

    expect(snackBarSpy).toHaveBeenCalledWith('Héroe eliminado correctamente', 'Cerrar', {
      duration: 3000,
    });
  });

  it('should adjust current page after deleting the last heroes from a page', () => {
    vi.spyOn(dialog, 'open').mockReturnValue(createDialogRef(true));

    vi.spyOn(snackBar, 'open').mockReturnValue({} as ReturnType<MatSnackBar['open']>);

    component['pageSize'].set(5);
    component['pageIndex'].set(2);

    const hero11 = heroService.getById('11');
    const hero12 = heroService.getById('12');

    expect(hero11).toBeDefined();
    expect(hero12).toBeDefined();

    component['deleteHero'](hero11!);
    component['deleteHero'](hero12!);

    expect(heroService.getAll().length).toBe(10);
    expect(component['pageIndex']()).toBe(1);
  });
});

function createDialogRef(result: boolean): MatDialogRef<HeroDeleteDialog, boolean> {
  return {
    afterClosed: () => of(result),
  } as unknown as MatDialogRef<HeroDeleteDialog, boolean>;
}
