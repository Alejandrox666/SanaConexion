import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  cuestionarios: (Cuestionarios & { mostrarPreguntas: boolean })[] = [];
  preguntas: Preguntas[] = [];

  selectedCuestionario: Cuestionarios | null = null;
  selectedPregunta: Preguntas | null = null;
  formularioEnEdicion: number | null = null;

  form: FormGroup;
  editForm: FormGroup;
  editPre: FormGroup;

  enEdicion: { [key: number]: boolean } = {};
  enEdicionPre: { [key: number]: boolean } = {};
  addPre: { [key: number]: boolean } = {};

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
    this.editForm = this.fb.group({
      NomCuestionario: ['', Validators.required],
      Descripcion: ['', Validators.required]
    });

    this.editPre = this.fb.group({
      Pregunta: ['', Validators.required]
    });

    this.form = this.fb.group({
      fields: this.fb.array([], Validators.required)
    });
  }

  ngOnInit(): void {
    this.getForm()
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

  //Formularios

  get fields() {
    return this.form.get('fields') as FormArray;
  }

  addTextField() {
    const textField = this.fb.group({
        type: 'text',
        question: ['', Validators.required]
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

  //Cuestionarios

  getForm() {
    this.formularioService.getForm().subscribe((cuestionariosResponse: Cuestionarios[]) => {
      this.formularioService.getPre().subscribe((preguntasResponse: Preguntas[]) => {
        this.cuestionarios = cuestionariosResponse.map(cuestionario => ({
          ...cuestionario,
          preguntas: preguntasResponse.filter(p => p.IdCuestionario === cuestionario.IdCuestionario),
          mostrarPreguntas: false,
        }));
      });
    });
  }

  getFormNoUpdate() {
    this.formularioService.getForm().subscribe((cuestionariosResponse: Cuestionarios[]) => {
      this.formularioService.getPre().subscribe((preguntasResponse: Preguntas[]) => {
        this.cuestionarios = cuestionariosResponse.map(cuestionario => ({
          ...cuestionario,
          preguntas: preguntasResponse.filter(p => p.IdCuestionario === cuestionario.IdCuestionario),
          mostrarPreguntas: true,
        }));
      });
    });
  }

  saveForm() {

    if (this.form.invalid || !this.cuestionario.NomCuestionario || !this.cuestionario.Descripcion) {
      alert('Por favor, completa todos los campos requeridos.');
      return;
  }
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

          this.formularioService.createPre(pregunta).subscribe();
        });
        this.getForm()
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

  editCuestionario(cuestionario: Cuestionarios) {
    console.log('Editando cuestionario:', cuestionario);
    this.enEdicion[cuestionario.IdCuestionario] = true;
    console.log(this.enEdicion);
    this.selectedCuestionario = cuestionario;
    this.editForm.patchValue({
      NomCuestionario: cuestionario.NomCuestionario,
      Descripcion: cuestionario.Descripcion
    });
  }


  saveChanges(IdCuestionario: number) {
    if (this.selectedCuestionario) {

      const fechaActual = new Date();
      this.selectedCuestionario.FechaCreacion = fechaActual.toISOString().slice(0, 19).replace('T', ' ');

      const formSave: Cuestionarios = {
        IdCuestionario: IdCuestionario,
        IdEspecialista: this.selectedCuestionario.IdEspecialista,
        NomCuestionario: this.editForm.value.NomCuestionario,
        Descripcion: this.editForm.value.Descripcion,
        FechaCreacion: this.selectedCuestionario.FechaCreacion,
      };
      this.formularioService.updateForm(IdCuestionario, formSave).subscribe(
        response => {
          this.getForm()
        },
        error => {
          console.error('Error al actualizar el formulario', error);
        }
      );
      this.enEdicion[IdCuestionario] = false;
      this.selectedCuestionario = null;
      this.editForm.reset();
    }
  }


  cancelEditForm(IdCuestionario: number) {
    this.enEdicion[IdCuestionario] = false;
    this.selectedCuestionario = null;
    this.editForm.reset();
  }

  deleteForm(id: number) {
    this.formularioService.deleteForm(id).subscribe(() => {
      this.cuestionarios = this.cuestionarios.filter(c => c.IdCuestionario !== id);
    });
  }

  //Preguntas

  addPregunta(IdCuestionario: number) {
    this.addPre[IdCuestionario] = true
  }

  savePre(IdCuestionario: number) {
    if (this.editPre.valid) {
      const savPre: Preguntas = {
        IdPregunta: 0,
        IdCuestionario: IdCuestionario,
        Pregunta: this.editPre.value.Pregunta
      }

      this.formularioService.createPre(savPre).subscribe(
        () => { this.getForm(); }
      );
      this.addPre[IdCuestionario] = false
      this.selectedPregunta = null;
      this.editPre.reset();
    }
  }

  cancelAddPre(IdCuestionario: number) {
    this.addPre[IdCuestionario] = false
    this.selectedPregunta = null;
    this.editForm.reset();
  }

  editPreguntas(pregunta: Preguntas) {
    this.selectedPregunta = pregunta;
    this.enEdicionPre[pregunta.IdPregunta] = true;
    this.editPre = this.fb.group({
      Pregunta: [pregunta.Pregunta || '', Validators.required]
    });
    this.editPre.patchValue({
      pregunta: pregunta.Pregunta
    });
  }

  saveChangePre(IdPregunta: number) {
    if (this.selectedPregunta) {

      const formPre: Preguntas = {
        IdPregunta: IdPregunta,
        IdCuestionario: this.selectedPregunta.IdCuestionario,
        Pregunta: this.editPre.value.Pregunta

      };
      this.formularioService.updatePre(IdPregunta, formPre).subscribe(
        response => {
          this.getForm()
          this.enEdicionPre[IdPregunta] = false;
          this.selectedPregunta = null;
          this.editPre.reset();
        },
        error => {
          console.error('Error al actualizar el formulario', error);
        }
      );
    }
  }

  cancelEditPre(IdPregunta: number) {
    this.enEdicionPre[IdPregunta] = false;
    this.selectedPregunta = null;
    this.editForm.reset();
  }

  deletePregunta(idPregunta: number) {
    console.log(idPregunta)
    this.formularioService.deletePre(idPregunta).subscribe(() => {
      this.preguntas = this.preguntas.filter(c => c.IdCuestionario !== idPregunta);
      this.getFormNoUpdate()
    });
  }

  togglePreguntas(index: number) {
    this.cuestionarios[index].mostrarPreguntas = !this.cuestionarios[index].mostrarPreguntas;
  }

}
