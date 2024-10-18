import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormEspCuentaComponent } from './components/form-esp/form-esp-cuenta/form-esp-cuenta.component';
import { FormEspComponent } from './components/form-esp/form-esp.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { RegistrosComponent } from './components/registros/registros.component';

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
    path:'formEspCuenta',
    component:FormEspCuentaComponent
  },
  {
    path:'registros',
    component:RegistrosComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
