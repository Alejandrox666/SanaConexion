import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chats, EnvioForm, Mensajes, Participantes } from '../models/chats';
import { catchError, Observable, of } from 'rxjs';
import { Usuarios } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private Back_ApiC = 'https://sanaconexion-1.onrender.com/api/chats';
  private Back_ApiU = 'https://sanaconexion-1.onrender.comapi/users';
  private Back_Api = 'https://sanaconexion-1.onrender.com/api';

  constructor(private http: HttpClient) { }

  getChats() {
    return this.http.get<Chats[]>(`${this.Back_ApiC}/`)
  }

  getParticipantes(): Observable<Participantes[]> {
    return this.http.get<Participantes[]>(`${this.Back_ApiC}/participantes`);
  }

  getMsj() {
    return this.http.get<Mensajes[]>(`${this.Back_ApiC}/msj`)
  }

  getMensajesPorChat(idChat: number): Observable<Mensajes[]> {
    return this.http.get<Mensajes[]>(`${this.Back_ApiC}/msj/${idChat}`);
  }

  createChats(chats: Chats): Observable<any> {
    return this.http.post(`${this.Back_ApiC}`, chats).pipe(
      catchError(error => {
        console.error('Error al guardar chat:', error);
        return of(null);
      })
    );
  }

  createPart(participante: Participantes): Observable<any> {
    return this.http.post(`${this.Back_ApiC}/participantes`, participante).pipe(
      catchError(error => {
        console.error('Error al guardar msj:', error);
        return of(null)
      })
    )
  }

  createMsj(mensajes: Mensajes): Observable<any> {
    return this.http.post(`${this.Back_ApiC}/msj`, mensajes).pipe(
      catchError(error => {
        console.error('Error al guardar msj:', error);
        return of(null)
      })
    )
  }

  getUsuariosById(idUsuario: number): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(`${this.Back_ApiU}/${idUsuario}`);
  }

  getEnvioForm(): Observable<any> {
    return this.http.get<EnvioForm[]>(`${this.Back_Api}/envioForm`);
  }

  enviarFormulario(envioForm: EnvioForm): Observable<any> {
    return this.http.post(`${this.Back_Api}/envioForm`, envioForm);
  }

  updateEnvio(id: string | number, envioForm: EnvioForm): Observable<any> {
    return this.http.put(`${this.Back_Api}/envioForm/${id}`, envioForm).pipe(
      catchError(error => {
        console.error('Error al actualizar cuestionario:', error);
        return of(null);
      })
    );
  }
}
