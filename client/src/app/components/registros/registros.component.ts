import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuarios } from 'src/app/models/models';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registro',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.css']
})
export class RegistrosComponent implements OnInit {
  mostrarAlertaInsert: boolean = false;
  hayError: boolean = false;
  registro: Usuarios = {
    IdUsuario: 0,
    NombreCompleto: '',
    Telefono: '',
    Email: '',
    Password: '',
    FechaRegistro: new Date(),
    tipoUsuario: 'Cliente',
  };
  contrasenaTemporal: string = '';
  codigoVerificacion: string = '';
  modalRef: NgbModalRef | undefined;

  showPassword = false;

  @ViewChild('verificacionCodigoModal') verificacionCodigoModal: any;
  @ViewChild('seleccionRolModal') seleccionRolModal: any; // Referencia al modal de selección de rol

  constructor(
    private usuarioService: UsuariosService,
    private router: Router,
    private modalService: NgbModal
  ) { }



  ngOnInit() { }

  // Método para encriptar la contraseña en SHA-256
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  // Enviar el código de verificación al correo
  async guardarDatos() {
    const fechaActual = new Date();
    const fechaFormatoMySQL = fechaActual.toISOString().slice(0, 19).replace('T', ' ');
    this.registro.FechaRegistro = fechaFormatoMySQL;
    this.registro.Password = await this.hashPassword(this.contrasenaTemporal);

    this.usuarioService.setUsuarioTemporal(this.registro);

    try {
      await this.usuarioService.enviarCodigo(this.registro.Email).toPromise();
      // Abre el modal para ingresar el código de verificación
      this.modalRef = this.modalService.open(this.verificacionCodigoModal, {
        backdrop: 'static',
        size: 'lg',
        centered: true
      });
    } catch (error) {
      console.error('Error al enviar el código de verificación:', error);
    }
  }

  // Verificar el código ingresado por el usuario
  async verificarCodigo() {
    if (!this.codigoVerificacion) {
      console.error("El código de verificación no está ingresado");
      alert("Por favor, ingresa el código de verificación.");
      return;
    }

    try {
      const resultado = await this.usuarioService.verificarCodigo(this.registro.Email, this.codigoVerificacion).toPromise();
      if (resultado && resultado.message === 'Código verificado correctamente') {
        this.modalRef?.close();
        // Abre el modal de selección de rol
        this.modalRef = this.modalService.open(this.seleccionRolModal, {
          backdrop: 'static',
          size: 'lg',
          centered: true
        });
      } else {
        alert('Código incorrecto. Inténtalo de nuevo.');
      }
    } catch (error) {
      console.error('Error al verificar el código:', error);
      alert('Error al verificar el código.');
    }
  }

  // Método para registrar al cliente
  async registrarUsuario() {
    this.usuarioService.saveuser(this.registro).subscribe(
      resp => {
        console.log(resp);
        this.mostrarAlertaInsert = true;
        this.router.navigate(['/usuario']);
      },
      err => {
        console.log(err);
        this.hayError = true;
      }
    );
  }

  // Método para seleccionar el rol y redirigir
  seleccionarRol(rol: string) {
    this.modalRef?.close();
    if (rol === 'especialista') {
      this.router.navigate(['/formEsp']);
    } else if (rol === 'cliente') {
      this.router.navigate(['/registrosClientes']);
    }
  }

  goToLogin() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  openModal() {
    this.modalRef = this.modalService.open(this.verificacionCodigoModal, {
      backdrop: 'static',
      size: 'lg',
      centered: true
    });
  }


  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
