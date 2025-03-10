import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  constructor(private activeModal:NgbActiveModal){}

  cerrarModal() {
    this.activeModal.dismiss('Modal cerrado por el usuario');
  }
  
}
