import { Component, OnInit } from '@angular/core';
import { EnvioForm } from 'src/app/models/chats';
import { Especialistas, Usuarios } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { DatosEspService } from 'src/app/services/datos-esp.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-expedientes',
  templateUrl: './expedientes.component.html',
  styleUrls: ['./expedientes.component.css']
})
export class ExpedientesComponent implements OnInit {

  constructor(
    private chatSrv: ChatService,
    private usuariosServ: UsuariosService,
    private authService: AuthService,
    private datosEspService: DatosEspService,
  ) { }

  enviosget: EnvioForm[] = [];
  usuariosget: Usuarios[] = [];
  filteredEnvios: EnvioForm[] = [];
  especialistas: Especialistas[] = [];
  user: Usuarios = {} as Usuarios;
  userLoger: any;
  especialista: Especialistas | null = null; // Almacenará el especialista logueado

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user) => {
        if (user) {
          this.user = user;
          this.userLoger = user;
          this.getEspecialistaByUsuario(user.IdUsuario);
        } else {
          console.error('No user is currently logged in.');
        }
      },
      (error) => {
        console.error('Failed to load user data:', error);
      }
    );
    this.chatSrv.getEnvioForm().subscribe(
      (res: EnvioForm[]) => {
        this.enviosget = res;
        this.filterEnviosByUsuario();
      },
      (err) => console.error(err)
    );

    this.usuariosServ.getuser().subscribe(
      (res: Usuarios[]) => {
        this.usuariosget = res;
        this.filterEnviosByUsuario();
      }
    );
  }

  getEspecialistaByUsuario(userId: number): void {
    this.authService.getEspecialistaByIdUsuario(userId).subscribe(
      (especialista: Especialistas) => {
        if (especialista) {
          this.especialista = especialista;
          this.filterEnviosByUsuario();
        } else {
          console.error('El servicio no devolvió un especialista válido.');
        }
      },
      (err) => console.error('Error fetching especialista:', err)
    );
  }


  filterEnviosByUsuario(): void {
    if (this.enviosget.length && this.especialista) {
      const enviosFiltradosPorEspecialista = this.enviosget.filter(
        envio => envio.IdEspecialista === this.especialista?.IdEspecialista
      );

      const uniqueEnviosMap = new Map<number, EnvioForm>();

      enviosFiltradosPorEspecialista.forEach(envio => {
        if (envio.IdUsuario !== undefined && !uniqueEnviosMap.has(envio.IdUsuario)) {
          uniqueEnviosMap.set(envio.IdUsuario, envio);
        }
      });

      this.filteredEnvios = Array.from(uniqueEnviosMap.values());
    }
  }

}
