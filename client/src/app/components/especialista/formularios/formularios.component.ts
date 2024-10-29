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
  cuestionarios: (Cuestionarios & { mostrarPreguntas: boolean })[] = [];
  preguntas: Preguntas[] = [];

  selectedCuestionario: Cuestionarios | null = null;
  selectedPregunta: Preguntas | null = null;

  form: FormGroup;
  editForm: FormGroup;
  editPre: FormGroup;

  enEdicion = false
  enEdicionPre = false

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
      NomCuestionario: [''],
      Descripcion: ['']
    });

    this.editPre = this.fb.group({
      Pregunta: ['']
    });

    this.form = this.fb.group({
      fields: this.fb.array([])
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



  getPre() {
    this.formularioService.getPre().subscribe(response => {
      this.preguntas = response
    })
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
    this.enEdicion = true
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
      this.enEdicion = false;
      this.selectedCuestionario = null;
      this.editForm.reset();
    }
  }

  cancelEditForm() {
    this.enEdicion = false;
    this.selectedCuestionario = null;
    this.editForm.reset();
  }

  deleteForm(id: number) {
    this.formularioService.deleteForm(id).subscribe(() => {
      this.cuestionarios = this.cuestionarios.filter(c => c.IdCuestionario !== id);
    });
  }

  // savePre(cuestionario: Cuestionarios) {
  //   // Lógica para agregar una nueva pregunta a un cuestionario
  //   const nuevaPregunta: Preguntas = {
  //     IdPregunta: 0, // Asignar un ID apropiado, puede ser autoincremental en el backend
  //     Pregunta: "Nueva pregunta" // Aquí puedes abrir un modal o un formulario para que el usuario ingrese la pregunta
  //   };

  //   // Asegúrate de que el nuevo objeto se guarde en la base de datos
  //   this.formularioService.addPregunta(cuestionario.IdCuestionario, nuevaPregunta).subscribe((respuesta) => {
  //     cuestionario.preguntas.push(respuesta); // Agregar la pregunta a la lista
  //   });
  // }

  editPreguntas(pregunta: Preguntas) {
    this.enEdicionPre = true
    this.selectedPregunta = pregunta;
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
        },
        error => {
          console.error('Error al actualizar el formulario', error);
        }
      );
      this.enEdicionPre = false
      this.selectedPregunta = null;
      this.editForm.reset();
    }
  }

  cancelEditPre() {
    this.enEdicionPre = false
    this.selectedPregunta = null;
    this.editForm.reset();
  }

  deletePregunta(idPregunta: number) {
    console.log(idPregunta)
    this.formularioService.deletePre(idPregunta).subscribe(() => {
      this.preguntas = this.preguntas.filter(c => c.IdCuestionario !== idPregunta);
      this.getForm()
    });
  }

  togglePreguntas(index: number) {
    this.cuestionarios[index].mostrarPreguntas = !this.cuestionarios[index].mostrarPreguntas;
  }

}
