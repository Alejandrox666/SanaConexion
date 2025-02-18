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
        catchError((error: HttpErrorResponse) => {
          let errorCode = error.status || 500;
          console.log(errorCode);
          console.log("hola")
          console.log('Tipo de error:', typeof error.status);  // Verifica si es un número
          console.log('Código de error:', error.status); 
          this.router.navigate(['/error'], { queryParams: { code: errorCode } });
          return throwError(() => new Error('Error en la solicitud'));
        })
      );
    }

  
}
