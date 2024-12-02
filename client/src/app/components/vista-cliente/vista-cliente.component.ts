import { Component, OnInit } from '@angular/core'; 
import { DatosEspService } from 'src/app/services/datos-esp.service';
import { Usuarios, Especialistas } from 'src/app/models/models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YoutubeService } from 'src/app/services/youtube.service';
import { Router } from '@angular/router';
import { Cuestionarios } from 'src/app/models/formularios';
import { FormularioService } from 'src/app/services/formulario.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { Clientes } from 'src/app/models/clientes';

@Component({
  selector: 'app-vista-cliente',
  templateUrl: './vista-cliente.component.html',
  styleUrls: ['./vista-cliente.component.css']
})
export class VistaClienteComponent implements OnInit {

  cuestionariosget: Cuestionarios[] = [];
  videos: any[] | undefined; // Almacena los datos de los videos
  videoUrl: SafeResourceUrl;
  especialistas: (Usuarios & Especialistas)[] = [];
  IdCliente!: number;
  usuarioTemporal: any; // Declara usuarioTemporal como propiedad de la clase
  objSalud: string | undefined;
  

  // Arreglo de imágenes
  imagenesEspecialistas = [
    'assets/casual.jpg',
    'assets/people.png',
  ];

  notificaciones = [
    { mensaje: 'Juan David Espinoza Guzman te envió un formulario', fecha: '2024-10-27' },
    { mensaje: 'Nuevo mensaje de Juan David Espinoza Guzman', fecha: '2024-10-28' },
  ];

  constructor(
    private datosEspService: DatosEspService,
    private youtubeService: YoutubeService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private preguntaSrv: FormularioService,
    private clienteService: ClientesService
  ) {
    this.videoUrl = ''; // Inicializa videoUrl
  }

  ngOnInit(): void {
    this.getEspecialistas();

    // Asigna el valor de usuarioTemporal
    this.usuarioTemporal = this.clienteService.getUsuarioTemporal();
    console.log(this.usuarioTemporal);

    // Llama a getIdClienteByIdUser y luego a getVideos
    this.getIdClienteByIdUser(this.usuarioTemporal.IdUsuario);

    // Cargar cuestionarios
    this.preguntaSrv.getForm().subscribe(
      (res: Cuestionarios[]) => {
        this.cuestionariosget = res;
        console.log('CUESTIONARIOS', this.cuestionariosget);
      },
      (err) => console.error(err)
    );
  }

  // Obtiene la lista de especialistas
  getEspecialistas(): void {
    this.datosEspService.getEsp().subscribe(
      (data: any[]) => {
        this.especialistas = data.map((especialista) => ({
          ...especialista,
          mostrarMas: false, // Inicializa mostrarMas en false
        }));
      },
      (error: any) => console.error('Error al obtener especialistas:', error)
    );
  }

  // Función para obtener una imagen aleatoria
  getRandomImage(): string {
    const randomIndex = Math.floor(Math.random() * this.imagenesEspecialistas.length);
    return this.imagenesEspecialistas[randomIndex];
  }

  // Crea una URL segura para el video
  getVideoUrl(videoId: string): SafeResourceUrl {
    if (videoId) {
      const url = `https://www.youtube.com/embed/${videoId}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return '';
  }

  // Redirige a la página del cuestionario
  redirectToCuestionario(): void {
    this.router.navigate(['/rCuestionario']);
  }

  // Obtiene el ID del cliente a partir del ID del usuario
  getIdClienteByIdUser(IdUsuario: number): void {
    this.clienteService.getClienteByIdUsuario(IdUsuario).subscribe(
      (res: Clientes) => {
        this.IdCliente = res.IdCliente;
        this.objSalud = res.ObjetivoSalud;
        console.log('IdCliente obtenido:', this.IdCliente);
        console.log('Objetivo de salud obtenido:', this.objSalud);

        // Llama al servicio de YouTube ahora que objSalud tiene un valor
        const query = this.objSalud || 'Mejora tú alimentación';
        this.youtubeService.getVideos(query).subscribe(
          (data: any) => {
            this.videos = data.items;
            console.log('Videos obtenidos:', this.videos);
          },
          (err) => console.error('Error al obtener videos:', err)
        );
      },
      (err) => console.error('No se encontró el cliente para el usuario.', err)
    );
  }
}
