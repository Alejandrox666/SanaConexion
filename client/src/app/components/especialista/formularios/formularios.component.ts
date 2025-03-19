import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { forkJoin, map } from 'rxjs';
import { Chats, EnvioForm, Mensajes, Participantes } from 'src/app/models/chats';
import { Clientes } from 'src/app/models/clientes';
import { Cuestionarios, Preguntas } from 'src/app/models/formularios';
import { Usuarios } from 'src/app/models/models';
import { AuthService } from 'src/app/services/auth.service';
import { ChatService } from 'src/app/services/chat.service';
import { ClientesService } from 'src/app/services/clientes.service';
import { FormularioService } from 'src/app/services/formulario.service';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-formularios',
  templateUrl: './formularios.component.html',
  styleUrls: ['./formularios.component.css']
})
export class FormulariosComponent implements OnInit,AfterViewInit {
  @Input() datosUsuario!: Usuarios;
  user: Usuarios = {} as Usuarios;
  cuestionarios: (Cuestionarios & { mostrarPreguntas: boolean })[] = [];
  preguntas: Preguntas[] = [];
  envios: EnvioForm[] = []
  clientes: Clientes[] = [];
  chats: Chats[] = []
  participantes: Participantes[] = []
  mensajes: Mensajes[] = [];
  usuarios: Usuarios[] = [];

  userLoger: any;
  mostrarModal = false;

  selectedCuestionario: Cuestionarios | null = null;
  selectedPregunta: Preguntas | null = null;
  formularioEnEdicion: number | null = null;

  clienteSeleccionado: number = 0;
  formSeleccionado: number = 0;

