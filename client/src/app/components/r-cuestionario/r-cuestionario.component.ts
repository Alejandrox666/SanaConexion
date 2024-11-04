import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Clientes } from 'src/app/models/clientes';
import { Cuestionarios, Preguntas } from 'src/app/models/formularios';
import { Usuarios } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { FormularioService } from 'src/app/services/formulario.service';
import { RespuestasService } from 'src/app/services/respuestas.service';

@Component({
  selector: 'app-r-cuestionario',
  templateUrl: './r-cuestionario.component.html',
  styleUrls: ['./r-cuestionario.component.css']
})
export class RCuestionarioComponent implements OnInit {
  cuestionariosget: Cuestionarios[] = [];
  cuestionarioSeleccionado!: Cuestionarios | undefined;
  usuariosget: Usuarios[] = [];
  preguntasget: Preguntas[] = [];
  respuestas: { IdPregunta: number; IdCliente: number; Respuesta: string }[] = [];
  allPreguntas: Preguntas[] = [];
  IdCliente!: number;
  IdUs!: number;
  IdCuestionario!: number; // Variable para almacenar el IdCuestionario

  constructor(
    private route: ActivatedRoute,
    private preguntaSrv: FormularioService,
    private respSrv: RespuestasService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idCuestionario = params.get('IdCuestionario');
      if (idCuestionario) {
        this.IdCuestionario = +idCuestionario;
        this.loadPreguntas();
        this.loadCuestionario();
      }
    });

    this.getCurrentUser();
  }

  loadCuestionario() {
    this.preguntaSrv.getForm().subscribe(
      (res: Cuestionarios[]) => {
        this.cuestionariosget = res;
        // Filtra el cuestionario que coincide con el IdCuestionario
        this.cuestionarioSeleccionado = this.cuestionariosget.find(c => c.IdCuestionario === this.IdCuestionario);
        console.log('Cuestionario seleccionado:', this.cuestionarioSeleccionado);
      },
      err => console.error(err)
    );
  }

  loadPreguntas() {
    this.respSrv.getAnswersByIdCues(this.IdCuestionario).subscribe(
      (res: Preguntas[]) => {
        this.allPreguntas = res;
      },
      (err) => console.error(err)
    );
  }

  getCurrentUser() {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.IdUs = user.IdUsuario;
        this.getIdClienteByIdUser(this.IdUs);
      } else {
        console.error('No se pudo obtener el usuario actual');
      }
    }, error => {
      console.error('Error al obtener el usuario actual:', error);
    });
  }

  getIdClienteByIdUser(IdUsuario: number) {
    this.respSrv.getIdClienteByIdUser(IdUsuario).subscribe(
      (res: Clientes) => {
        this.IdCliente = res.IdCliente;
      },
      (err) => console.error('No se encontró el cliente para el usuario.', err)
    );
  }

  onInputChange(event: Event, idPregunta: number) {
    const inputElement = event.target as HTMLInputElement;
    const respuesta = inputElement.value;
    const existingAnswerIndex = this.respuestas.findIndex(r => r.IdPregunta === idPregunta);

    if (existingAnswerIndex !== -1) {
      this.respuestas[existingAnswerIndex].Respuesta = respuesta;
    } else {
      this.respuestas.push({
        IdPregunta: idPregunta,
        IdCliente: this.IdCliente,
        Respuesta: respuesta
      });
    }

    console.log(this.respuestas);
  }

  onSubmit() {
    this.respuestas.forEach((respuesta) => {
      this.respSrv.createRespuesta(respuesta).subscribe(
        (res) => {
          console.log('Respuesta guardada:', res);
        },
        (error) => {
          console.error('Error al guardar respuesta:', error);
        }
      );
    });
  }
}