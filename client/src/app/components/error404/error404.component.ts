import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error404',
  templateUrl: './error404.component.html',
  styleUrls: ['./error404.component.css']
})
export class Error404Component {
  errorCode: number = 404;
  ruta ="/assets/Fat.jpg"
  errorMessage: string = 'Página no encontrada';
  errorFrase:string="Ups!!, esta URL no es de nuestra talla.";
  errorIcon: string = 'bi-emoji-frown'; // Icono por defecto

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.errorCode = +params['code'] || 404;
      console.log(this.errorCode);
      console.log('Tipo de error:', typeof this.errorCode);
      
      switch (this.errorCode) {
        case 400:
          this.errorMessage = 'Solicitud incorrecta';
          this.errorIcon = 'bi-exclamation-triangle';
          break;
        case 401:
          this.errorMessage = 'No estás autenticado';
          this.errorIcon = 'bi-lock-fill';
          break;
        case 403:
          this.errorMessage = 'No tienes permisos';
          this.errorIcon = 'bi-x-octagon';
          break;
        case 404:
          this.errorFrase
          this.errorMessage = 'Página no encontrada';
          this.errorIcon = 'bi-emoji-frown';
          break;
        case 500:
          this.ruta= "/assets/7471055.webp"
          this.errorFrase = "Ups!! no soporto la presión el servidor."
          this.errorMessage = 'Error interno del servidor';
          this.errorIcon = 'bi-server';
          break;
        default:
          console.log(this.errorCode)
          this.errorMessage = 'Ocurrió un error inesperado';
          this.errorIcon = 'bi-bug';
      }
    });
  }
}
