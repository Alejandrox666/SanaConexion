import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Usuarios } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navigation-c',
  templateUrl: './navigation-c.component.html',
  styleUrls: ['./navigation-c.component.css']
})
export class NavigationCComponent implements OnInit {
  isLoginPage: boolean = false;
  isHomePage: boolean = false;
  isRegistrosPage: boolean = false;
  isDestacadosPage: boolean = false;
  isLoggedIn: boolean = false;

  usuarios: Usuarios[] = []

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const url = this.router.url;
      this.isLoginPage = url === '/login';
      this.isHomePage = url === '/home';
    });

    // Suscríbete a los cambios en el estado de autenticación
    this.authService.getCurrentUser().subscribe((user: Usuarios | null) => {
      this.isLoggedIn = !!user;
      this.usuarios = user ? [user] : [];
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']); // Redirige al componente Home después de cerrar sesión
    this.isLoggedIn = false;
  }

  showToggleViewButton(): boolean {
    return !this.isLoginPage; // Muestra el botón en todas las páginas excepto en la de inicio de sesión
  }
}