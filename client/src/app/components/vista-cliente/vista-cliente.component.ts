import { Component, OnInit } from '@angular/core';
import { DatosEspService } from 'src/app/services/datos-esp.service';// Ajusta la ruta según sea necesario
import { Usuarios,Especialistas } from 'src/app/models/models';

@Component({
  selector: 'app-vista-cliente',
  templateUrl: './vista-cliente.component.html',
  styleUrls: ['./vista-cliente.component.css']
})
export class VistaClienteComponent implements OnInit {
  especialistas: (Usuarios & Especialistas)[] = [];

  constructor(private datosEspService: DatosEspService) { }

  ngOnInit(): void {
    this.getEspecialistas();
  }

  getEspecialistas(): void {
    this.datosEspService.getEsp().subscribe(
      (      data: any[]) => this.especialistas = data,
      (      error: any) => console.error('Error al obtener especialistas:', error)
    );
  }
}
