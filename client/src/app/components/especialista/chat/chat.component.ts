import { Component, HostListener, OnInit } from '@angular/core';
import { forkJoin, map } from 'rxjs';
import { Chats, Mensajes, Participantes } from 'src/app/models/chats';
import { Clientes } from 'src/app/models/clientes';
import { Especialistas, Usuarios } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { DatosEspService } from 'src/app/services/datos-esp.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  mostrarChat = false;
  checkChat: number | null = null;
  userLoger: any;
  nuevoMensaje: string = "";

  chats: Chats[] = [];
  mensajes: Mensajes[] = [];
  participantes: Participantes[] = [];
  usuarios: Usuarios[] = [];
  especialistas: (Usuarios & Especialistas)[] = [];
  clientes: Clientes[] = [];

  user: Usuarios = {} as Usuarios;

  constructor(private authService: AuthService, private chatService: ChatService, private datosEspService: DatosEspService,
    private clienteService: ClientesService, private usuarioSe: UsuariosService,
  ) { }

  ngOnInit(): void {
    this.getChats();
    this.getEspecialistas();
    this.getClientes()
    this.authService.getCurrentUser().subscribe(
      (user) => {
        if (user) {
          this.user = user;
          this.userLoger = user;
        } else {
          console.error('No user is currently logged in.');
        }
      },
      (error) => {
        console.error('Failed to load user data:', error);
      }
    );
  }

  getChats() {
    this.chatService.getChats().subscribe((chatsResponse: Chats[]) => {
      this.chats = chatsResponse;

      this.chatService.getParticipantes().subscribe((participantesResponse: Participantes[]) => {
        this.chats.forEach(chat => {
          chat.participantes = participantesResponse.filter(p => p.IdChat === chat.IdChat);

          const idsUsuarios = chat.participantes
            .map(p => p.IdUsuario)
            .filter(id => id !== this.userLoger.IdUsuario);  // Excluye al usuario logueado

          const observables = idsUsuarios.map(id => this.chatService.getUsuariosById(id));

          forkJoin(observables).pipe(
            map(usuariosResponse => usuariosResponse.flat())
          ).subscribe((usuariosResponse: Usuarios[]) => {
            chat.participantes?.forEach(participante => {
              const usuario = usuariosResponse.find(u => u.IdUsuario === participante.IdUsuario);
              if (usuario) {
                participante.Nombre = usuario.NombreCompleto;
              }
            });

            this.clientes.forEach(cliente => {
              const clienteChat = chat.participantes?.find(p => p.IdUsuario === cliente.IdUsuario);
              if (clienteChat) {
                cliente.chatActivo = chat.Estado === 'Activo';
                cliente.mostrar = chat.mostrar || false;

                if (this.userLoger.tipoUsuario === 'Especialista') {
                  chat.msj = [];
                  this.chatService.getMensajesPorChat(chat.IdChat).subscribe((mensajesResponse: Mensajes[]) => {
                    chat.msj = mensajesResponse;
    
                    const clienteHaEnviadoMensaje = mensajesResponse.some(mensaje => mensaje.IdEmisor !== this.userLoger.IdUsuario);
    
                    if (!clienteHaEnviadoMensaje) {
                      cliente.mostrar = false;
                    } else {
                      cliente.mostrar = true;
                    }
                  });
                }
              }
            });

            
          });
        });
      });
    });
  }



  getEspecialistas(): void {
    this.datosEspService.getEsp().subscribe(
      (data: any[]) => {
        this.especialistas = data.map((especialista) => ({
          ...especialista,

        }));
      },
      (error: any) => console.error('Error al obtener especialistas:', error)
    );
  }

  getClientes(): void {
    this.clienteService.getClientes().subscribe(
      (clientesResponse: Clientes[]) => {
        this.clientes = clientesResponse;
        const idsUsuarios = this.clientes.map(cliente => cliente.IdUsuario);

        if (idsUsuarios.length > 0) {
          const observables = idsUsuarios.map(id => this.chatService.getUsuariosById(id));
          forkJoin(observables).pipe(
            map(usuariosResponse => usuariosResponse.flat())
          ).subscribe((usuarios: Usuarios[]) => {
            this.usuarios = usuarios;

            this.clientes.forEach(cliente => {
              const usuario = usuarios.find(u => u.IdUsuario === cliente.IdUsuario);
              if (usuario) {
                cliente.Nombre = usuario.NombreCompleto;
              }
            });
          });
        }
      },
      (error) => console.error('Error al obtener clientes:', error)
    );
  }


  seleccionarChat(IdUsuario: number) {
    const chatExistente = this.chats.find(chat => {
      const participanteIds = chat.participantes?.map(p => p.IdUsuario);

      return participanteIds?.includes(this.userLoger.IdUsuario) && participanteIds.includes(IdUsuario);
    });
    if (chatExistente) {
      this.mostrarChat = true;
      this.checkChat = chatExistente.IdChat;
      this.chatService.getMensajesPorChat(chatExistente.IdChat).subscribe((mensajesResponse: Mensajes[]) => {
        this.mensajes = mensajesResponse;
      });
    } else {
      const confirmar = confirm('No ha hablado con este especialista. ¿Desea crear un nuevo chat?');
      if (confirmar) {
        this.crearNuevoChat(IdUsuario);
      }
    }
  }


  crearNuevoChat(IdUsuario: number) {
    this.mostrarChat = false;
    this.checkChat = null;
    this.mensajes = [];

    const nuevoChat: Chats = {
      IdChat: 0,
      FechaInicio: new Date().toISOString().slice(0, 19).replace('T', ' '),
      Estado: 'Activo',
    };

    this.chatService.createChats(nuevoChat).subscribe(resp => {
      if (resp && resp.IdChat) {

        const participanteUsuario: Participantes = {
          IdParticipacion: 0,
          IdChat: resp.IdChat,
          IdUsuario: this.user.IdUsuario,
        };

        this.chatService.createPart(participanteUsuario).subscribe(() => {
        });

        const participanteEspecialista: Participantes = {
          IdParticipacion: 0,
          IdChat: resp.IdChat,
          IdUsuario: IdUsuario,
        };

        this.chatService.createPart(participanteEspecialista).subscribe(() => {

          const mensajeInicial: Mensajes = {
            IdMensaje: 0,
            IdChat: resp.IdChat,
            IdEmisor: this.user.IdUsuario,
            Texto: 'Hola!!!',
            FechaEnvio: new Date().toISOString().slice(0, 19).replace('T', ' ')
          };

          this.chatService.createMsj(mensajeInicial).subscribe(() => {
            this.mostrarChat = true;
            this.getChats();
          });
        });
      }
    });
  }

  EnviarMensaje() {

    if (this.nuevoMensaje == '') return
    if (this.checkChat !== null) {

      const fechaActual = new Date();
      const fechaEnvio = fechaActual.toISOString().slice(0, 19).replace('T', ' ');

      let mensaje: Mensajes = {
        IdMensaje: 0,
        IdChat: this.checkChat,
        IdEmisor: this.user.IdUsuario,
        Texto: this.nuevoMensaje,
        FechaEnvio: fechaEnvio
      };

      this.chatService.createMsj(mensaje).subscribe((r) => {
        console.log(r);
        this.mensajes.push(mensaje);
        this.nuevoMensaje = '';
        setTimeout(() => {
          this.scrollFirstElement();
        }, 10);
      });
    }
  }

  scrollFirstElement() {
    let element = document.getElementsByClassName('msj');
    let ultimo: any = element[element.length - 1];
    let topPos = ultimo.offsetTop;
    const contenedorMsj = document.getElementById('contenedorMsj');
    if (contenedorMsj) {
      contenedorMsj.scrollTop = topPos;
    }
  }

  cerrarChat() {
    this.mostrarChat = false
    this.checkChat = null;
    this.mensajes = [];
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscPressed(event: KeyboardEvent) {
    this.cerrarChat();
  }
}
