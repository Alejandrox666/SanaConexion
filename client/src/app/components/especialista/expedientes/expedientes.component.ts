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

  // Método para filtrar envíos y mostrar solo una tarjeta por cliente
  filterEnviosByUsuario(): void {
    if (this.enviosget.length && this.usuariosget.length) {
      const uniqueEnviosMap = new Map<number, EnvioForm>();
  
      this.enviosget.forEach(envio => {
        if (envio.IdUsuario !== undefined && !uniqueEnviosMap.has(envio.IdUsuario)) {
          uniqueEnviosMap.set(envio.IdUsuario, envio);
        }
      });
  
      this.filteredEnvios = Array.from(uniqueEnviosMap.values());
    }
  }
  
}
