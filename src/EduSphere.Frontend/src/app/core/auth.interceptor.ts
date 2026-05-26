import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const secured = request.clone({
    setHeaders: {
      Authorization: 'Bearer local-demo-token',
      'X-Tenant-Id': 'demo-university'
    }
  });

  return next(secured);
};
