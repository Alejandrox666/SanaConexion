import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Especialistas, Usuarios } from 'src/app/models/models';
import { DatosEspService } from 'src/app/services/datos-esp.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-esp',
  templateUrl: './lista-esp.component.html',
  styleUrls: ['./lista-esp.component.css']
})
export class ListaEspComponent implements OnInit,AfterViewInit{
  
  constructor(private datosEspService: DatosEspService,private router:Router) {}

  especialistas: (Usuarios & Especialistas)[] = [];
  
  ngOnInit(): void {
    this.getEspecialistas();
  }

  getEspecialistas(): void {
    this.datosEspService.getEsp().subscribe(
      (data: any[]) => {
        this.especialistas = data.map((especialista) => ({
          ...especialista,
          mostrarMas: false,
        }));
      },
      (error: any) => console.error('Error al obtener especialistas:', error)
    );
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
        case 'mensajeria':
        case 'mensajes':
          this.router.navigate(['/mensajeria']);
          break;
        case 'home':
          this.router.navigate(['/vistaClient']);
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
