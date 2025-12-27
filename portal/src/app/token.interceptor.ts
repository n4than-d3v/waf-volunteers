import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenProvider } from './shared/token.provider';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenProvider = inject(TokenProvider);
  const apiReq = req.clone({
    headers: req.headers.set(
      'Authorization',
      'Bearer ' + tokenProvider.getToken()
    ),
  });
  return next(apiReq);
};
