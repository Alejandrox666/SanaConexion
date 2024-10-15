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

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.getCurrentUser().pipe(
      take(1),
      map((user: Usuarios | null) => {
        // Check if user is authenticated and has the correct role
        if (user && user.tipoUsuario === 1) { // Asegurarse de que 'user' tenga el tipo correcto
          return true; // User is an admin
        } else if (user) {
          this.router.navigate(['/']); // Redirect non-admin users to the home page
          return false;
        } else {
          this.router.navigate(['/login']); // Redirect unauthenticated users to the login page
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
