import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuarios } from '../models/models';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URI = 'https://sanaconexion-1.onrender.com/api';
  
  private isLoggedIn = false;
  private currentUserSubject: BehaviorSubject<Usuarios | null> = new BehaviorSubject<Usuarios | null>(null); 
  private currentUser: Usuarios | null = null;

  constructor(private http: HttpClient) {
    // Usar sessionStorage para obtener la sesión del usuario actual
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser: Usuarios = JSON.parse(storedUser);
      this.currentUserSubject.next(parsedUser);
    }
  }

  login(userId: string): void {
    sessionStorage.setItem('userId', userId); // Usamos sessionStorage en vez de localStorage
  }

  getUserId(): string | null {
    return sessionStorage.getItem('userId'); // Usamos sessionStorage en vez de localStorage
  }

  // Todos tus métodos existentes, pero usando API_URI:
  loginToServer(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URI}/login`, { email, password });
  }

  getEspecialistaByIdUsuario(idUsuario: number): Observable<any> {
    return this.http.get<any>(`${this.API_URI}/usuarioEsp/${idUsuario}`);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  setLoggedInStatus(status: boolean): void {
    this.isLoggedIn = status;
  }

  logout(): void {
    this.setCurrentUser(null);
    sessionStorage.removeItem('currentUser'); // Usamos sessionStorage en vez de localStorage
  }

  setCurrentUser(user: Usuarios | null): void {
    if (user) {
      sessionStorage.setItem('currentUser', JSON.stringify(user)); // Usamos sessionStorage en vez de localStorage
      this.currentUserSubject.next(user);
    } else {
      sessionStorage.removeItem('currentUser'); // Usamos sessionStorage en vez de localStorage
      this.currentUserSubject.next(null);
    }
  }

  getCurrentUserSubject() {
    return this.currentUserSubject;
  }

  getCurrentUser(): Observable<Usuarios | null> {
    return this.currentUserSubject.asObservable();
  }

 
}
