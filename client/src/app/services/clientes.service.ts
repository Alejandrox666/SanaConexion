import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Clientes } from '../models/clientes';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private baseUrl = 'http://localhost:3002/api'; // Cambia esto a la URL de tu API
  API_URI = 'http://localhost:3002/api';

  constructor(private http: HttpClient) { }

  // Obtener todos los clientes
  getClientes(): Observable<Clientes[]> {
    return this.http.get<Clientes[]>(`${this.baseUrl}/clientes`).pipe(
      catchError(error => {
        console.error('Error al obtener clientes:', error);
        return of([]); // Retorna un array vacío en caso de error
      })
    );
  }

  // Eliminar un cliente
  deleteCliente(id: string | number): Observable<any> {
    return this.http.delete(`${this.API_URI}/clientes/${id}`).pipe(
      catchError(error => {
        console.error('Error al eliminar cliente:', error);
        return of(null); // Retorna null en caso de error
      })
    );
  }

  // Guardar un nuevo cliente
  saveCliente(cliente: Clientes): Observable<any> {
    return this.http.post(`${this.API_URI}/clientes`, cliente).pipe(
      catchError(error => {
        console.error('Error al guardar cliente:', error);
        return of(null); // Retorna null en caso de error
      })
    );
  }

  upCliente(id: string | number, update: Clientes): Observable<Clientes | null> {
    return this.http.put<Clientes>(`${this.API_URI}/clientes/${id}`, update).pipe(
      catchError(error => {
        console.error('Error al actualizar cliente:', error);
        return of(null); // Devolver null en caso de error
      })
    );
}


  // Obtener un cliente por ID (opcional)
  getClienteById(id: number): Observable<Clientes | null> {
    return this.http.get<Clientes>(`${this.API_URI}/clientes/${id}`).pipe(
      catchError(error => {
        console.error('Error al obtener cliente por ID:', error);
        return of(null); // Retorna null en caso de error
      })
    );
  }
}
