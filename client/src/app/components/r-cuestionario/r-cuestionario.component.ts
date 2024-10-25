import { Component } from '@angular/core';

@Component({
  selector: 'app-r-cuestionario',
  templateUrl: './r-cuestionario.component.html',
  styleUrls: ['./r-cuestionario.component.css']
})
export class RCuestionarioComponent {

  mensaje: string | null = null;

  onSubmit() {
    // Aquí puedes agregar lógica para enviar los datos del formulario, si es necesario.
    
    // Muestra el mensaje de éxito
    this.mensaje = 'Su cuestionario ha sido enviado correctamente.';
    
    // Opcionalmente, puedes limpiar el formulario aquí
    // (puedes hacerlo accediendo a los elementos del formulario)
  }
}
