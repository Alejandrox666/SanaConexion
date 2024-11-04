import { Component, OnInit } from '@angular/core';
import { Especialistas, Usuarios } from 'src/app/models/models';
import { DatosEspService } from 'src/app/services/datos-esp.service';

@Component({
  selector: 'app-lista-esp',
  templateUrl: './lista-esp.component.html',
  styleUrls: ['./lista-esp.component.css']
})
export class ListaEspComponent implements OnInit{
  
  constructor(private datosEspService: DatosEspService,) {}

  especialistas: (Usuarios & Especialistas)[] = [];

  // Arreglo de imágenes
  imagenesEspecialistas = [
    'assets/casual.jpg',
    'assets/people.png',
  ];
  
  ngOnInit(): void {
    this.getEspecialistas();
  }

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

}
