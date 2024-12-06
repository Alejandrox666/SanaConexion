import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RespuestaAdapterService } from '../services/respuesta-adapter.service';
import { IRespuestaService } from './respuesta-adapter.interface';

@Injectable({
    providedIn: 'root'
})
export class respuestaAdapter implements IRespuestaService {
    constructor(private respuestaAdapterSrv: RespuestaAdapterService) { }

    obtenerRespuestasFiltradasPorUsuario(idUsuario: number): Observable<any> {
        return this.respuestaAdapterSrv.obtenerRespuestasFiltradasPorUsuario(idUsuario);
    }
}