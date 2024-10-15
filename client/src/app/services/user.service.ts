import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuarios } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3002/api/usuarios'; // Cambia esto a tu URL real de API

  constructor(private http: HttpClient) {}

  getUserProfile(userId: string): Observable<Usuarios> {
    return this.http.get<Usuarios>(`${this.apiUrl}/${userId}`);
  }
}
