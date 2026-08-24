import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { Hero } from '../../../../core/models/hero.model';

@Component({
  selector: 'app-hero-delete-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './hero-delete-dialog.html',
  styleUrl: './hero-delete-dialog.scss',
})
export class HeroDeleteDialog {
  private readonly dialogRef = inject<MatDialogRef<HeroDeleteDialog, boolean>>(MatDialogRef);
  protected readonly hero = inject<Hero>(MAT_DIALOG_DATA);

  protected confirm(): void {
    this.dialogRef.close(true);
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }
}
