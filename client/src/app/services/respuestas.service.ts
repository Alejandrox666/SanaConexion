import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Clientes, CuestionariosClientes } from '../models/clientes';
import { Preguntas, Respuestas } from '../models/formularios';

@Injectable({
  providedIn: 'root'
})
export class RespuestasService {
  private Back_Api = 'http://localhost:3002/api/respuestas';
  private Back_Api2 = 'http://localhost:3002/api/cuestionariosClientes';

  constructor(private http: HttpClient) {}

  getRespuestas(): Observable<Respuestas[]> {
    return this.http.get<Respuestas[]>(`${this.Back_Api}/`);
  }

  getPreguntas(): Observable<Preguntas[]> {
    return this.http.get<Preguntas[]>(`${this.Back_Api2}/`);
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

  // Asignacion de cuestionarios

  getAsignaciones(): Observable<CuestionariosClientes[]> {
    return this.http.get<CuestionariosClientes[]>(`${this.Back_Api2}/`);
  }

  createAsignacion(asignacion: CuestionariosClientes): Observable<any> {
    return this.http.post(`${this.Back_Api2}/`, asignacion).pipe(
      catchError(error => {
        console.error('Error al guardar asignacion:', error);
        return of(null);
      })
    );
  }
  
  updateAsignacion(id: string | number, cuestionarioCliente: CuestionariosClientes): Observable<any> {
    return this.http.put(`${this.Back_Api2}/${id}`, cuestionarioCliente).pipe(
      catchError(error => {
        console.error('Error al actualizar la asignación del cuestionario:', error);
        return of(null);
      })
    );
  }

  deleteAsignacion(id: string | number): Observable<any> {
    return this.http.delete(`${this.Back_Api2}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar asignacion:', error);
        return of(null);
      })
    );
  }
}