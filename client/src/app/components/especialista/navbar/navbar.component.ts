import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Usuarios } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isLoginPage: boolean = false;
  isHomePage: boolean = false;
  isLoggedIn: boolean = false;

  usuarios: Usuarios[] = []


  constructor(private router: Router, private authService: AuthService, private usuariosServ: UsuariosService) { }

  ngOnInit() {
   
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const url = this.router.url;
      this.isLoginPage = url === '/login';
      this.isHomePage = url === '/home';
    });

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

}
