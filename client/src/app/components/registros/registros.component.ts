import { Component, OnInit } from '@angular/core';
import { Usuarios } from 'src/app/models/models';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registros.component.html',
  styleUrls: ['./registros.component.css']
})
export class RegistrosComponent implements OnInit {
  
  mostrarAlertaInsert: boolean = false;
  hayError: boolean = false;
  registro: Usuarios = {
    IdUsuario: 0,
    NombreCompleto: '',
    Telefono: 0,
    Email: '',
    Password: '',
    FechaRegistro: new Date(), // Mantenerlo como un objeto Date
    tipoUsuario: 'Cliente'
  };

  constructor(
    private usuarioService: UsuariosService,
    private router: Router
  ) {}

  ngOnInit() {}

  // Método para convertir una cadena de texto en SHA-256
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join('');
  }

  // Método para registrar al cliente
  async registrarUsuario() {
    const fechaActual = new Date();
    this.registro.FechaRegistro = fechaActual; // Mantenerlo como un objeto Date

    // Convertir la fecha a formato MySQL
    const fechaFormatoMySQL = fechaActual.toISOString().slice(0, 19).replace('T', ' ');
    this.registro.FechaRegistro = fechaFormatoMySQL; // Asignar el formato correcto

    // Encriptar la contraseña de forma asíncrona
    this.registro.Password = await this.hashPassword(this.registro.Password);

    this.usuarioService.saveuser(this.registro).subscribe(
      resp => {
        console.log(resp);
        this.mostrarAlertaInsert = true;
        this.router.navigate(['/usuario']);
      },
      err => {
        console.log(err);
        this.hayError = true; // Muestra un error más detallado aquí si es posible
      }
    );
  }

  irAlSiguientePaso() {
    // Convertir la fecha a formato MySQL
    const fechaActual = new Date();
    const fechaFormatoMySQL = fechaActual.toISOString().slice(0, 19).replace('T', ' ');
  
    // Asigna la fecha formateada antes de guardar
    this.registro.FechaRegistro = fechaFormatoMySQL;
  
    // Guarda los datos del usuario en un servicio compartido para usarlos más adelante
    this.usuarioService.setUsuarioTemporal(this.registro);
    
    // Redirige al siguiente componente
    this.router.navigate(['/registrosClientes']);
  }
  
  
}
