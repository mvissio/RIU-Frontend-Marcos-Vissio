import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { LoadingService } from '../../../core/services/loading';

@Component({
  selector: 'app-loading',
  imports: [MatProgressBarModule],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  protected readonly loadingService = inject(LoadingService);
}
