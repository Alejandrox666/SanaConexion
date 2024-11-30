import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EnvioForm } from 'src/app/models/chats';
import { Clientes } from 'src/app/models/clientes';
import { Cuestionarios, Respuestas } from 'src/app/models/formularios';
import { Usuarios } from 'src/app/models/models';
import { ChatService } from 'src/app/services/chat.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { FormularioService } from 'src/app/services/formulario.service';
import { RespuestasService } from 'src/app/services/respuestas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AuthService } from 'src/app/services/auth.service';
import { VerPreguntasComponent } from '../ver-preguntas/ver-preguntas.component';

@Component({
  selector: 'app-cuestionarios-exp',
  templateUrl: './cuestionarios-exp.component.html',
  styleUrls: ['./cuestionarios-exp.component.css']
})
export class CuestionariosExpComponent implements OnInit {
  constructor(
    private chatSrv: ChatService,
    private usuariosServ: UsuariosService,
    private preguntaSrv: FormularioService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private clientesServ: ClientesService,
    private respSrv: RespuestasService,
    private authService: AuthService // Para obtener el especialista logueado
  ) { }

  enviosget: EnvioForm[] = [];
  usuariosget: Usuarios[] = [];
  clientesget: Clientes[] = [];
  cuestionariosget: Cuestionarios[] = [];
  respuestasget: Respuestas[] = [];

  filteredCuestionarios: Cuestionarios[] = [];
  filteredRespuestas: Respuestas[] = [];
  selectedUserId: number | null = null;
  selectedClienteId: number | null = null;
  selectedUserName: string = '';
  especialistaId: number | null = null; // ID del especialista logueado

  ngOnInit(): void {
    // Obtener el usuario actual
    this.authService.getCurrentUser().subscribe(
      (user) => {
        if (user && user.IdUsuario) {
          // Usuario logueado disponible
          console.log('Usuario actual:', user);
          this.getEspecialistaByIdUsuario(user.IdUsuario);
        } else {
          console.error('No se encontró un usuario logueado válido.');
        }
      },
      (err) => console.error('Error obteniendo el usuario actual:', err)
    );

    // Cargar los datos necesarios
    this.chatSrv.getEnvioForm().subscribe(
      (res: EnvioForm[]) => {
        this.enviosget = res;
        this.filterCuestionariosByEnvio();
      },
      (err) => console.error(err)
    );

    this.usuariosServ.getuser().subscribe(
      (res: Usuarios[]) => {
        this.usuariosget = res;
        this.updateSelectedUserName();
        this.filterCuestionariosByEnvio();
      },
      (err) => console.error(err)
    );

    this.clientesServ.getClientes().subscribe(
      (res: Clientes[]) => {
        this.clientesget = res;
        this.filterClientesByUserId();
      },
      (err) => console.error(err)
    );

    this.preguntaSrv.getForm().subscribe(
      (res: Cuestionarios[]) => {
        this.cuestionariosget = res;
        this.filterCuestionariosByEnvio();
      },
      (err) => console.error(err)
    );

    this.respSrv.getRespuestas().subscribe(
      (res: Respuestas[]) => {
        this.respuestasget = res;
        this.filterRespuestasByClienteId();
      },
      (err) => console.error(err)
    );

    this.route.paramMap.subscribe(params => {
      const userId = +params.get('IdUsuario')!;
      if (userId) {
        this.selectedUserId = userId;
        this.selectedUserName = this.usuariosget.find(user => user.IdUsuario === userId)?.NombreCompleto || '';
        this.filterCuestionariosByEnvio();
        this.filterClientesByUserId();
      } else {
        console.error('No se encontró un IdUsuario válido.');
      }
    });
  }

  getEspecialistaByIdUsuario(idUsuario: number): void {
    this.authService.getEspecialistaByIdUsuario(idUsuario).subscribe(
      (especialista) => {
        if (especialista && especialista.IdEspecialista) {
          this.especialistaId = especialista.IdEspecialista;
          console.log('Especialista logueado:', especialista);
          this.filterCuestionariosByEnvio(); // Filtrar cuestionarios con el especialista activo
        } else {
          console.error('No se encontró un especialista válido para el usuario.');
        }
      },
      (err) => console.error('Error obteniendo especialista:', err)
    );
  }

  filterCuestionariosByEnvio(): void {
    if (
      this.selectedUserId !== null &&
      this.enviosget.length > 0 &&
      this.cuestionariosget.length > 0 &&
      this.especialistaId !== null
    ) {
      this.filteredCuestionarios = this.cuestionariosget.filter(cuestionario =>
        this.enviosget.some(envio =>
          envio.IdCuestionario === cuestionario.IdCuestionario &&
          envio.IdUsuario === this.selectedUserId &&
          envio.IdEspecialista === this.especialistaId
        )
      );
    } else {
      this.filteredCuestionarios = [];
    }
  }

  filterClientesByUserId(): void {
    if (this.selectedUserId !== null) {
      this.selectedClienteId = this.clientesget.find(cliente => cliente.IdUsuario === this.selectedUserId)?.IdCliente || null;
      this.filterRespuestasByClienteId();
    }
  }

  filterRespuestasByClienteId(): void {
    if (this.selectedClienteId !== null && this.respuestasget.length > 0) {
      this.filteredRespuestas = this.respuestasget.filter(respuesta =>
        respuesta.IdCliente === this.selectedClienteId
      );
    } else {
      this.filteredRespuestas = [];
    }
  }

  updateSelectedUserName(): void {
    if (this.selectedUserId !== null) {
      const user = this.usuariosget.find(u => u.IdUsuario === this.selectedUserId);
      this.selectedUserName = user ? user.NombreCompleto : 'Usuario no encontrado';
    }
  }

  openModal(cuestionarioId: number): void {
    const respuestasFiltradas = this.filteredRespuestas;

    const modalRef = this.modalService.open(VerPreguntasComponent, { size: 'lg' });
    modalRef.componentInstance.IdCuestionario = cuestionarioId;
    modalRef.componentInstance.respuestas = respuestasFiltradas;
  }
}
