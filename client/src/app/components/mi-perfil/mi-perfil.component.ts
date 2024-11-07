import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Usuarios } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Clientes } from 'src/app/models/clientes';
import { ClientesService } from 'src/app/services/clientes.service';


@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit, OnChanges {
  
  @Input() datosUsuario!: Usuarios;
  user: Usuarios = {} as Usuarios;

  @Input() datosClientes!: Clientes;
  cliente: Clientes = {} as Clientes;
  mostrarEntrevista: boolean = false;

  constructor(private userService: UserService, private authService: AuthService, private clientesService:ClientesService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user) => {
        if (user) {
          this.user = user;
          console.log(user);
          const userId = user.IdUsuario
          console.log(userId)
          this.clientesService.getClienteByIdUsuario(userId!).subscribe(
            (data: Clientes) => {
              this.cliente = data;
            
              // Maneja la respuesta aquí
              console.log(data); // Ejemplo de cómo puedes usar los datos
            },
            (error) => {
              // Maneja el error aquí
              console.error(error); // Ejemplo de cómo manejar el error
            }
          );
          
        } else {
          console.error('No user is currently logged in.');
        }
      },
      (error) => {
        console.error('Failed to load user data:', error);
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datosUsuario'] && changes['datosUsuario'].currentValue) {
      this.user = changes['datosUsuario'].currentValue;
    }
  }

  initializeUserProfile(): void {
    if (this.datosUsuario) {
      this.user = this.datosUsuario;
      
    } else {
      this.loadUserProfile();
    }
  }

  loadUserProfile(): void {
    const userId = this.authService.getUserId();

    if (userId) {
      this.userService.getUserProfile(userId).subscribe(
        (data: Usuarios) => {
          this.user = data;
        }
        
        ,
        
        
        (error) => {
          console.error('Error fetching user data', error);
        }
      );
    
    } else {
      console.error('No user ID available');
    }
  }
}
