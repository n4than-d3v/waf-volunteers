import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        if (
          !(
            router.url.includes('/login') ||
            router.url.includes('/install') ||
            router.url.includes('/forgot-password') ||
            router.url.includes('/reset-password')
          )
        ) {
          router.navigate(['/login']);
        }
      }

      return throwError(() => error);
    }),
  );
};
