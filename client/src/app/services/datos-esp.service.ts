import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Especialistas, Usuarios } from '../models/models';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosEspService {
  private Back_Api = 'https://sanaconexion-1.onrender.com/api';

  constructor(private http:HttpClient) { }

  getEsp(){
    return this.http.get<Usuarios[]>(`${this.Back_Api}/usuarioEsp`)
  }

  createUsEsp(body:Usuarios):Observable<any>{
    return this.http.post(`${this.Back_Api}/usuarioEsp/usuarios`,body).pipe(
      catchError(error => {
        console.error('Error al guardar usuario:', error);
        return of(null);
      })
    );
  }

  createEsp(body:Especialistas):Observable<any>{
    return this.http.post(`${this.Back_Api}/usuarioEsp/especialistas`,body).pipe(
      catchError(error => {
        console.error('Error al guardar especialista:', error);
        return of(null);
      })
    );
  }

   // Obtener un cliente por ID (opcional)
   getEspecialistaById(id: number): Observable<Especialistas | null> {
    return this.http.get<Especialistas>(`${this.Back_Api}/usuarioEsp/prueba/${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener especialista por ID:', error);
        return of(null); // Retorna null en caso de error
      })
    );
  }

  upEspecialista(id: string | number, update: Especialistas): Observable<Especialistas | null> {
    return this.http.put<Especialistas>(`${this.Back_Api}/usuarioEsp/especialistas/${id}`, update).pipe(
      catchError(error => {
        console.error('Error al actualizar especialista:', error);
        return of(null); // Devolver null en caso de error
      })
    );
}

}
