import { Observable } from "rxjs";

// src/app/services/respuesta-adapter.interface.ts
export interface RespuestaAdapter {
    obtenerRespuestas(idUsuario: number): Observable<any[]>;
}
