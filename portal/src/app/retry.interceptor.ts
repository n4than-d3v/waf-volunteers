import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import { timer } from 'rxjs';

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    retry({
      count: 5,
      delay: (error: HttpErrorResponse, retryCount: number) => {
        if (error.status === 401) {
          throw error;
        }

        if (error.status === 0 || error.status >= 500) {
          const backoffTime = retryCount * 1000;
          return timer(backoffTime);
        }

        throw error;
      },
    }),
  );
};
