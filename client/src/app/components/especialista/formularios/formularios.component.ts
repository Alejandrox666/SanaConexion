import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-formularios',
  templateUrl: './formularios.component.html',
  styleUrls: ['./formularios.component.css']
})
export class FormulariosComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fields: this.fb.array([])  // Aquí están las preguntas del formulario
    });
  }

  // Obtener las preguntas
  get fields() {
    return this.form.get('fields') as FormArray;
  }

  // Añadir una nueva pregunta de texto abierta
  addTextField() {
    const textField = this.fb.group({
      type: 'text',  // Identifica el tipo de pregunta como texto
      question: '',
      answer: ''
    });
    this.fields.push(textField);
  }

  // Añadir una nueva pregunta de opción múltiple
  addMultipleChoiceField() {
    const multipleChoiceField = this.fb.group({
      type: 'multiple-choice',  // Tipo de pregunta: opción múltiple
      question: '',
      options: this.fb.array([]),  // Opciones de la pregunta
      answer: ''
    });
    this.fields.push(multipleChoiceField);
  }

  // Añadir una opción a una pregunta de opción múltiple
  addOptionToField(fieldIndex: number) {
    const options = this.fields.at(fieldIndex).get('options') as FormArray;
    options.push(new FormControl(''));
  }

  // Remover una pregunta
  removeField(index: number) {
    this.fields.removeAt(index);
  }

  // Obtener las opciones de una pregunta de opción múltiple
  getOptions(fieldIndex: number) {
    return this.fields.at(fieldIndex).get('options') as FormArray;
  }
}
