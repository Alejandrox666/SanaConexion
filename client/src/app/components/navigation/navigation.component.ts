import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Usuarios } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  isLoginPage: boolean = false;
  isHomePage: boolean = false;
  isDestacadosPage: boolean = false;
  isLoggedIn: boolean = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const url = this.router.url;
      this.isLoginPage = url === '/login';
      this.isHomePage = url === '/home';
      this.isDestacadosPage = url === '/destacados';
    });

    // Suscríbete a los cambios en el estado de autenticación
    this.authService.getCurrentUser().subscribe((user: Usuarios | null) => {
      this.isLoggedIn = !!user;
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.reload(); // Recarga la página automáticamente después de cerrar sesión
  }

  showToggleViewButton(): boolean {
    return !this.isLoginPage; // Muestra el botón en todas las páginas excepto en la de inicio de sesión
  }
}
