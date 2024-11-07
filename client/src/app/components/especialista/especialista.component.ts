import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Usuarios } from 'src/app/models/models';


@Component({
  selector: 'app-especialista',
  templateUrl: './especialista.component.html',
  styleUrls: ['./especialista.component.css']
})
export class EspecialistaComponent implements OnInit {
  datosCargados = false;
  usuario : Usuarios = {} as Usuarios;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((usuario) => {
      if (usuario) {
        this.usuario = usuario;
        this.datosCargados = true;
      } else {
        console.error('No se encontró un usuario activo');
      }
    });
  }
  
}
