// src/app/services/respuesta-adapter.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { IRespuestaService } from '../adapters/respuesta-adapter.interface';
import { Clientes } from '../models/clientes';
import { ClientesService } from './clientes.service';
import { RespuestasService } from './respuestas.service';

@Injectable({
  providedIn: 'root'
})
export class RespuestaAdapterService implements IRespuestaService {
  constructor(
    private respuestasSrv: RespuestasService,
    private clientesSrv: ClientesService
  ) {}

  obtenerRespuestasFiltradasPorUsuario(idUsuario: number): Observable<any[]> {
    return this.clientesSrv.getClientes().pipe(
      switchMap((clientes: Clientes[]) => {
        const cliente = clientes.find(c => c.IdUsuario === idUsuario);
        if (!cliente) {
          console.warn(`Cliente no encontrado para IdUsuario: ${idUsuario}`);
          return of([]); // Retorna un array vacío si no hay cliente
        }
        return this.respuestasSrv.getRespuestas().pipe(
          map(respuestas =>
            respuestas.filter(respuesta => respuesta.IdCliente === cliente.IdCliente)
          )
        );
      })
    );
  }
}

