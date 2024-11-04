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
    Foto: ''
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

            const formData = new FormData();
            formData.append('especialista', JSON.stringify(this.especialista));
            if (this.especialista.Foto) {
              formData.append('foto', this.especialista.Foto);
            }

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

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Guardamos la imagen en formato base64 en el objeto especialista
        this.especialista.Foto = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  
  
}
