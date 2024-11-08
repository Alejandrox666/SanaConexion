import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuarios } from '../models/models';
import { catchError } from 'rxjs';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3002/api/users';
  
  constructor(private http: HttpClient) {}

  getUserProfile(userId: string): Observable<Usuarios> {
    return this.http.get<Usuarios>(`${this.apiUrl}/${userId}`);
  }

  putProfile(userId: number, usuario: Usuarios): Observable<Usuarios | null> {
    return this.http.put<Usuarios>(`${this.apiUrl}/prueba/${userId}`, usuario).pipe(
      catchError(error => {
        console.error('Error al actualizar el cliente:', error);
        return of(null); // Devolver null en caso de error
      })
    );
  }

}
