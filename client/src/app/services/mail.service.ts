import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private apiUrl = 'https://sanaconexion-1.onrender.com/api/usuarios'; // Cambia esto a tu URL real

  constructor(private http: HttpClient) { }

  // Método para enviar el código de verificación
  sendVerificationCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send-verification-code`, { email });
  }

  // Método para verificar el código de verificación
  verifyCode(email: string, code: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-code`, { email, code });
  }
}
