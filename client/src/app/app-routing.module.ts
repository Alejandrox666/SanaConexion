import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormEspComponent } from './components/form-esp/form-esp.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { RegistrosComponent } from './components/registros/registros.component';
import { RegistroClienteComponent } from './components/registros/registro-cliente/registro-cliente.component';
import { VistaClienteComponent } from './components/vista-cliente/vista-cliente.component';
import { EspecialistaComponent } from './components/especialista/especialista.component';
import { NavbarComponent } from './components/especialista/navbar/navbar.component';
import { RCuestionarioComponent } from './components/r-cuestionario/r-cuestionario.component';

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
    path:'formEsp',
    component:FormEspComponent
  },
  {
    path:'registros',
    component:RegistrosComponent
  },
  {
    path:'registrosClientes',
    component:RegistroClienteComponent
  },
  {
    path:'vistaClient',
    component:VistaClienteComponent
  },
  {
    path:'inicioE',
    component:EspecialistaComponent
  },
  {
    path:'navE',
    component:NavbarComponent
  },
  {
    path:'rCuestionario',
    component: RCuestionarioComponent
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
