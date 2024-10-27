import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Cuestionarios, Preguntas } from 'src/app/models/formularios';
import { Usuarios } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { FormularioService } from 'src/app/services/formulario.service';

@Component({
  selector: 'app-formularios',
  templateUrl: './formularios.component.html',
  styleUrls: ['./formularios.component.css']
})
export class FormulariosComponent implements OnInit {
  @Input() datosUsuario!: Usuarios;
  user: Usuarios = {} as Usuarios;

  form: FormGroup;

  cuestionario: Cuestionarios = {
    IdCuestionario: 0,
    IdEspecialista: 0,
    NomCuestionario: '',
    Descripcion: '',
    FechaCreacion: new Date()
  };

  constructor(private fb: FormBuilder, private formularioService: FormularioService,
    private authService: AuthService
  ) {
    this.form = this.fb.group({
      fields: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(
      (user) => {
        if (user) {
          this.user = user;
          this.authService.getEspecialistaByIdUsuario(this.user.IdUsuario).subscribe(
            (especialista) => {
              if (especialista) {
                this.cuestionario.IdEspecialista = especialista.IdEspecialista;
              } else {
                console.error('No se encontró el especialista.');
              }
            },
            (error) => {
              console.error('Error al obtener el especialista:', error);
            }
          );
        } else {
          console.error('No user is currently logged in.');
        }
      },
      (error) => {
        console.error('Failed to load user data:', error);
      }
    );
  }




  get fields() {
    return this.form.get('fields') as FormArray;
  }

  addTextField() {
    const textField = this.fb.group({
      type: 'text',
      question: ''
    });
    this.fields.push(textField);
  }

  removeField(index: number) {
    this.fields.removeAt(index);
  }

  getOptions(fieldIndex: number) {
    return this.fields.at(fieldIndex).get('options') as FormArray;
  }

  addMultipleChoiceField() {
    const multipleChoiceField = this.fb.group({
      type: 'multiple-choice',
      question: '',
      options: this.fb.array([]),
      answer: ''
    });
    this.fields.push(multipleChoiceField);
  }

  addOptionToField(fieldIndex: number) {
    const options = this.fields.at(fieldIndex).get('options') as FormArray;
    options.push(new FormControl(''));
  }

  saveForm() {
    const formValues = this.form.value;

    const fechaActual = new Date();
    this.cuestionario.FechaCreacion = fechaActual.toISOString().slice(0, 19).replace('T', ' ');

    this.formularioService.createForm(this.cuestionario).subscribe(response => {
      if (response && response.IdCuestionario) {
        const idCuestionario = response.IdCuestionario;

        formValues.fields.forEach((field: any) => {
          const pregunta: Preguntas = {
            IdPregunta: 0,
            IdCuestionario: idCuestionario,
            Pregunta: field.question
          };

          console.log("Pregunta a guardar:", pregunta); // Verifica cada pregunta aquí
          this.formularioService.createPre(pregunta).subscribe();
        });

        // Resetear el formulario
        this.form.reset();
        this.fields.clear();

        this.cuestionario = {
          IdCuestionario: 0,
          IdEspecialista: this.cuestionario.IdEspecialista,
          NomCuestionario: '',
          Descripcion: '',
          FechaCreacion: new Date()
        };

        alert('Formulario guardado exitosamente');
      } else {
        console.error('Error: No se pudo crear el cuestionario.');
      }
    }, error => {
      console.error('Error al intentar crear el cuestionario:', error);
    });
  }



}
