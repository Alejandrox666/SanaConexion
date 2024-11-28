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
    private respSrv: RespuestasService
  ) { }

  enviosget: EnvioForm[] = [];
  usuariosget: Usuarios[] = [];
  clientesget: Clientes[] = []; // Almacenar clientes
  cuestionariosget: Cuestionarios[] = [];
  respuestasget: Respuestas[] = []; // Almacenar respuestas

  filteredCuestionarios: Cuestionarios[] = [];
  filteredRespuestas: Respuestas[] = []; // Almacenar respuestas filtradas
  selectedUserId: number | null = null;
  selectedClienteId: number | null = null; // Variable para almacenar el cliente filtrado
  selectedUserName: string = '';

  ngOnInit(): void {
    // Obtener envíos
    this.chatSrv.getEnvioForm().subscribe(
      (res: EnvioForm[]) => {
        this.enviosget = res;
        this.filterCuestionariosByEnvio();
      },
      err => console.error(err)
    );

    // Obtener usuarios
    this.usuariosServ.getuser().subscribe(
      (res: Usuarios[]) => {
        this.usuariosget = res;
        this.updateSelectedUserName();
        this.filterCuestionariosByEnvio(); // Se llama aquí también para asegurar que los datos estén listos
      },
      err => console.error(err)
    );

    // Obtener clientes
    this.clientesServ.getClientes().subscribe(
      (res: Clientes[]) => {
        this.clientesget = res;
        this.filterClientesByUserId(); // Filtrar los clientes por IdUsuario
      },
      err => console.error(err)
    );

    // Obtener cuestionarios
    this.preguntaSrv.getForm().subscribe(
      (res: Cuestionarios[]) => {
        this.cuestionariosget = res;
        this.filterCuestionariosByEnvio(); // Se llama aquí también
      },
      err => console.error(err)
    );

    // Obtener respuestas
    this.respSrv.getRespuestas().subscribe(
      (res: Respuestas[]) => {
        this.respuestasget = res;
        this.filterRespuestasByClienteId(); // Filtrar respuestas por IdCliente
      },
      err => console.error(err)
    );

    // Capturar el IdUsuario de los parámetros de la ruta
    this.route.paramMap.subscribe(params => {
      const userId = +params.get('IdUsuario')!;
      if (userId) {
        this.selectedUserId = userId;
        this.selectedUserName = this.usuariosget.find(user => user.IdUsuario === userId)?.NombreCompleto || '';
        this.filterCuestionariosByEnvio();
        this.filterClientesByUserId(); // Filtrar los clientes al recibir el IdUsuario
      } else {
        console.error('No se encontró el IdUsuario válido');
      }
    });
  }

  // Actualiza el nombre del usuario seleccionado
  updateSelectedUserName(): void {
    if (this.selectedUserId !== null) {
      const user = this.usuariosget.find(u => u.IdUsuario === this.selectedUserId);
      this.selectedUserName = user ? user.NombreCompleto : 'Usuario no encontrado';
    }
  }

  // Filtrar clientes por el IdUsuario
  filterClientesByUserId(): void {
    if (this.selectedUserId !== null) {
      this.selectedClienteId = this.clientesget.find(cliente => cliente.IdUsuario === this.selectedUserId)?.IdCliente || null;
      this.filterRespuestasByClienteId(); // Filtrar respuestas una vez que se haya seleccionado el cliente
    }
  }

  // Filtrar cuestionarios que corresponden al usuario seleccionado
  filterCuestionariosByEnvio(): void {
    if (this.selectedUserId !== null && this.enviosget.length > 0 && this.cuestionariosget.length > 0) {
      // Filtrar los cuestionarios para el usuario seleccionado
      this.filteredCuestionarios = this.cuestionariosget.filter(cuestionario =>
        this.enviosget.some(envio =>
          envio.IdCuestionario === cuestionario.IdCuestionario && envio.IdUsuario === this.selectedUserId
        )
      );
    } else {
      // Si no hay usuario seleccionado o no hay datos disponibles, mostrar todos los cuestionarios
      this.filteredCuestionarios = this.cuestionariosget;
    }
  }

  // Filtrar respuestas por IdCliente
  filterRespuestasByClienteId(): void {
    if (this.selectedClienteId !== null && this.respuestasget.length > 0) {
      // Filtrar las respuestas para el cliente seleccionado
      this.filteredRespuestas = this.respuestasget.filter(respuesta =>
        respuesta.IdCliente === this.selectedClienteId
      );
      console.log('Respuestas filtradas:', this.filteredRespuestas);
    } else {
      this.filteredRespuestas = [];
    }
  }

  // Método para seleccionar un usuario y activar el filtrado
  selectUser(userId: number): void {
    this.selectedUserId = userId;
    this.updateSelectedUserName();
    this.filterClientesByUserId();
    this.filterCuestionariosByEnvio();
  }

  // Método para abrir el modal
  openModal(cuestionarioId: number): void {
    // Filtrar las respuestas para el cuestionario seleccionado
    const respuestasFiltradas = this.filteredRespuestas;
    
    console.log('Respuestas Filtradas modal:', respuestasFiltradas);
    
    // Abrir el modal y pasar las respuestas filtradas
    const modalRef = this.modalService.open(VerPreguntasComponent, { size: 'lg' });
    modalRef.componentInstance.IdCuestionario = cuestionarioId; // Pasar el IdCuestionario al modal
    modalRef.componentInstance.respuestas = respuestasFiltradas; // Pasar las respuestas filtradas al modal
  }
  
}

