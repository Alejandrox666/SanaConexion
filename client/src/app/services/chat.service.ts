import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chats, EnvioForm, Mensajes, Participantes } from '../models/chats';
import { catchError, Observable, of } from 'rxjs';
import { Usuarios } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private Back_ApiC = 'http://localhost:3002/api/chats';
  private Back_ApiU = 'http://localhost:3002/api/users';
  private Back_Api = 'http://localhost:3002/api';

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

  enviarFormulario(envioForm:EnvioForm): Observable<any> {
    return this.http.post(`${this.Back_Api}/envioForm`,envioForm);
  }
}
