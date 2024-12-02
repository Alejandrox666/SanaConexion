import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Clientes } from 'src/app/models/clientes';
import { ClientesService } from 'src/app/services/clientes.service';
import { RespuestasService } from 'src/app/services/respuestas.service';
import { RespuestaAdapter } from '../adapters/respuesta-adapter.interface';

@Injectable({
  providedIn: 'root'
})
export class RespuestaAdapterService implements RespuestaAdapter {

  constructor(
    private respuestasSrv: RespuestasService,
    private clientesSrv: ClientesService  // Inyeccion al servicio de Clientes
  ) { }

  obtenerRespuestas(idUsuario: number): Observable<any[]> {
    // Primero, obtenemos los clientes que corresponden al IdUsuario
    return this.clientesSrv.getClientes().pipe(
      map((clientes: Clientes[]) => {
        // Filtramos el cliente que tiene el IdUsuario correspondiente
        return clientes.find(c => c.IdUsuario === idUsuario);
      }),
      switchMap(cliente => {
        if (!cliente) {
          // Si no se encuentra un cliente con ese IdUsuario, retornamos un arreglo vacío
          return of([]);  // Cambié Observable.of([]) por of([])
        }
        
        // Si encontramos el cliente, filtramos las respuestas con su IdCliente
        return this.respuestasSrv.getRespuestas().pipe(
          map(respuestas => respuestas.filter(respuesta => respuesta.IdCliente === cliente.IdCliente))
        );
      })
    );
  }
}
