import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Usuarios } from './models/models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoggedIn: boolean = false;
  tipoUsuario: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Suscribirse a los cambios en el usuario
    this.authService.getCurrentUser().subscribe((user: Usuarios | null) => {
      this.updateUserStatus(user);
    });

    // Obtener el estado de autenticación inicial
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  private updateUserStatus(user: Usuarios | null) {
    this.isLoggedIn = !!user;
    this.tipoUsuario = user?.tipoUsuario || null;
  }

  getNavComponent() {
    if (!this.isLoggedIn) {
      return 'app-navigation'; // Barra de navegación por defecto
    }
    return this.tipoUsuario === "Cliente" ? 'app-navigation-c' : 'app-navbar'; // Mostrar según tipo de usuario
  }
}