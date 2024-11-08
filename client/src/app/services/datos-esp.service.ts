import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Especialistas, Usuarios } from '../models/models';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosEspService {
  private Back_Api = 'http://localhost:3002/api';

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

}
