import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Usuarios } from '../models/models';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private usuarioTemporal: Usuarios | null = null;

  private baseUrl = `${environment.apiUrl}/api`; // Modificado
  API_URI = `${environment.apiUrl}/api`; // Modificado
  API_URI2 = `${environment.apiUrl}/api`; // Modificado
  constructor(private http: HttpClient) { }

  getuser(){
    return this.http.get<Usuarios[]>(`${this.API_URI}/users`);
  }

  // Método para enviar el código de verificación
  enviarContrasena(email: string): Observable<any> {
    return this.http.post(`${this.API_URI}/users/send-passwd`, { email });
  }

  // Método para enviar el código de verificación
  enviarCodigo(email: string): Observable<any> {
    return this.http.post(`${this.API_URI}/users/send-code`, { email });
  }

  // Método para verificar el código de verificación
  verificarCodigo(email: string, code: string): Observable<any> {
    return this.http.post(`${this.API_URI}/users/verify-code`, { email, code });
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

  cambiarContrasena(email: string, newPassword: string): Observable<any> {
    const update = { email, newPassword }; // Construir el objeto con ambos campos
    return this.http.put<any>(`${this.API_URI}/users/${email}`, update);
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
