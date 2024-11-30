import { Component, Input, OnInit } from '@angular/core';
import { Preguntas, Respuestas } from 'src/app/models/formularios';
import { ChatService } from 'src/app/services/chat.service';
import { RespuestasService } from 'src/app/services/respuestas.service';

@Component({
  selector: 'app-ver-preguntas',
  templateUrl: './ver-preguntas.component.html',
  styleUrls: ['./ver-preguntas.component.css']
})
export class VerPreguntasComponent implements OnInit {
  @Input() IdCuestionario!: number;
  @Input() respuestas: Respuestas[] = [];
  preguntasFiltradas: Preguntas[] = [];

  constructor(
    private respSrv: RespuestasService,
    private chatSrv: ChatService
  ) { }

  ngOnInit(): void {
    // Cargar las preguntas solo si el IdCuestionario está presente
    if (this.IdCuestionario) {
      this.cargarPreguntas();
    }
  }

  // Método para cargar las preguntas filtradas por el cuestionario
  cargarPreguntas(): void {
    this.respSrv.getAnswersByIdCues(this.IdCuestionario).subscribe(
      (preguntas: Preguntas[]) => {
        this.preguntasFiltradas = preguntas;
      },
      (err: any) => console.error(err)
    );
  }

  // Función para obtener la respuesta asociada a una pregunta
  obtenerRespuesta(pregunta: Preguntas): string {
    const respuesta = this.respuestas.find(res => res.IdPregunta === pregunta.IdPregunta);
    return respuesta ? respuesta.Respuesta : 'Respuesta no disponible';
  }
}
