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
  editMode: boolean = false; 
  editEntrevistaMode: boolean = false;

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

   // Alterna la visibilidad de la sección de Entrevista Inicial
   toggleEntrevista() {
    this.mostrarEntrevista = !this.mostrarEntrevista;
  }


  editarPerfil() {
    const userId = this.user.IdUsuario
    console.log(userId)
    if (userId && this.user) { // Asegúrate de que `userId` y `user` existen
      this.userService.putProfile(userId, this.user).subscribe(
        (respuesta) => {
          if (respuesta) {
            console.log('Perfil actualizado:', respuesta);
            // Aquí puedes agregar una notificación de éxito
          } else {
            console.error('La actualización del perfil falló.');
          }
        },
        (error) => {
          console.error('Error al actualizar el perfil:', error); // Manejo del error
        }
      );
    } else {
      console.error('No se pudo obtener el ID de usuario o el perfil de usuario está incompleto.');
    }
  }
  
  

  // Método para editar la entrevista
  editarEntrevista() {
  
    
    const userId = this.user.IdUsuario
     const clienteid = this.cliente.IdUsuario
    
     const clienteId = this.cliente.IdCliente;  // Asegúrate de que IdCliente es el campo correcto para el ID del cliente
     console.log("User ID:", this.user.IdUsuario);
     console.log("Cliente ID:", clienteId);
     console.log("Cliente data:", this.cliente);
    if (userId && this.cliente) { // Asegúrate de que `userId` y `user` existen
      this.clientesService.upCliente(userId, this.cliente).subscribe(
        (respuesta) => {
          if (respuesta) {
            console.log('Encuesta actualizada:', respuesta);
            // Aquí puedes agregar una notificación de éxito
            this.editEntrevistaMode = false;
          } else {
            console.error('La actualización de la encuesta falló.');
          }
        },
        (error) => {
          console.error('Error al actualizar la encuesta:', error); // Manejo del error
        }
      );
    } else {
      console.error('No se pudo obtener el ID de usuario o la encuesta del usuario está incompleta.');
    }
}

// Método para alternar el modo de edición
editarPerfil2() {
  this.editMode = !this.editMode;
}

// Cancelar la edición y revertir cambios
cancelarEdicion() {
  this.editMode = false;
   // Recargar los datos originales del usuario
}

toggleEditEntrevista() {
  this.editEntrevistaMode = !this.editEntrevistaMode;
}

cancelarEdicionEntrevista() {
  this.editEntrevistaMode = false;
  // Opcional: recargar los datos originales del cliente si quieres revertir cambios
}
onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      // Guardamos la imagen en formato base64 en el objeto cliente
      this.cliente.Foto = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
}