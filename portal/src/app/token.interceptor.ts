import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq = req.clone({
    headers: req.headers.set(
      'Authorization',
      'Bearer ' + (localStorage.getItem('token') || '')
    ),
  });
  return next(apiReq);
};
