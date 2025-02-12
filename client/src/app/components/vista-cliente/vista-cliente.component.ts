import { Component, OnInit , Inject} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormularioService } from 'src/app/services/formulario.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { VideoAdapter } from 'src/app/adapters/video-adapter.interface'; // Usa la interfaz VideoAdapter
import { Cuestionarios } from 'src/app/models/formularios';
import { Clientes } from 'src/app/models/clientes';
import { VIDEO_ADAPTER_TOKEN } from 'src/app/adapters/video-adapter.token'; // Token de inyección


@Component({
  selector: 'app-vista-cliente',
  templateUrl: './vista-cliente.component.html',
  styleUrls: ['./vista-cliente.component.css']
})
export class VistaClienteComponent implements OnInit {
  cuestionariosget: Cuestionarios[] = [];
  videos: any[] | undefined; // Almacena los datos de los videos
  videoUrl: SafeResourceUrl;
  IdCliente!: number;
  usuarioTemporal: any;
  objSalud: string | undefined;

  constructor(
    private sanitizer: DomSanitizer,
    private router: Router,
    private preguntaSrv: FormularioService,
    private clienteService: ClientesService,
    @Inject(VIDEO_ADAPTER_TOKEN) private videoAdapter: VideoAdapter 
  ) {
    this.videoUrl = ''; // Inicializa videoUrl
  }

  ngOnInit(): void {
    this.usuarioTemporal = this.clienteService.getUsuarioTemporal();

    // Llama a getIdClienteByIdUser y luego al Adapter
    this.getIdClienteByIdUser(this.usuarioTemporal.IdUsuario);
  }

  // Obtiene el ID del cliente a partir del ID del usuario
  getIdClienteByIdUser(IdUsuario: number): void {
    this.clienteService.getClienteByIdUsuario(IdUsuario).subscribe(
      (res: Clientes) => {
        this.IdCliente = res.IdCliente;
        this.objSalud = res.ObjetivoSalud;

        // Usa el Adapter para obtener los videos
        const query = this.objSalud || 'Mejora tú alimentación';
        this.videoAdapter.getVideos(query).subscribe(
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

    // Método para generar URLs seguras para iframes
    getVideoUrl(videoId: string): SafeResourceUrl {
      const url = `https://www.youtube.com/embed/${videoId}`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
