import { Component, DestroyRef, inject, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';

import { CreateHero, Hero } from '../../../../core/models/hero.model';
import { HeroService } from '../../../../core/services/hero';
import { HeroForm } from '../../components/hero-form/hero-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-hero-form-page',
  imports: [HeroForm, MatSnackBarModule],
  templateUrl: './hero-form-page.html',
  styleUrl: './hero-form-page.scss',
})
export class HeroFormPage {
  private readonly heroService = inject(HeroService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly heroId = this.route.snapshot.paramMap.get('id');
  protected readonly hero = signal<Hero | null>(null);
  protected readonly isEditMode = this.heroId !== null;

  constructor() {
    if (this.isEditMode && this.heroId) {
      this.loadHero(this.heroId);
    }
  }

  private loadHero(id: string): void {
    this.heroService
      .getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (hero) => {
          this.hero.set(hero);
        },
        error: () => {
          this.snackBar.open('El héroe no existe', 'Cerrar', {
            duration: 3000,
          });
          void this.router.navigate(['/heroes']);
        },
      });
  }

  protected onSave(hero: CreateHero): void {
    if (this.isEditMode && this.heroId) {
      this.updateHero(this.heroId, hero);
      return;
    }
    this.createHero(hero);
  }

  protected onCancel(): void {
    void this.router.navigate(['/heroes']);
  }

  private createHero(hero: CreateHero): void {
    this.heroService
      .create(hero)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.snackBar.open('Héroe creado correctamente', 'Cerrar', {
          duration: 3000,
        });
        void this.router.navigate(['/heroes']);
      });
  }

  private updateHero(id: string, hero: CreateHero): void {
    this.heroService
      .update(id, hero)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.snackBar.open('Héroe actualizado correctamente', 'Cerrar', {
            duration: 3000,
          });
          void this.router.navigate(['/heroes']);
        },
        error: () => {
          this.snackBar.open('No se pudo actualizar el héroe', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }
}
