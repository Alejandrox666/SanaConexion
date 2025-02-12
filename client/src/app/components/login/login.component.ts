import { Component, EventEmitter, inject, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuarios } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
import { RegistroComponent } from './registro/registro.component';
import { ClientesService } from 'src/app/services/clientes.service';
import { ReCaptchaV3Service, RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @Output() datosUsuario: EventEmitter<Usuarios> = new EventEmitter<Usuarios>();
  Email: string = '';
  Password: string = '';
  captchaToken: string | null = null;


  constructor(private authService: AuthService, private router: Router, private modal: NgbModal, private clienteService: ClientesService) { }

  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  async login(): Promise<void> {
    if (!this.Email || !this.Password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor, completa todos los campos.',
      });
      return;
    }
  
    if (!this.captchaToken) {
      Swal.fire({
        icon: 'warning',
        title: 'Verificación requerida',
        text: 'Por favor, resuelve el reCAPTCHA antes de iniciar sesión.',
      });
      return;
    }
  
    const encryptedPassword = await this.hashPassword(this.Password);
  
    this.authService.loginToServer(this.Email, encryptedPassword).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.authService.setLoggedInStatus(true);
          const usuario: Usuarios = response.usuario[0];
          this.authService.setCurrentUser(usuario);
          this.datosUsuario.emit(usuario);
          this.clienteService.setUsuarioTemporal(usuario);
          const destination = usuario.tipoUsuario === "Cliente" ? '/vistaClient' : '/inicioE';
          this.router.navigate([destination]);
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Correo o contraseña incorrectos. Por favor, inténtalo de nuevo.',
          });
        }
      },
      error: (err) => {
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

  //Captcha
  recapchaService = inject(ReCaptchaV3Service)

  captcha() {
    this.recapchaService.execute('6LejcNUqAAAAAHMOxMaO3QzPxEM8YMCRqFVY3dMe').subscribe((token) => {
      console.log(token)
    })
  }

  @ViewChild(RecaptchaComponent) captchaRef!: RecaptchaComponent;

  captchaBox(token: string) {
    this.captchaToken = token;
  }


}
