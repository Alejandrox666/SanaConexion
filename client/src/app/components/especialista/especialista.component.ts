import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Usuarios } from 'src/app/models/models';
import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-especialista',
  templateUrl: './especialista.component.html',
  styleUrls: ['./especialista.component.css']
})
export class EspecialistaComponent implements OnInit, AfterViewInit {
  datosCargados = false;
  usuario : Usuarios = {} as Usuarios;

  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((usuario) => {
      if (usuario) {
        this.usuario = usuario;
        this.datosCargados = true;
      } else {
        console.error('No se encontró un usuario activo');
      }
    });
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
      const searchTermLower = this.searchTerm.trim().toLowerCase();
  
      // 🔹 Si el término coincide con alguno de los términos específicos, redirigir
      if (["mensajes", "mensajeria"].includes(searchTermLower)) {
        this.router.navigate(['/mensajeria']);
        return;
      } else if (searchTermLower === "expedientes") {
        this.router.navigate(['/expedientes']);
        return;
      } else if (["formularios", "mis formularios"].includes(searchTermLower)) {
        this.router.navigate(['/formularios']);
        return;
      }
  
      // 🔹 Si no es un término de redirección, aplicar búsqueda normal
      if (!this.searchTerm.trim()) {
        this.restoreOriginalText();
        return;
      }
  
      const regex = new RegExp(`(${this.escapeRegExp(this.searchTerm)})`, 'gi');
      this.matchIndexes = [];
  
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
       case 'expedientes':
       case 'mis expedientes':
         this.router.navigate(['/expedientes']);
         break;
       case 'mensajería':
       case 'mis mensajes':
         this.router.navigate(['/mensajeria']);
         break;
       case 'formularios':
        case 'mis formularios':
         this.router.navigate(['/formE']);
         break;
       default:
         alert('Página no encontrada');
     }
   
     this.searchTermRedirect = ''; // Limpiar después de redirigir
   }
   
   

  
   isButtonVisible: boolean = false;

   @HostListener('window:scroll', [])
   onScroll(): void {
     const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
     this.isButtonVisible = scrollPosition > window.innerHeight / 2; // Aparece cuando pasas la mitad de la página
 
     const button = document.getElementById('backToTop');
     if (button) {
       if (this.isButtonVisible) {
         button.classList.add('show');
       } else {
         button.classList.remove('show');
       }
     }
   }
 
   scrollToTop(): void {
     window.scrollTo({ top: 0, behavior: 'smooth' });
   }
}
