import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EnvioForm } from 'src/app/models/chats';
import { Cuestionarios } from 'src/app/models/formularios';
import { Usuarios } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { FormularioService } from 'src/app/services/formulario.service';

@Component({
  selector: 'app-cuestionarios-disponibles',
  templateUrl: './cuestionarios-disponibles.component.html',
  styleUrls: ['./cuestionarios-disponibles.component.css']
})
export class CuestionariosDisponiblesComponent implements OnInit, AfterViewInit {
  cuestionariosget: Cuestionarios[] = [];
  envios: EnvioForm[] = [];

  userLoger: any;
  user: Usuarios = {} as Usuarios;

  constructor(
    private router: Router,
    private preguntaSrv: FormularioService,
    private chatS: ChatService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user) => {
        if (user) {
          this.user = user;
          this.userLoger = user;
          this.getCuestionarios();
        } else {
          console.error('No user is currently logged in.');
        }
      },
      (error) => {
        console.error('Failed to load user data:', error);
      }
    );
  }

  getCuestionarios() {
    this.preguntaSrv.getForm().subscribe(
      (res: Cuestionarios[]) => {
        this.cuestionariosget = res;
        this.getEstatusForm();
      },
      err => console.error(err)
    );
  }

  getEstatusForm() {
    this.chatS.getEnvioForm().subscribe((cues: EnvioForm[]) => {
      this.envios = cues;

      this.cuestionariosget = this.cuestionariosget
        .map(cuestionario => {
          const envio = this.envios.find(envio =>
            envio.IdCuestionario === cuestionario.IdCuestionario &&
            envio.IdUsuario === this.userLoger.IdUsuario &&
            envio.EstadoEnvio !== 'Respondido'
          );
          if (envio) {
            cuestionario.IdEnvio = envio.IdEnvio;
          } else {
            cuestionario.IdEnvio = -1;
          }

          return cuestionario;
        })
        .filter(cuestionario => cuestionario.IdEnvio !== -1);
    });
  }


  redirectToCuestionario(IdCuestionario: number, IdEspecialista: number, IdEnvio: number) {
    this.router.navigate(['/ruta-del-nuevo-componente', IdCuestionario, IdEspecialista, IdEnvio]);
  }



  searchTerm: string = ''; 
      @ViewChild('contentContainer', { static: false }) contentContainer!: ElementRef;
      
      originalNodes: { element: HTMLElement, originalText: string }[] = []; 
      matchIndexes: HTMLElement[] = [];
      currentMatchIndex: number = -1;
      
      ngAfterViewInit() {
        this.saveOriginalText();
      }
      
      ngAfterViewChecked() {
        this.saveOriginalText();
      }
      
      
      // Método que guarda los textos originales de los elementos
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
      
      // Método que realiza la búsqueda en el texto
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
          // Aquí también estamos obteniendo los nuevos elementos dinámicamente
          this.matchIndexes = Array.from(this.contentContainer.nativeElement.querySelectorAll('mark')) as HTMLElement[];
          this.currentMatchIndex = -1;
        });
      }
      
      // Navegar entre los resultados de la búsqueda
      navigateResults(forward: boolean) {
        if (this.matchIndexes.length === 0) return;
      
        if (forward) {
          this.currentMatchIndex = (this.currentMatchIndex + 1) % this.matchIndexes.length;
        } else {
          this.currentMatchIndex = (this.currentMatchIndex - 1 + this.matchIndexes.length) % this.matchIndexes.length;
        }
      
        this.matchIndexes[this.currentMatchIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      // Restaurar el texto original cuando no haya término de búsqueda
      restoreOriginalText() {
        this.originalNodes.forEach(({ element, originalText }) => {
          element.innerHTML = originalText;
        });
        this.matchIndexes = [];
      }
      
      // Escapar caracteres especiales en el texto de búsqueda
      escapeRegExp(text: string) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      }



      searchTermRedirect: string = '';

 // 🟠 Buscador 2: Redirigir a una página
redirectToPage() {
  const term = this.searchTermRedirect.toLowerCase().trim(); // Normaliza el texto
  
  switch (term) {
    case 'especialistas':
    case 'mis especialistas':
      this.router.navigate(['/lista-especialistas']);
      break;
    case 'mensajeria':
    case 'mensajes':
      this.router.navigate(['/mensajeria']);
      break;
    case 'home':
      this.router.navigate(['/vistaClient']);
      break;
    default:
      alert('Página no encontrada');
  }

  this.searchTermRedirect = ''; // Limpiar después de redirigir
}


}
