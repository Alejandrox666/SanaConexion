import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Usuarios } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = false;
  private currentUserSubject: BehaviorSubject<Usuarios | null> = new BehaviorSubject<Usuarios | null>(null); // Ajusta aquí
  private currentUser: Usuarios | null = null;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  login(userId: string): void {
    localStorage.setItem('userId', userId);
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  loginToServer(email: string, password: string): Observable<any> {
    return this.http.post<any>('http://localhost:3002/api/login', { email, password });
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  setLoggedInStatus(status: boolean): void {
    this.isLoggedIn = status;
  }

  logout(): void {
    this.setLoggedInStatus(false);
    this.setCurrentUser(null);
    localStorage.removeItem('currentUser');
  }

  setCurrentUser(user: Usuarios | null): void {
    this.currentUser = user;
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
    } else {
      this.currentUserSubject.next(null);
    }
  }

  getCurrentUser(): Observable<Usuarios | null> {
    return this.currentUserSubject.asObservable();
  }
}
