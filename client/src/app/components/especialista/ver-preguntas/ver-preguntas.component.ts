import { Component, OnInit } from '@angular/core';
import { EnvioForm } from 'src/app/models/chats';
import { Preguntas, Respuestas } from 'src/app/models/formularios';
import { ChatService } from 'src/app/services/chat.service';
import { RespuestasService } from 'src/app/services/respuestas.service';

@Component({
  selector: 'app-ver-preguntas',
  templateUrl: './ver-preguntas.component.html',
  styleUrls: ['./ver-preguntas.component.css']
})
export class VerPreguntasComponent implements OnInit {
  respuestas: Respuestas[] = [];
  allPreguntas: Preguntas[] = [];
  IdCuestionario!: number;
  enviosget: EnvioForm[] = [];

  constructor(private respSrv: RespuestasService, private chatSrv: ChatService,) {}

  ngOnInit(): void {
    this.respSrv.getAnswersByIdCues(this.IdCuestionario).subscribe(
      (res: Preguntas[]) => {
        this.allPreguntas = res;
      },
      (err: any) => console.error(err)
    );

    this.respSrv.getRespuestas().subscribe(
      (res: Respuestas[]) => {
        this.respuestas = res;
      },
      (err: any) => console.error(err)
    );
    this.chatSrv.getEnvioForm().subscribe(
      (res: EnvioForm[]) => {
        this.enviosget = res;
      },
      err => console.error(err)
    );
  }


}
