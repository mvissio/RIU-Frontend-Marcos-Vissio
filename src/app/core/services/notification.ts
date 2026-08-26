import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly _snackBar = inject(MatSnackBar);

  show(message: string): void {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }
}
