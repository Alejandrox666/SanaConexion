import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CuestionariosDisponiblesComponent } from './components/cuestionarios-disponibles/cuestionarios-disponibles.component';
import { ChatComponent } from './components/especialista/chat/chat.component';
import { EspecialistaComponent } from './components/especialista/especialista.component';
import { FormulariosComponent } from './components/especialista/formularios/formularios.component';
import { NavbarComponent } from './components/especialista/navbar/navbar.component';
import { FormEspComponent } from './components/especialista/form-esp/form-esp.component';
import { HomeComponent } from './components/home/home.component';
import { ListaEspComponent } from './components/lista-esp/lista-esp.component';
import { LoginComponent } from './components/login/login.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { RCuestionarioComponent } from './components/r-cuestionario/r-cuestionario.component';
import { RegistroClienteComponent } from './components/registros/registro-cliente/registro-cliente.component';
import { RegistrosComponent } from './components/registros/registros.component';
import { VistaClienteComponent } from './components/vista-cliente/vista-cliente.component';
import { ReposicionContrasenaComponent } from './components/reposicion-contrasena/reposicion-contrasena.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'mi-perfil',
    component: MiPerfilComponent
  },

  {
    path: 'formEsp',
    component: FormEspComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'registros',
    component: RegistrosComponent
  },
  {
    path: 'registrosClientes',
    component: RegistroClienteComponent
  },
  {
    path: 'vistaClient',
    component: VistaClienteComponent
  },
  {
    path: 'inicioE',
    component: EspecialistaComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'navE',
    component: NavbarComponent
  },
  {
    path: 'ruta-del-nuevo-componente/:IdCuestionario/:IdEnvio',
    component: RCuestionarioComponent
  },
  {
    path: 'formE',
    component: FormulariosComponent
  },
  {
    path: 'mensajeria',
    component: ChatComponent
  },
  {
    path: 'cuestionarios-disponibles',
    component: CuestionariosDisponiblesComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'lista-especialistas',
    component: ListaEspComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'newPasswd',
    component: ReposicionContrasenaComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
