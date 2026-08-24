import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private readonly loadingState = signal(false);

  readonly loading = this.loadingState.asReadonly();

  show(): void {
    this.loadingState.set(true);
  }

  hide(): void {
    this.loadingState.set(false);
  }
}
