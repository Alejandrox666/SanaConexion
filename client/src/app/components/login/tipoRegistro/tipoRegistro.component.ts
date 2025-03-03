import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tipoRegistro',
  templateUrl: './tipoRegistro.component.html',
  styleUrls: ['./tipoRegistro.component.css']
})
export class TipoRegistroComponent {

  constructor(private activeModal:NgbActiveModal){}

  cerrarModal() {
    this.activeModal.dismiss('Modal cerrado por el usuario');
  }
  
}
