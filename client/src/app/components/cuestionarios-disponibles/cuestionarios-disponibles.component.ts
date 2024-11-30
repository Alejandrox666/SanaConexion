import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnvioForm } from 'src/app/models/chats';
import { Cuestionarios } from 'src/app/models/formularios';
import { Usuarios } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { FormularioService } from 'src/app/services/formulario.service';

@Component({
  selector: 'app-cuestionarios-disponibles',
  templateUrl: './cuestionarios-disponibles.component.html',
  styleUrls: ['./cuestionarios-disponibles.component.css']
})
export class CuestionariosDisponiblesComponent implements OnInit {
  cuestionariosget: Cuestionarios[] = [];
  envios: EnvioForm[] = [];

  userLoger: any;
  user: Usuarios = {} as Usuarios;

  constructor(
    private router: Router,
    private preguntaSrv: FormularioService,
    private chatS: ChatService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user) => {
        if (user) {
          this.user = user;
          this.userLoger = user;
          this.getCuestionarios();
        } else {
          console.error('No user is currently logged in.');
        }
      },
      (error) => {
        console.error('Failed to load user data:', error);
      }
    );
  }

  getCuestionarios() {
    this.preguntaSrv.getForm().subscribe(
      (res: Cuestionarios[]) => {
        this.cuestionariosget = res;
        this.getEstatusForm();
      },
      err => console.error(err)
    );
  }

  getEstatusForm() {
    this.chatS.getEnvioForm().subscribe((cues: EnvioForm[]) => {
      this.envios = cues;

      this.cuestionariosget = this.cuestionariosget
        .map(cuestionario => {
          const envio = this.envios.find(envio =>
            envio.IdCuestionario === cuestionario.IdCuestionario &&
            envio.IdUsuario === this.userLoger.IdUsuario &&
            envio.EstadoEnvio !== 'Respondido'
          );
          if (envio) {
            cuestionario.IdEnvio = envio.IdEnvio;
          } else {
            cuestionario.IdEnvio = -1;
          }

          return cuestionario;
        })
        .filter(cuestionario => cuestionario.IdEnvio !== -1);
    });
  }


  redirectToCuestionario(IdCuestionario: number, IdEspecialista: number, IdEnvio: number) {
    this.router.navigate(['/ruta-del-nuevo-componente', IdCuestionario, IdEspecialista, IdEnvio]);
  }


}
