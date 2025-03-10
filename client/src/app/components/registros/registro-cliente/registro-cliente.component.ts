import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { Router } from '@angular/router';
import { RecaptchaComponent, ReCaptchaV3Service } from 'ng-recaptcha';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.css']
})
export class RegistroClienteComponent implements OnInit {

  cliente = {
    IdCliente: 0,
    IdUsuario: 0,
    Edad: '',
    Sexo: '',
    Peso: '',
    Estatura: '',
    EnfCronicas: '',
    Alergias: '',
    ObjetivoSalud: '',
    Medicamentos: '',
    Foto: null as unknown as File
  };

  captchaToken: string | null = null;

  constructor(
    private usuarioService: UsuariosService,
    private clientesService: ClientesService,
    private router: Router
  ) { }

  ngOnInit() {
    const usuarioTemporal = this.usuarioService.getUsuarioTemporal();
    if (usuarioTemporal) {
      this.cliente.IdUsuario = usuarioTemporal.IdUsuario;
    } else {
      console.log('No se encontraron datos del usuario.');
    }
  }

  registrarAmbos() {
    const usuarioTemporal = this.usuarioService.getUsuarioTemporal();

    if (!this.captchaToken) {
      Swal.fire({
        icon: 'warning',
        title: 'Verificación requerida',
        text: 'Por favor, resuelve el reCAPTCHA antes de finalizar el registro.',
      });
      return;
    }

    // Comprobar que usuarioTemporal no es null antes de guardar
    if (usuarioTemporal) {
      usuarioTemporal.tipoUsuario = 'Cliente'
      this.usuarioService.saveuser(usuarioTemporal).subscribe(
        resp => {
          console.log('Respuesta del servidor:', resp);
          if (resp && resp.IdUsuario) {
            // Asigna el IdUsuario recibido
            this.cliente.IdUsuario = resp.IdUsuario;

            // Ahora guardar los datos en la tabla 'clientes'
            this.clientesService.saveCliente(this.cliente).subscribe(
              (respCliente: any) => {
                console.log('Cliente guardado:', respCliente);
                this.router.navigate(['/login']);
              },
              (err: any) => {
                console.log('Error al guardar cliente:', err);
              }
            );
          }
        },
        err => {
          console.log('Error al guardar usuario:', err);
        }
      );
    } else {
      console.log('No se encontraron datos del usuario para guardar.');
    }
  }
  goToLogin() {
    this.router.navigate(["/login"], { replaceUrl: true })
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Guardamos la imagen en formato base64 en el objeto cliente
        this.cliente.Foto = e.target.result;
      };
      reader.readAsDataURL(file);
    }
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
