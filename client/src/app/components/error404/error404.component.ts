import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.css']
})
export class Error404Component {
  errorCode: number;
  mensajeError: string;

  constructor(private route: ActivatedRoute) {
    this.errorCode = Number(this.route.snapshot.queryParams['code']) || 500;
    this.mensajeError = this.obtenerMensajeError(this.errorCode);
  }

  obtenerMensajeError(code: number): string {
    switch (code) {
      case 404: return 'Página no encontrada';
      case 500: return 'Error interno del servidor';
      case 403: return 'Acceso denegado';
      default: return 'Ocurrió un error desconocido';
    }
  }
}
