import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Clientes, CuestionariosClientes } from '../models/clientes';
import { Preguntas, Respuestas } from '../models/formularios';

@Injectable({
  providedIn: 'root'
})
export class RespuestasService {
  private Back_Api = 'https://sanaconexion-1.onrender.com/api/respuestas';
  private Back_Api2 = 'https://sanaconexion-1.onrender.com/api/cuestionariosClientes';

  constructor(private http: HttpClient) {}

  getRespuestas(): Observable<Respuestas[]> {
    return this.http.get<Respuestas[]>(`${this.Back_Api}/`);
  }

  getAnswersByIdCues(IdCuestionario: number): Observable<Preguntas[]> {
    return this.http.get<Preguntas[]>(`${this.Back_Api}/rbIC/${IdCuestionario}`);
  }

  getIdClienteByIdUser(IdUsuario: number): Observable<Clientes> {
    return this.http.get<Clientes>(`${this.Back_Api}/rbIU/${IdUsuario}`);
  }

  createRespuesta(respuesta: Respuestas): Observable<any> {
    return this.http.post(`${this.Back_Api}/`, respuesta).pipe(
      catchError(error => {
        console.error('Error al guardar respuesta:', error);
        return of(null);
      })
    );
  }

  deleteRespuesta(id: string | number): Observable<any> {
    return this.http.delete(`${this.Back_Api}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar respuesta:', error);
        return of(null);
      })
    );
  }
}