import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuarios } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { RegistroComponent } from './registro/registro.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @Output() datosUsuario: EventEmitter<Usuarios> = new EventEmitter<Usuarios>();
  correo: string = '';
  contrasena: string = '';

  constructor(private authService: AuthService, private router: Router, private modal: NgbModal) {}

  login(): void {
    this.authService.loginToServer(this.correo, this.contrasena).subscribe({
      next: (response: any) => {
        console.log('Response:', response);  // Agrega este log para ver la respuesta
  
        if (response && response.success) {
          this.authService.setLoggedInStatus(true);
  
          const usuario: Usuarios = response.usuario[0];
          this.authService.setCurrentUser(usuario);
  
          // Emitir los datos del usuario
          this.datosUsuario.emit(usuario);
  
          // Navegar según el rol del usuario
          if (usuario.tipoUsuario === "Cliente") {
            this.router.navigate(['/home']);
          } else if (usuario.tipoUsuario === "Especialista") {
            this.router.navigate(['/home-admin']);
          }
        } else {
          // Manejo de error en caso de que el éxito sea falso
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.',
          });
        }
      },
      error: (err) => {
        // Manejo de error para problemas con el servidor o la red
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al iniciar sesión. Por favor, inténtalo de nuevo.',
        });
        console.error('Login error:', err);
      }
    });
  }

  openModal() {
    const modalRef = this.modal.open(RegistroComponent, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });
  }

}
