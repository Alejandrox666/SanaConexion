import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, Observable, take, tap } from 'rxjs';
import { Usuarios } from '../models/models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getCurrentUser().pipe(
      take(1),
      map((user: Usuarios | null) => {
        // Comprobar si el usuario está autenticado y su tipo de usuario
        if (user) {
          // Si es un especialista (ejemplo tipoUsuario === 3)
          if (user.tipoUsuario === "Especialista") {
            return true; // Permitir acceso a especialistas
          }
          // Si es un cliente (ejemplo tipoUsuario === 2)
          else if (user.tipoUsuario === "Cliente") {
            return true; // Permitir acceso a clientes
          } else {
            this.router.navigate(['/login']); // Redirigir a la página principal si el tipo de usuario no es válido
            return false;
          }
        } else {
          this.router.navigate(['/login']); // Redirigir a los usuarios no autenticados a la página de inicio de sesión
          return false;
        }
      }),
      tap(isAuthorized => {
        if (!isAuthorized) {
          console.log('Access denied');
        }
      })
    );
  }
}