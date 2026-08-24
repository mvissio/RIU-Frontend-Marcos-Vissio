import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { throwError } from 'rxjs';

import { errorInterceptor } from './error.interceptor';
import { NotificationService } from '../services/notification';

describe('errorInterceptor', () => {
  let notificationService: {
    show: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    notificationService = {
      show: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: NotificationService,
          useValue: notificationService,
        },
      ],
    });
  });

  function executeInterceptor(error: HttpErrorResponse): void {
    const request = new HttpRequest('GET', '/heroes');

    TestBed.runInInjectionContext(() => {
      errorInterceptor(request, () => throwError(() => error)).subscribe({
        error: () => {},
      });
    });
  }

  it('should show generic error message', () => {
    executeInterceptor(
      new HttpErrorResponse({
        status: 400,
      }),
    );

    expect(notificationService.show).toHaveBeenCalledWith('Ha ocurrido un error');
  });

  it('should show connection error message when status is 0', () => {
    executeInterceptor(
      new HttpErrorResponse({
        status: 0,
      }),
    );

    expect(notificationService.show).toHaveBeenCalledWith('No hay conexión con el servidor');
  });

  it('should show server error message when status is 500', () => {
    executeInterceptor(
      new HttpErrorResponse({
        status: 500,
      }),
    );

    expect(notificationService.show).toHaveBeenCalledWith('Error interno del servidor');
  });
});
