import { Component, OnInit } from '@angular/core';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-pie-pagina',
  templateUrl: './pie-pagina.component.html',
  styleUrls: ['./pie-pagina.component.css']
})
export class PiePaginaComponent implements OnInit {
  usuarioTemporal: any;


  constructor(private clienteService: ClientesService){}
  ngOnInit(): void {
    const usuario = this.clienteService.getUsuarioTemporal2();
    if (usuario && usuario.tipoUsuario) {
      this.usuarioTemporal = usuario.tipoUsuario;
  }
 

}
}