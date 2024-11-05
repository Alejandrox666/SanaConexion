import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-reposicion-contrasena',
  templateUrl: './reposicion-contrasena.component.html',
  styleUrls: ['./reposicion-contrasena.component.css']
})
export class ReposicionContrasenaComponent {
  reposicionForm!: FormGroup;
  emailSent: boolean = false;
  codeRequested: boolean = false;
  codeVerified: boolean = false;
  passwordChanged: boolean = false;
  codigoVerificacion: string = '';

  constructor(
    private fb: FormBuilder, 
    private usuariosService: UsuariosService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.reposicionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  // Paso 1: Enviar código de verificación al correo
  async sendResetLink() {
    const email = this.reposicionForm.get('email')?.value;
    if (email) {
      try {
        await this.usuariosService.enviarCodigo(email).toPromise();
        this.emailSent = true;
        this.codeRequested = true;
      } catch (error) {
        console.error('Error al enviar el código:', error);
        alert('Error al enviar el código de verificación.');
      }
    }
  }

  // Paso 2: Verificar el código ingresado por el usuario
  async verificarCodigo() {
    if (this.codigoVerificacion) {
      const email = this.reposicionForm.get('email')?.value;
      try {
        const resultado = await this.usuariosService.verificarCodigo(email, this.codigoVerificacion).toPromise();
        if (resultado && resultado.message === 'Código verificado correctamente') {
          this.codeVerified = true;
        } else {
          alert('Código incorrecto. Inténtalo de nuevo.');
        }
      } catch (error) {
        console.error('Error al verificar el código:', error);
        alert('Error al verificar el código.');
      }
    } else {
      alert("Por favor, ingresa el código de verificación.");
    }
  }

  // Método para encriptar la contraseña en SHA-256
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  // Paso 3: Cambiar la contraseña después de la verificación exitosa del código
  async resetPassword() {
    const newPassword1 = this.reposicionForm.get('newPassword')?.value;
    const confirmPassword = this.reposicionForm.get('confirmPassword')?.value;
    const email = this.reposicionForm.get('email')?.value;

    

    if (newPassword1 === confirmPassword) {
      try {
        const newPassword = await this.hashPassword(newPassword1);
        await this.usuariosService.cambiarContrasena(email,newPassword).toPromise();
        this.passwordChanged = true;
      } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        alert('Error al cambiar la contraseña.');
      }
    } else {
      alert('Las contraseñas no coinciden.');
    }
  }

  redirectToLogin() {
    this.router.navigate(['/login']);
  }
}
