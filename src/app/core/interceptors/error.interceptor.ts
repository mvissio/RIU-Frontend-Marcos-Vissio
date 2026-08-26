import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'Ha ocurrido un error';
      if (error.status === 0) {
        message = 'No hay conexión con el servidor';
      }
      if (error.status >= 500) {
        message = 'Error interno del servidor';
      }
      notification.show(message);
      return throwError(() => error);
    }),
  );
};
