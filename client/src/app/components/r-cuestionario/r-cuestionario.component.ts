import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Clientes } from 'src/app/models/clientes';
import { Cuestionarios, Preguntas } from 'src/app/models/formularios';
import { Usuarios } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { FormularioService } from 'src/app/services/formulario.service';
import { RespuestasService } from 'src/app/services/respuestas.service';
import Swal from 'sweetalert2';

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
  IdCuestionario!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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
    // Validación para verificar que todas las preguntas tengan respuesta
    const unansweredQuestions = this.allPreguntas.some(pregunta => 
      !this.respuestas.some(res => res.IdPregunta === pregunta.IdPregunta && res.Respuesta.trim() !== '')
    );
  
    if (unansweredQuestions) {
      Swal.fire({
        title: 'Advertencia',
        text: 'Por favor, responde todas las preguntas antes de enviar.',
        icon: 'warning',
        confirmButtonText: 'Aceptar'
      });
      return; // Detener el envío si hay preguntas sin respuesta
    }
  
    // Confirmación de envío
    Swal.fire({
      title: 'Confirmación',
      text: "¿Estás seguro de enviar tus respuestas?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const respuestasObservables = this.respuestas.map((respuesta) =>
          this.respSrv.createRespuesta(respuesta).toPromise()
        );
  
        Promise.all(respuestasObservables)
          .then((res) => {
            Swal.fire({
              title: 'Éxito',
              text: 'Las respuestas se enviaron correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              // Limpiar los campos de entrada y redirigir
              this.respuestas = [];
              this.allPreguntas.forEach(pregunta => {
                const inputElement = document.querySelector(`input[id='pregunta-${pregunta.IdPregunta}']`) as HTMLInputElement;
                if (inputElement) inputElement.value = '';
              });
  
              this.router.navigate(['/cuestionarios-disponibles']);
            });
  
            console.log('Respuestas guardadas:', res);
          })
          .catch((error) => {
            console.error('Error al guardar respuestas:', error);
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al enviar las respuestas. Inténtalo nuevamente.',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          });
      }
    });
  }
  
}
