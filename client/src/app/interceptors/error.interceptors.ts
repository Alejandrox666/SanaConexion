import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  /**constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorCode = error.status || 500;
        this.router.navigate(['/error'], { queryParams: { code: errorCode } });
        return throwError(() => new Error('Error en la solicitud'));
      })
    );
  }**/


    constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        // Forzar error 404
        if (req.url.includes('/forzar404')) {
          this.router.navigate(['/error'], { queryParams: { code: 404 } });
          return throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' }));
        }

        // Forzar error 500
        if (req.url.includes('/forzar500')) {
          this.router.navigate(['/error'], { queryParams: { code: 500 } });
          return throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' }));
        }

        // Forzar error 403
        if (req.url.includes('/forzar403')) {
          this.router.navigate(['/error'], { queryParams: { code: 403 } });
          return throwError(() => new HttpErrorResponse({ status: 403, statusText: 'Forbidden' }));
        }

        // Forzar error 401
        if (req.url.includes('/forzar401')) {
          this.router.navigate(['/error'], { queryParams: { code: 401 } });
          return throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' }));
        }

        // Si no es uno de los errores forzados, simplemente devuelve el error original
        return throwError(() => err);
      })
    );
  }
}
