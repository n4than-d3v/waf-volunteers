import { HttpInterceptorFn } from '@angular/common/http';

const BASE_URL = 'http://localhost:5201';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq = req.clone({
    url: `${BASE_URL}/api/${req.url}`,
  });
  return next(apiReq);
};
