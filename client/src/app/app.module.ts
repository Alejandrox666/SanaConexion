import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/login/registro/registro.component';
import { NavigationNutComponent } from './components/navigation-nut/navigation-nut.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { HomeAdminComponent } from './components/home-admin/home-admin.component';
import { FormEspComponent } from './components/form-esp/form-esp.component';
import { FormEspCuentaComponent } from './components/form-esp/form-esp-cuenta/form-esp-cuenta.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { RegistrosComponent } from './components/registros/registros.component';
import { RegistroClienteComponent } from './components/registros/registro-cliente/registro-cliente.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    HomeComponent,
    RegistroComponent,
    NavigationNutComponent,
    HomeAdminComponent,
    FormEspComponent,
    FormEspCuentaComponent,
    MiPerfilComponent,
    RegistrosComponent,
    RegistroClienteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
