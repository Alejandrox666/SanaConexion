import { Component, OnInit } from '@angular/core';
import { DatosEspService } from 'src/app/services/datos-esp.service';// Ajusta la ruta según sea necesario
import { Usuarios,Especialistas } from 'src/app/models/models';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { YoutubeService } from 'src/app/services/youtube.service';

@Component({
  selector: 'app-vista-cliente',
  templateUrl: './vista-cliente.component.html',
  styleUrls: ['./vista-cliente.component.css']
})
export class VistaClienteComponent implements OnInit {

  videos: any[] | undefined; // Almacena los datos de los videos
  videoUrl: SafeResourceUrl; 

  especialistas: (Usuarios & Especialistas)[] = [];

  constructor(private datosEspService: DatosEspService, private youtubeService: YoutubeService, private sanitizer: DomSanitizer) { 
    this.videoUrl = '';
  }

  ngOnInit(): void {
    this.getEspecialistas();
     // Llama al servicio para obtener los videos
     this.youtubeService.getVideos().subscribe((data: any) => {
      this.videos = data.items;
    });

  }

  
  getEspecialistas(): void {
    this.datosEspService.getEsp().subscribe(
      (      data: any[]) => this.especialistas = data,
      (      error: any) => console.error('Error al obtener especialistas:', error)
    );
  }

  // Esta función crea una URL segura para el video
  getVideoUrl(videoId: string): SafeResourceUrl {
    if (videoId) {
      const url = `https://www.youtube.com/embed/${videoId}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
    return '';
  }

}
