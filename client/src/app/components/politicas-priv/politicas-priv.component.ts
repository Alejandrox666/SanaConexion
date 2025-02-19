import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClientesService } from 'src/app/services/clientes.service';

@Component({
  selector: 'app-politicas-priv',
  templateUrl: './politicas-priv.component.html',
  styleUrls: ['./politicas-priv.component.css']
})
export class PoliticasPrivComponent {
  usuarioTemporal: any;

  constructor(private clienteService: ClientesService, private router: Router) { }
  ngOnInit(): void {
    const usuario = this.clienteService.getUsuarioTemporal2();
    if (usuario && usuario.tipoUsuario) {
      this.usuarioTemporal = usuario.tipoUsuario;

    }
  }

  irAlInicio(): void {
    let ruta = ''

    if (this.usuarioTemporal === 'Cliente') {
      ruta = '/vistaClient';
    } else if (this.usuarioTemporal === 'Especialista') {
      ruta = '/inicioE';
    }

    this.router.navigate([ruta]);
  }

}
