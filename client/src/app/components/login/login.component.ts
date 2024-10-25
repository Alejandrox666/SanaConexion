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
  Email: string = '';
  Password: string = '';

  constructor(private authService: AuthService, private router: Router, private modal: NgbModal) {}

  // Método para encriptar la contraseña (igual al utilizado en el registro)
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  async login(): Promise<void> {
    const encryptedPassword = await this.hashPassword(this.Password);

    this.authService.loginToServer(this.Email, encryptedPassword).subscribe({
      next: (response: any) => {
        console.log('Response:', response);
    
        if (response && response.success) {
          this.authService.setLoggedInStatus(true);
    
          const usuario: Usuarios = response.usuario[0];
          this.authService.setCurrentUser(usuario);
    
          // Emitir los datos del usuario
          this.datosUsuario.emit(usuario);
    
          // Navegar según el rol del usuario
          const destination = usuario.tipoUsuario === "Cliente" ? '/home' : '/inicioE';
          this.router.navigate([destination]);
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
