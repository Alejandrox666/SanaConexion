import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-cliente',
  templateUrl: './registro-cliente.component.html',
  styleUrls: ['./registro-cliente.component.css']
})
export class RegistroClienteComponent implements OnInit {

  cliente = {
    IdCliente: 0,
    IdUsuario: 0,
    Edad: 0,
    Sexo: '',
    Peso: 0,
    Estatura: 0,
    EnfCronicas: '',
    Alergias: '',
    ObjetivoSalud: '',
    Medicamentos: '',
    Foto: null as unknown as File
  };

  constructor(
    private usuarioService: UsuariosService,
    private clientesService: ClientesService,
    private router: Router
  ) {}

  ngOnInit() {
    const usuarioTemporal = this.usuarioService.getUsuarioTemporal();
    if (usuarioTemporal) {
      this.cliente.IdUsuario = usuarioTemporal.IdUsuario; // Asignar el IdUsuario al cliente
    } else {
      console.log('No se encontraron datos del usuario.');
    }
  }

  registrarAmbos() {
    const usuarioTemporal = this.usuarioService.getUsuarioTemporal();
    
    // Comprobar que usuarioTemporal no es null antes de guardar
    if (usuarioTemporal) {
      usuarioTemporal.tipoUsuario='Cliente'
      this.usuarioService.saveuser(usuarioTemporal).subscribe(
        resp => {
          console.log('Respuesta del servidor:', resp); 
          if (resp && resp.IdUsuario) {
            // Asigna el IdUsuario recibido
            this.cliente.IdUsuario = resp.IdUsuario;

            // Muestra el IdUsuario en la consola
          console.log('ID del usuario registrado:', this.cliente.IdUsuario);
            
         
        
            // Ahora guardar los datos en la tabla 'clientes'
            this.clientesService.saveCliente(this.cliente).subscribe(
              (respCliente: any) => {
                console.log('Cliente guardado:', respCliente);
                this.router.navigate(['/login']);
              },
              (err: any) => {
                console.log('Error al guardar cliente:', err);
              }
            );
          }
        },
        err => {
          console.log('Error al guardar usuario:', err);
        }
      );
    } else {
      console.log('No se encontraron datos del usuario para guardar.');
    }
  }
  goToLogin(){
    this.router.navigate(["/login"],{replaceUrl:true})
  }

  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
        this.cliente.Foto = event.target.files[0]; // Asigna el primer archivo seleccionado
    }
}

  
}
