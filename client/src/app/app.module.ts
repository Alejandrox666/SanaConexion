import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/login/registro/registro.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { FormEspComponent } from './components/especialista/form-esp/form-esp.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { RegistrosComponent } from './components/registros/registros.component';
import { RegistroClienteComponent } from './components/registros/registro-cliente/registro-cliente.component';
import { VistaClienteComponent } from './components/vista-cliente/vista-cliente.component';
import { NavbarComponent } from './components/especialista/navbar/navbar.component';
import { EspecialistaComponent } from './components/especialista/especialista.component';
import { RCuestionarioComponent } from './components/r-cuestionario/r-cuestionario.component';
import { FormulariosComponent } from './components/especialista/formularios/formularios.component';
import { ChatComponent } from './components/especialista/chat/chat.component';
import { CuestionariosDisponiblesComponent } from './components/cuestionarios-disponibles/cuestionarios-disponibles.component';
import { NavigationCComponent } from './components/navigation-c/navigation-c.component';
import { ListaEspComponent } from './components/lista-esp/lista-esp.component';
import { ReposicionContrasenaComponent } from './components/reposicion-contrasena/reposicion-contrasena.component';
import { ExpedientesComponent } from './components/especialista/expedientes/expedientes.component';
import { CuestionariosExpComponent } from './components/especialista/cuestionarios-exp/cuestionarios-exp.component';
import { VerPreguntasComponent } from './components/especialista/ver-preguntas/ver-preguntas.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    HomeComponent,
    RegistroComponent,
    FormEspComponent,
    MiPerfilComponent,
    RegistrosComponent,
    RegistroClienteComponent,
    VistaClienteComponent,
    NavbarComponent,
    EspecialistaComponent,
    RCuestionarioComponent,
    FormulariosComponent,
    ChatComponent,
    CuestionariosDisponiblesComponent,
    NavigationCComponent,
    NavigationCComponent,
    CuestionariosDisponiblesComponent,
    ListaEspComponent,
    ReposicionContrasenaComponent,
    ExpedientesComponent,
    CuestionariosExpComponent,
    VerPreguntasComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule, 
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
