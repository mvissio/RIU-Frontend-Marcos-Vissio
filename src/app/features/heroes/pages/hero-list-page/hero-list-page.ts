import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Router } from '@angular/router';

import { Hero } from '../../../../core/models/hero.model';
import { HeroService } from '../../../../core/services/hero';
import { HeroDeleteDialog } from '../../components/hero-delete-dialog/hero-delete-dialog';

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
    MatSnackBarModule,
  ],
  templateUrl: './hero-list-page.html',
  styleUrl: './hero-list-page.scss',
})
export class HeroListPage {
  private readonly heroService = inject(HeroService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  protected readonly searchTerm = signal('');
  protected readonly pageIndex = signal(0);
  protected readonly pageSize = signal(5);

  protected readonly displayedColumns = ['name', 'realName', 'universe', 'powers', 'actions'];

  protected readonly filteredHeroes = computed(() =>
    this.heroService.searchByName(this.searchTerm()),
  );

  protected readonly paginatedHeroes = computed(() => {
    const heroes = this.filteredHeroes();
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
  }

  protected onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  protected addHero(): void {
    void this.router.navigate(['/heroes/new']);
  }

  protected editHero(id: string): void {
    void this.router.navigate(['/heroes', id, 'edit']);
  }

  protected deleteHero(hero: Hero): void {
    const dialogRef = this.dialog.open(HeroDeleteDialog, {
      width: '420px',
      data: hero,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) {
        return;
      }

      const deleted = this.heroService.delete(hero.id);

      if (!deleted) {
        return;
      }

      this.adjustCurrentPage();

      this.snackBar.open('Héroe eliminado correctamente', 'Cerrar', {
        duration: 3000,
      });
    });
  }

  private adjustCurrentPage(): void {
    const totalHeroes = this.filteredHeroes().length;

    const lastPageIndex = Math.max(Math.ceil(totalHeroes / this.pageSize()) - 1, 0);

    if (this.pageIndex() > lastPageIndex) {
      this.pageIndex.set(lastPageIndex);
    }
  }
}
