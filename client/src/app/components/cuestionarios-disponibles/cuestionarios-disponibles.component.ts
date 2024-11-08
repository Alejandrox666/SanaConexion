import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cuestionarios } from 'src/app/models/formularios';
import { FormularioService } from 'src/app/services/formulario.service';

@Component({
  selector: 'app-cuestionarios-disponibles',
  templateUrl: './cuestionarios-disponibles.component.html',
  styleUrls: ['./cuestionarios-disponibles.component.css']
})
export class CuestionariosDisponiblesComponent implements OnInit {
  cuestionariosget: Cuestionarios[] = [];

  constructor(
    private router: Router,
    private preguntaSrv: FormularioService
  ) {}

  ngOnInit(): void {
    this.preguntaSrv.getForm().subscribe(
      (res: Cuestionarios[]) => {
        this.cuestionariosget = res;
      },
      err => console.error(err)
    );
  }

  // Redirige a la página del cuestionario con el IdCuestionario
  redirectToCuestionario(IdCuestionario: number) {
    this.router.navigate(['/rCuestionario', IdCuestionario]);
  }
}