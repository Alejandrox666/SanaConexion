import { Component, OnInit , Inject, AfterViewInit, ViewChild, ElementRef} from '@angular/core';
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


    searchTerm: string = ''; 
    @ViewChild('contentContainer', { static: false }) contentContainer!: ElementRef;
  
    originalNodes: { element: HTMLElement, originalText: string }[] = []; 
    matchIndexes: HTMLElement[] = [];
    currentMatchIndex: number = -1;
ngAfterViewInit() {
  this.saveOriginalText();
}

saveOriginalText() {
  this.originalNodes = [];
  const elements = this.contentContainer.nativeElement.querySelectorAll('*:not(script):not(style)');
  
  elements.forEach((element: Element) => {
    const textNodes = Array.from(element.childNodes).filter(node => node.nodeType === 3); // Solo nodos de texto
    
    if (textNodes.length > 0) {
      // Guardar solo el texto limpio sin etiquetas HTML
      this.originalNodes.push({ 
        element: element as HTMLElement, 
        originalText: element.textContent || ''  // Asegurarse de guardar solo el texto
      });
    }
  });
}



searchContent() {
  if (!this.searchTerm.trim()) {
    this.restoreOriginalText();
    return;
  }

  const regex = new RegExp(`(${this.escapeRegExp(this.searchTerm)})`, 'gi');
  this.matchIndexes = [];

  // Reemplazar el contenido original con el texto resaltado
  this.originalNodes.forEach(({ element, originalText }) => {
    element.innerHTML = originalText.replace(regex, '<mark>$1</mark>');
  });

  setTimeout(() => {
    this.matchIndexes = Array.from(this.contentContainer.nativeElement.querySelectorAll('mark')) as HTMLElement[];
    this.currentMatchIndex = -1;
  });
}

navigateResults(forward: boolean) {
  if (this.matchIndexes.length === 0) return;

  if (forward) {
    this.currentMatchIndex = (this.currentMatchIndex + 1) % this.matchIndexes.length;
  } else {
    this.currentMatchIndex = (this.currentMatchIndex - 1 + this.matchIndexes.length) % this.matchIndexes.length;
  }

  this.matchIndexes[this.currentMatchIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
}

restoreOriginalText() {
  this.originalNodes.forEach(({ element, originalText }) => {
    // Asegurarse de que solo se restaure el texto sin etiquetas HTML
    element.innerHTML = originalText;
  });
  this.matchIndexes = [];
}


escapeRegExp(text: string) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

searchTermRedirect: string = '';

 
// 🟠 Buscador 2: Redirigir a una página
redirectToPage() {
  const term = this.searchTermRedirect.toLowerCase().trim(); // Normaliza el texto
  
  switch (term) {
    case 'mensajería':
    case 'mensajes':
      this.router.navigate(['/mensajeria']);
      break;
    case 'expedientes':
    case 'mis expedientes':
      this.router.navigate(['/expedientes']);
      break;
    case 'cuestionarios':
    case 'mis cuestionarios':
      this.router.navigate(['/cuestionarios-disponibles']);
      break;
    default:
      alert('Página no encontrada');
  }

  this.searchTermRedirect = ''; // Limpiar después de redirigir
}




}
