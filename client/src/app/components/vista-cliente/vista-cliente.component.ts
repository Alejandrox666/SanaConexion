import { Component, OnInit } from '@angular/core';
import { DatosEspService } from 'src/app/services/datos-esp.service'; // Ajusta la ruta según sea necesario
import { Usuarios, Especialistas } from 'src/app/models/models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YoutubeService } from 'src/app/services/youtube.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vista-cliente',
  templateUrl: './vista-cliente.component.html',
  styleUrls: ['./vista-cliente.component.css']
})
export class VistaClienteComponent implements OnInit {

  videos: any[] | undefined; // Almacena los datos de los videos
  videoUrl: SafeResourceUrl; 
  especialistas: (Usuarios & Especialistas)[] = [];

  // Arreglo de imágenes
  imagenesEspecialistas = [
    'assets/casual.jpg',
    'assets/people.png',
    
  ];

  notificaciones = [
    { mensaje: 'Juan David Espinoza Guzman te envió un formulario', fecha: '2024-10-27' },
    { mensaje: 'Nuevo mensaje de Juan David Espinoza Guzman', fecha: '2024-10-28' },
    // Agrega más notificaciones aquí si lo deseas
  ];

  constructor(
    private datosEspService: DatosEspService,
    private youtubeService: YoutubeService,
    private sanitizer: DomSanitizer,
    private router: Router
  ) { 
    this.videoUrl = ''; // Inicializa videoUrl
  }

  ngOnInit(): void {
    this.getEspecialistas();
    // Llama al servicio para obtener los videos
    this.youtubeService.getVideos().subscribe((data: any) => {
      this.videos = data.items;
    });
  }

  // Obtiene la lista de especialistas
  getEspecialistas(): void {
    this.datosEspService.getEsp().subscribe(
      (data: any[]) => {
        this.especialistas = data.map((especialista) => ({
          ...especialista,
          mostrarMas: false, // Inicializa mostrarMas en false
          // Asigna una imagen aleatoria del arreglo
          Foto: this.getRandomImage()
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
  redirectToCuestionario() {
    this.router.navigate(['/rCuestionario']);
  }
}
