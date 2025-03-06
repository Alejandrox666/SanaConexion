import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit,OnInit {
  isLoggedIn: boolean = false;
 
  constructor(
    private modal: NgbModal,
    private authService: AuthService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();}


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
      if (element.childNodes.length === 1 && element.childNodes[0].nodeType === 3) { 
        this.originalNodes.push({ element: element as HTMLElement, originalText: element.textContent || '' });
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
      element.textContent = originalText;
    });
    this.matchIndexes = [];
  }

  escapeRegExp(text: string) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  }

  searchTermRedirect: string = '';

 
  // 🟠 Buscador 2: Redirigir a una página
  redirectToPage() {
    if (!this.searchTermRedirect.trim()) return;

    const term = this.searchTermRedirect.toLowerCase().trim(); // Normaliza el texto





    if (term === 'mensajeria') {
      this.router.navigate(['/mensajeria']);
    } else if (term === 'especialistas') {
      this.router.navigate(['/lista-especialistas']);
    } else if (term === 'cuestionarios' || term === 'mis cuestionarios') {
      this.router.navigate(['/cuestionarios-disponibles']);
    } else {
      alert('Página no encontrada');
    }

    this.searchTermRedirect = ''; // Limpiar después de redirigir
  }
}
