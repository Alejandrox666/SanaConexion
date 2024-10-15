import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Usuarios } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit, OnChanges {
  @Input() datosUsuario!: Usuarios;
  user: Usuarios = {} as Usuarios;

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user) => {
        if (user) {
          this.user = user;
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
        },
        (error) => {
          console.error('Error fetching user data', error);
        }
      );
    } else {
      console.error('No user ID available');
    }
  }
}
