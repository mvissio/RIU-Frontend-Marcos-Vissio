import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';

import { Hero } from '../../../../core/models/hero.model';
import { HeroService } from '../../../../core/services/hero';
import { HeroDeleteDialog } from '../../components/hero-delete-dialog/hero-delete-dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';
import { NotificationService } from '../../../../core/services/notification';

@Component({
  selector: 'app-hero-list-page',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatDialogModule,
  ],
  templateUrl: './hero-list-page.html',
  styleUrl: './hero-list-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroListPage implements OnInit {
  private readonly _heroService = inject(HeroService);
  private readonly _router = inject(Router);
  private readonly _dialog = inject(MatDialog);
  private readonly _notificationService = inject(NotificationService);
  private readonly _destroyRef = inject(DestroyRef);

  protected readonly searchTerm = signal('');
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(5);
  protected readonly heroes = signal<Hero[]>([]);

  protected readonly displayedColumns = ['name', 'realName', 'universe', 'powers', 'actions'];

  ngOnInit(): void {
    this._loadHeroes();
  }

  protected readonly paginatedHeroes = computed(() => {
    const heroes = this.heroes();
    const pageSize = this.pageSize();
    const maxPageIndex = Math.max(Math.ceil(heroes.length / pageSize) - 1, 0);
    const currentPageIndex = Math.min(this.pageIndex(), maxPageIndex);
    const start = currentPageIndex * pageSize;
    return heroes.slice(start, start + pageSize);
  });

  protected onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.pageIndex.set(0);
    this.searchTerm.set(input.value);
    this._loadHeroes(input.value);
  }

  protected onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  protected addHero(): void {
    void this._router.navigate(['/heroes/new']);
  }

  protected editHero(id: string): void {
    void this._router.navigate(['/heroes', id, 'edit']);
  }

  protected deleteHero(hero: Hero): void {
    const dialogRef = this._dialog.open(HeroDeleteDialog, {
      width: '420px',
      data: hero,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this._heroService.delete(hero.id)),
        takeUntilDestroyed(this._destroyRef),
      )
      .subscribe(() => {
        this._loadHeroes(this.searchTerm());
        this._adjustCurrentPage();
        this._notificationService.show('Héroe eliminado correctamente');
      });
  }
  private _adjustCurrentPage(): void {
    const totalHeroes = this.heroes().length;
    const lastPageIndex = Math.max(Math.ceil(totalHeroes / this.pageSize()) - 1, 0);
    if (this.pageIndex() > lastPageIndex) {
      this.pageIndex.set(lastPageIndex);
    }
  }

  private _loadHeroes(searchTerm = ''): void {
    const heroes$ = searchTerm.trim()
      ? this._heroService.searchByName(searchTerm)
      : this._heroService.getAll();

    heroes$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((heroes) => {
      this.heroes.set(heroes);
    });
  }
}
