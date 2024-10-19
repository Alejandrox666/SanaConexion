import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Especialistas, Usuarios } from 'src/app/models/models';
import { DatosEspService } from 'src/app/services/datos-esp.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-form-esp',
  templateUrl: './form-esp.component.html',
  styleUrls: ['./form-esp.component.css']
})
export class FormEspComponent implements OnInit {

  especialista: Especialistas = {
    IdEspecialista: 0,
    IdUsuario: 0,
    NumCedula: '',
    GradoEstudios: '',
    Especialidad: '',
    Certificaciones: '',
    YearsExperience: 0,
  }

  constructor(private router: Router, private especialistaS: DatosEspService, private usuarioService: UsuariosService) { }

  goToComponent() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  ngOnInit(): void {
    const usuarioTemporal = this.usuarioService.getUsuarioTemporal();
    if (usuarioTemporal) {
      this.especialista.IdUsuario = usuarioTemporal.IdUsuario;
    } else {
      console.log('No se encontraron datos del usuario.');
    }
  }


  async guardarEspe() {
    const usuarioTemporal = this.usuarioService.getUsuarioTemporal();

    if (usuarioTemporal) {
      usuarioTemporal.tipoUsuario = 'Especialista'
      this.usuarioService.saveuser(usuarioTemporal).subscribe(
        resp => {
          console.log('Respuesta del servidor:', resp);
          if (resp && resp.IdUsuario) {
            this.especialista.IdUsuario = resp.IdUsuario;

            console.log('ID del usuario registrado:', this.especialista.IdUsuario);


            // Ahora guardar los datos en la tabla 'clientes'
            this.especialistaS.createEsp(this.especialista).subscribe(
              (respCliente: any) => {
                console.log('Especialista guardado:', respCliente);
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

}
