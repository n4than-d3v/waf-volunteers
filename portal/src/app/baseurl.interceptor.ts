import { HttpInterceptorFn } from '@angular/common/http';

const BASE_URL = '';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (/^https?:\/\//i.test(req.url)) {
    return next(req);
  }

  const url = req.url.startsWith('/') ? req.url.slice(1) : req.url;

  return next(
    req.clone({
      url: `${BASE_URL}/api/${url}`,
    }),
  );
};
