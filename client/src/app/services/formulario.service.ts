import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cuestionarios, Preguntas } from '../models/formularios';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {

  private Back_Api = 'http://localhost:3002/api/formularios';

  constructor(private http: HttpClient) { }

  getForm() {
    return this.http.get<Cuestionarios[]>(`${this.Back_Api}/`)
  }

  createForm(cuestionario: Cuestionarios): Observable<any> {
    return this.http.post(`${this.Back_Api}`, cuestionario).pipe(
      catchError(error => {
        console.error('Error al guardar cuestionario:', error);
        return of(null);
      })
    );
  }

  createPre(pregunta: Preguntas): Observable<any> {
    return this.http.post(`${this.Back_Api}/preguntas`, pregunta).pipe(
      catchError(error => {
        console.error('Error al guardar preguntas:', error);
        return of(null)
      })
    )
  }

  updateForm(id: string | number, cuestionario: Cuestionarios): Observable<any> {
    return this.http.put(`${this.Back_Api}/${id}`, cuestionario).pipe(
      catchError(error => {
        console.error('Error al actualizar cuestionario:', error);
        return of(null);
      })
    );
  }

  updatePre(id: string | number, pregunta: Preguntas): Observable<any> {
    return this.http.put(`${this.Back_Api}/preguntas/${id}`, pregunta).pipe(
      catchError(error => {
        console.error('Error al actualizar pregunta:', error);
        return of(null);
      })
    );
  }

  deleteForm(id: string | number): Observable<any> {
    return this.http.delete(`${this.Back_Api}/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar cuestionario:', error);
        return of(null);
      })
    );
  }

  deletePre(id:string|number):Observable<any>{
    return this.http.delete(`${this.Back_Api}/preguntas/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar pregunta:', error);
        return of(null);
      })
    );
  }
}