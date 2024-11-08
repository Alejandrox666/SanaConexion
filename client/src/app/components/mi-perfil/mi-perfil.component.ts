import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Usuarios } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { Clientes } from 'src/app/models/clientes';
import { ClientesService } from 'src/app/services/clientes.service';
import { DatosEspService } from 'src/app/services/datos-esp.service';
import { Especialistas } from 'src/app/models/models';



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

  @Input() datosEspecialistas!: Especialistas;
  especialista: Especialistas = {} as Especialistas;
  mostrarEntrevista: boolean = false;
  editMode: boolean = false; 
  editMode2: boolean = false;
  editEntrevistaMode: boolean = true;
  modoTipoUsuario:string = '';

  constructor(private userService: UserService, private authService: AuthService, private clientesService:ClientesService, private especialistasService: DatosEspService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user) => {
        if (user) {
          this.user = user;
          this.modoTipoUsuario  = user.tipoUsuario;
          console.log(user);
          const userId = user.IdUsuario
          console.log(userId)
          console.log(this.modoTipoUsuario);
          if (this.modoTipoUsuario == 'Cliente'){
            this.clientesService.getClienteByIdUsuario(userId!).subscribe(
              (data: Clientes) => {
                this.cliente = data;
              
                
                console.log(data); // Ejemplo de cómo puedes usar los datos
              },
              (error) => {
                // Maneja el error aquí
                console.error(error); // Ejemplo de cómo manejar el error
              }
            );
          }
          if (this.modoTipoUsuario == 'Especialista') {
            this.especialistasService.getEspecialistaById(userId!).subscribe(
              (data: Especialistas | null) => {
                if (data) {
                  this.especialista = data;
                } else {
                  console.warn('No se encontraron datos de especialista');
                }
                console.log(data); // Ejemplo de cómo puedes usar los datos
              },
              (error) => {
                // Maneja el error aquí
                console.error(error); // Ejemplo de cómo manejar el error
              }
            );
          }
          
        
          
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
    this.editEntrevistaMode = !this.editEntrevistaMode;
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
            alert('Su perfil ha sido actualizado');
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
     
     const tipoUser = this.user.tipoUsuario;
     console.log(tipoUser);
    
     const clienteId = this.cliente.IdCliente;  // Asegúrate de que IdCliente es el campo correcto para el ID del cliente
     console.log("User ID:", this.user.IdUsuario);
     console.log("Tipo user",tipoUser);
     console.log("Cliente ID:", clienteId);
     console.log("Cliente data:", this.cliente);
     if(tipoUser == 'Cliente'){
      if (userId && this.cliente) { // Asegúrate de que `userId` y `user` existen
        this.clientesService.upCliente(userId, this.cliente).subscribe(
          (respuesta) => {
            if (respuesta) {
              console.log('Encuesta actualizada:', respuesta);
              alert('Su entrevista ha sido actualizada');
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
     if(tipoUser == 'Especialista'){
      if (userId && this.especialista) { 
        this.especialistasService.upEspecialista(userId, this.especialista).subscribe(
          (respuesta) => {
            if (respuesta) {
              console.log('Encuesta actualizada:', respuesta);
              
              alert('Su entrevista ha sido actualizada');
              this.editEntrevistaMode = false;  
              this.editMode2 = false;
            } else {
              console.error('La actualización de la encuesta falló.');
            }
          },
          (error) => {
            console.error('Error al actualizar la encuesta:', error); 
          }
        );
      } else {
        console.error('No se pudo obtener el ID de usuario o la encuesta del usuario está incompleta.');
      }
     }
    
}

// Método para alternar el modo de edición
editarPerfil2() {
  this.editMode = !this.editMode;
}

// Cancelar la edición y revertir cambios
cancelarEdicion() {
  this.editMode = false;
   
}

toggleEditEntrevista() {
  this.editEntrevistaMode = !this.editEntrevistaMode;
  this.editMode2 = !this.editMode2;

}

cancelarEdicionEntrevista() {
  this.editEntrevistaMode = false;
  
  this.editMode2 = false;
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