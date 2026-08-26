import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CreateHero, Hero } from '../../../../core/models/hero.model';
import { HeroService } from '../../../../core/services/hero';
import { HeroForm } from '../../components/hero-form/hero-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService } from '../../../../core/services/notification';

@Component({
  selector: 'app-hero-form-page',
  imports: [HeroForm],
  templateUrl: './hero-form-page.html',
  styleUrl: './hero-form-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroFormPage {
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _heroService = inject(HeroService);
  private readonly _notificationService = inject(NotificationService);
  private readonly _destroyRef = inject(DestroyRef);

  protected readonly heroId = this._route.snapshot.paramMap.get('id');
  protected readonly hero = signal<Hero | null>(null);
  protected readonly isEditMode = this.heroId !== null;

  constructor() {
    if (this.isEditMode && this.heroId) {
      this._loadHero(this.heroId);
    }
  }

  private _loadHero(id: string): void {
    this._heroService
      .getById(id)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (hero) => {
          this.hero.set(hero);
        },
        error: () => {
          this._notificationService.show('El héroe no existe');
          void this._router.navigate(['/heroes']);
        },
      });
  }

  protected onSave(hero: CreateHero): void {
    if (this.isEditMode && this.heroId) {
      this._updateHero(this.heroId, hero);
      return;
    }
    this._createHero(hero);
  }

  protected onCancel(): void {
    void this._router.navigate(['/heroes']);
  }

  private _createHero(hero: CreateHero): void {
    this._heroService
      .create(hero)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe(() => {
        this._notificationService.show('Héroe creado correctamente');
        void this._router.navigate(['/heroes']);
      });
  }

  private _updateHero(id: string, hero: CreateHero): void {
    this._heroService
      .update(id, hero)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: () => {
          this._notificationService.show('Héroe actualizado correctamente');
          void this._router.navigate(['/heroes']);
        },
        error: () => {
          this._notificationService.show('No se pudo actualizar el héroe');
        },
      });
  }
}
