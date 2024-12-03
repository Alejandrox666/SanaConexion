import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export interface IRespuestaService {
    obtenerRespuestasFiltradasPorUsuario(idUsuario: number): Observable<any>;
}

// Define el token para la inyección
export const RESPUESTA_SERVICE_TOKEN = new InjectionToken<IRespuestaService>('RESPUESTA_SERVICE_TOKEN');