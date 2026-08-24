import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Hero } from '../../../../core/models/hero.model';
import { HeroDeleteDialog } from './hero-delete-dialog';

describe('HeroDeleteDialog', () => {
  let fixture: ComponentFixture<HeroDeleteDialog>;

  const hero: Hero = {
    id: '1',
    name: 'Superman',
    realName: 'Clark Kent',
    universe: 'DC',
    description: 'Héroe de Metrópolis.',
    powers: ['Vuelo', 'Fuerza'],
    createdAt: new Date('2026-01-01'),
  };

  const dialogRef = {
    close: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroDeleteDialog],
      providers: [
        {
          provide: MatDialogRef,
          useValue: dialogRef,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: hero,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDeleteDialog);
    fixture.detectChanges();

    dialogRef.close.mockClear();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the hero name', () => {
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('Superman');
  });

  it('should confirm deletion', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');

    buttons[1].click();

    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should cancel deletion', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button');

    buttons[0].click();

    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
});
