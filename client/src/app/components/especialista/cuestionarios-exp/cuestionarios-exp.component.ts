import { Component, OnInit } from '@angular/core';
import { EnvioForm } from 'src/app/models/chats';
import { Cuestionarios } from 'src/app/models/formularios';
import { Usuarios } from 'src/app/models/models';
import { ChatService } from 'src/app/services/chat.service';
import { FormularioService } from 'src/app/services/formulario.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-cuestionarios-exp',
  templateUrl: './cuestionarios-exp.component.html',
  styleUrls: ['./cuestionarios-exp.component.css']
})
export class CuestionariosExpComponent implements OnInit {

  constructor(
    private chatSrv: ChatService, 
    private usuariosServ: UsuariosService, 
    private preguntaSrv: FormularioService
  ) {}

  enviosget: EnvioForm[] = [];
  usuariosget: Usuarios[] = [];
  cuestionariosget: Cuestionarios[] = [];
  filteredCuestionarios: Cuestionarios[] = [];
  
  selectedUserId: number | null = null; // ID del usuario seleccionado

  ngOnInit(): void {
    // Obtener envíos
    this.chatSrv.getEnvioForm().subscribe(
      (res: EnvioForm[]) => {
        this.enviosget = res;
        console.log({ text: 'envios' }, this.enviosget);
        this.filterCuestionariosByEnvio(); // Filtrar cuestionarios después de obtener los envíos
      },
      err => console.error(err)
    );

    // Obtener usuarios
    this.usuariosServ.getuser().subscribe(
      (res: Usuarios[]) => {
        this.usuariosget = res;
      },
      err => console.error(err)
    );

    // Obtener cuestionarios
    this.preguntaSrv.getForm().subscribe(
      (res: Cuestionarios[]) => {
        this.cuestionariosget = res;
        this.filterCuestionariosByEnvio(); // Filtrar cuestionarios después de obtener los datos
      },
      err => console.error(err)
    );
  }

  // Método para filtrar cuestionarios que corresponden al usuario seleccionado
  filterCuestionariosByEnvio(): void {
    if (this.enviosget.length && this.cuestionariosget.length) {
      // Filtrar los cuestionarios cuyos IdCuestionario coincidan con los de los envíos
      this.filteredCuestionarios = this.cuestionariosget.filter(cuestionario =>
        this.enviosget.some(envio => envio.IdCuestionario === cuestionario.IdCuestionario)
      );
    }
  }
  

  // Método para seleccionar un usuario y activar el filtrado
  selectUser(userId: number): void {
    this.selectedUserId = userId;
    this.filterCuestionariosByEnvio(); // Filtrar los cuestionarios para el usuario seleccionado
  }
}
