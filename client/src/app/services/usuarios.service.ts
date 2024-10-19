import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Usuarios } from '../models/models';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private usuarioTemporal: Usuarios | null = null;

  private baseUrl = 'http://localhost:3002/api';
  API_URI='http://localhost:3002/api';
  API_URI2='http://localhost:3002/api';
  constructor(private http: HttpClient) { }

  getuser(){
    return this.http.get<Usuarios[]>(`${this.API_URI}/users`);
  }

  deleteuser(id: string|number){
    return this.http.delete(`${this.API_URI}/users/${id}`);
  }

  saveuser(evento: Usuarios): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, evento).pipe(
      catchError(error => {
        console.error('Error al guardar usuario:', error);
        return of(null);
      })
    );
  }



  upuser(id: string | number, update: Usuarios): Observable<Usuarios> {
    return this.http.put<Usuarios>(`${this.API_URI}/users/${id}`, update);
  }

  getTipoU(){
    return this.http.get<Usuarios[]>(`${this.API_URI2}/tipos`);
  }


  setUsuarioTemporal(usuario: Usuarios) {
    this.usuarioTemporal = usuario;
  }

  getUsuarioTemporal(): Usuarios | null {
    return this.usuarioTemporal;
  }

}
