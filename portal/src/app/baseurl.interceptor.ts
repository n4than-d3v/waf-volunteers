import { HttpInterceptorFn } from '@angular/common/http';
import { isDevMode } from '@angular/core';

const BASE_URL = isDevMode() ? 'http://localhost:5201' : '';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq = req.clone({
    url: `${BASE_URL}/api/${req.url}`,
  });
  return next(apiReq);
};