  form: FormGroup;
  editForm: FormGroup;
  editPre: FormGroup;
  addsPre: FormGroup;

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
    private authService: AuthService, private chatSer: ChatService, private clienteService: ClientesService,
    private chatService: ChatService,private cdr: ChangeDetectorRef,private router: Router
  ) {
    this.editForm = this.fb.group({
      NomCuestionario: ['', Validators.required],
      Descripcion: ['', Validators.required]
    });

    this.editPre = this.fb.group({
      Pregunta: ['', Validators.required]
    });

    this.addsPre = this.fb.group({
      Pregunta: ['', Validators.required]
    });

    this.form = this.fb.group({
      fields: this.fb.array([], Validators.required)
    });
  }

  ngOnInit(): void {
    this.getChats()
    this.getForm()
    this.getClientes()
    this.authService.getCurrentUser().subscribe(
      (user) => {
        if (user) {
          this.user = user;
          this.userLoger = user;
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
        this.cuestionarios = cuestionariosResponse
          .filter(cuestionario => cuestionario.IdEspecialista === this.cuestionario.IdEspecialista)
          .map(cuestionario => ({
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
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este formulario?');
    if (confirmacion) {
      this.formularioService.deleteForm(id).subscribe(() => {
        this.cuestionarios = this.cuestionarios.filter(c => c.IdCuestionario !== id);
        alert('Formulario eliminado con éxito');
      }, error => {
        alert('Error al eliminar el formulario');
      });
    }
  }


  //Preguntas

  addPregunta(IdCuestionario: number) {
    this.addPre[IdCuestionario] = true
  }

  savePre(IdCuestionario: number) {
    if (this.addsPre.valid) {
      const savPre: Preguntas = {
        IdPregunta: 0,
        IdCuestionario: IdCuestionario,
        Pregunta: this.addsPre.value.Pregunta
      }

      this.formularioService.createPre(savPre).subscribe(
        () => { this.getForm(); }
      );
      this.addPre[IdCuestionario] = false
      this.selectedPregunta = null;
      this.addsPre.reset();
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
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar esta pregunta?');

    if (confirmacion) {
      this.formularioService.deletePre(idPregunta).subscribe(() => {
        this.preguntas = this.preguntas.filter(c => c.IdCuestionario !== idPregunta);
        this.getFormNoUpdate()
        alert('Pregunta eliminada con éxito');
      }, error => {
        alert('Error al eliminar el formulario');
      });
    }

  }

  togglePreguntas(index: number) {
    this.cuestionarios[index].mostrarPreguntas = !this.cuestionarios[index].mostrarPreguntas;
  }

  //Envios
  getChats() {
    this.chatService.getChats().subscribe((chatsResponse: Chats[]) => {
      this.chats = chatsResponse;

      this.chatService.getParticipantes().subscribe((participantesResponse: Participantes[]) => {
        this.chats.forEach(chat => {
          chat.participantes = participantesResponse.filter(p => p.IdChat === chat.IdChat);

          const idsUsuarios = chat.participantes
            .map(p => p.IdUsuario)
            .filter(id => id !== this.userLoger.IdUsuario);  // Excluye al usuario logueado

          const observables = idsUsuarios.map(id => this.chatService.getUsuariosById(id));

          forkJoin(observables).pipe(
            map(usuariosResponse => usuariosResponse.flat())
          ).subscribe((usuariosResponse: Usuarios[]) => {
            chat.participantes?.forEach(participante => {
              const usuario = usuariosResponse.find(u => u.IdUsuario === participante.IdUsuario);
              if (usuario) {
                participante.Nombre = usuario.NombreCompleto;
              }
            });

            this.clientes.forEach(cliente => {
              const clienteChat = chat.participantes?.find(p => p.IdUsuario === cliente.IdUsuario);
              if (clienteChat) {
                cliente.chatActivo = chat.Estado === 'Activo';
                cliente.mostrar = chat.mostrar || false;

                if (this.userLoger.tipoUsuario === 'Especialista') {
                  chat.msj = [];
                  this.chatService.getMensajesPorChat(chat.IdChat).subscribe((mensajesResponse: Mensajes[]) => {
                    chat.msj = mensajesResponse;

                    const clienteHaEnviadoMensaje = mensajesResponse.some(mensaje => mensaje.IdEmisor !== this.userLoger.IdUsuario);

                    if (!clienteHaEnviadoMensaje) {
                      cliente.mostrar = false;
                    } else {
                      cliente.mostrar = true;
                    }
                  });
                }
              }
            });


          });
        });
      });
    });
  }

  getClientes(): void {
    this.clienteService.getClientes().subscribe(
      (clientesResponse: Clientes[]) => {
        this.clientes = clientesResponse;
        const idsUsuarios = this.clientes.map(cliente => cliente.IdUsuario);

        if (idsUsuarios.length > 0) {
          const observables = idsUsuarios.map(id => this.chatService.getUsuariosById(id));
          forkJoin(observables).pipe(
            map(usuariosResponse => usuariosResponse.flat())
          ).subscribe((usuarios: Usuarios[]) => {
            this.usuarios = usuarios;

            this.clientes.forEach(cliente => {
              const usuario = usuarios.find(u => u.IdUsuario === cliente.IdUsuario);
              if (usuario) {
                cliente.Nombre = usuario.NombreCompleto;
              }
            });
          });
        }
      },
      (error) => console.error('Error al obtener clientes:', error)
    );
  }

  abrirModal(IdCuestionario: number) {
    this.formSeleccionado = IdCuestionario;
    this.mostrarModal = true;
  }


  cerrarModal(event: Event) {
    event.stopPropagation();
    this.mostrarModal = false;
    this.clienteSeleccionado = 0;
    this.formSeleccionado = 0;
  }

  seleccionarCliente(IdUsuario: number, event: Event) {
    event.stopPropagation();
    this.clienteSeleccionado = IdUsuario;
  }


  enviarFormulario() {
    if (this.clienteSeleccionado !== 0) {
      const envio: EnvioForm = {
        IdEnvio: 0,
        IdCuestionario: this.formSeleccionado,
        IdUsuario: this.clienteSeleccionado,
        FechaEnvio: new Date().toISOString().slice(0, 19).replace('T', ' '),
        EstadoEnvio: 'Enviado'
      };

      this.chatSer.enviarFormulario(envio)
        .subscribe(
          response => {
            this.clienteSeleccionado = 0;
            this.formSeleccionado = 0;
            this.mostrarModal = false;
            alert('Formulario enviado con éxito');
          },
          error => {
            console.error('Error al enviar el formulario:', error);
          }
        );
    } else {
      alert('Por favor, selecciona un cliente antes de enviar el formulario.');
    }
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
     case 'expedientes':
     case 'mis expedientes':
       this.router.navigate(['expedientes']);
       break;
     case 'mensajería':
     case 'mis mensajes':
       this.router.navigate(['/mensajeria']);
       break;
     case 'home':
       this.router.navigate(['/inicioE']);
       break;
     default:
       alert('Página no encontrada');
   }
 
   this.searchTermRedirect = ''; // Limpiar después de redirigir
 }
 
 
  

}
