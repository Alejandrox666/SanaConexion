import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './interceptors/error.interceptors';

import { respuestaAdapter } from './adapters/respuesta-adapter';
import { RESPUESTA_SERVICE_TOKEN } from './adapters/respuesta-adapter.interface';
import { VIDEO_ADAPTER_TOKEN } from './adapters/video-adapter.token'; // Token
import { YoutubeAdapter } from './adapters/youtube-adapter'; // Adaptador
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CuestionariosDisponiblesComponent } from './components/cuestionarios-disponibles/cuestionarios-disponibles.component';
import { ChatComponent } from './components/especialista/chat/chat.component';
import { CuestionariosExpComponent } from './components/especialista/cuestionarios-exp/cuestionarios-exp.component';
import { EspecialistaComponent } from './components/especialista/especialista.component';
import { ExpedientesComponent } from './components/especialista/expedientes/expedientes.component';
import { FormEspComponent } from './components/especialista/form-esp/form-esp.component';
import { FormulariosComponent } from './components/especialista/formularios/formularios.component';
import { NavbarComponent } from './components/especialista/navbar/navbar.component';
import { VerPreguntasComponent } from './components/especialista/ver-preguntas/ver-preguntas.component';
import { HomeComponent } from './components/home/home.component';
import { ListaEspComponent } from './components/lista-esp/lista-esp.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/login/registro/registro.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { NavigationCComponent } from './components/navigation-c/navigation-c.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { RCuestionarioComponent } from './components/r-cuestionario/r-cuestionario.component';
import { RegistroClienteComponent } from './components/registros/registro-cliente/registro-cliente.component';
import { RegistrosComponent } from './components/registros/registros.component';
import { ReposicionContrasenaComponent } from './components/reposicion-contrasena/reposicion-contrasena.component';
import { VistaClienteComponent } from './components/vista-cliente/vista-cliente.component';
import { Error404Component } from './components/error404/error404.component';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY, RecaptchaModule } from 'ng-recaptcha';
import { PoliticasPrivComponent } from './components/politicas-priv/politicas-priv.component';
import { PiePaginaComponent } from './components/pie-pagina/pie-pagina.component';

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
    VistaClienteComponent,
    Error404Component,
    PoliticasPrivComponent,
    PiePaginaComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RecaptchaModule
  ],
  providers: [ { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }, { provide: VIDEO_ADAPTER_TOKEN, useClass: YoutubeAdapter }, { provide: RESPUESTA_SERVICE_TOKEN, useClass: respuestaAdapter },importProvidersFrom(RecaptchaV3Module), { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LcLc9UqAAAAAEdnCqjHkMmowBLHU0JEwXGJfbcE' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
