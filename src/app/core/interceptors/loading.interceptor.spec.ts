import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

import { LoadingService } from '../services/loading';
import { loadingInterceptor } from './loading.interceptor';

describe('loadingInterceptor', () => {
  let loadingService: {
    show: ReturnType<typeof vi.fn>;
    hide: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    loadingService = {
      show: vi.fn(),
      hide: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: LoadingService,
          useValue: loadingService,
        },
      ],
    });
  });

  it('should show and hide loading state', async () => {
    const request = new HttpRequest('GET', '/test');

    const next = vi.fn(() =>
      of(
        new HttpResponse({
          body: {},
        }),
      ),
    );

    await TestBed.runInInjectionContext(async () => {
      await new Promise<void>((resolve) => {
        loadingInterceptor(request, next).subscribe({
          complete: () => resolve(),
        });
      });
    });

    expect(loadingService.show).toHaveBeenCalled();

    expect(loadingService.hide).toHaveBeenCalled();
  });});
