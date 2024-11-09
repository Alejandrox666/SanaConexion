import { Component, OnInit } from '@angular/core';
import { EnvioForm } from 'src/app/models/chats';
import { Usuarios } from 'src/app/models/models';
import { ChatService } from 'src/app/services/chat.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-expedientes',
  templateUrl: './expedientes.component.html',
  styleUrls: ['./expedientes.component.css']
})
export class ExpedientesComponent implements OnInit {

  constructor(private chatSrv: ChatService, private usuariosServ: UsuariosService) {}

  enviosget: EnvioForm[] = [];
  usuariosget: Usuarios[] = [];
  filteredEnvios: EnvioForm[] = [];

  ngOnInit(): void {
    this.chatSrv.getEnvioForm().subscribe(
      (res: EnvioForm[]) => {
        this.enviosget = res;
        console.log({ text: 'envios' }, this.enviosget);
        this.filterEnviosByUsuario(); // Filtrar envíos después de obtenerlos
      },
      err => console.error(err)
    );

    this.usuariosServ.getuser().subscribe(
      (res: Usuarios[]) => {
        this.usuariosget = res;
        this.filterEnviosByUsuario(); // Filtrar envíos después de obtener usuarios
      }
    );
  }

  // Método para filtrar envíos que coinciden con algún idUsuario de usuariosget
  filterEnviosByUsuario(): void {
    if (this.enviosget.length && this.usuariosget.length) {
      this.filteredEnvios = this.enviosget.filter(envio =>
        this.usuariosget.some(usuario => usuario.IdUsuario === envio.IdUsuario)
      );
    }
  }
}
