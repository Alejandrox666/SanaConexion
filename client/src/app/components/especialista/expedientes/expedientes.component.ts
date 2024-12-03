import { Component, Inject, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { IRespuestaService, RESPUESTA_SERVICE_TOKEN } from 'src/app/adapters/respuesta-adapter.interface';
import { EnvioForm } from 'src/app/models/chats';
import { Cuestionarios, Preguntas } from 'src/app/models/formularios';
import { Usuarios } from 'src/app/models/models';
import { ChatService } from 'src/app/services/chat.service';
import { FormularioService } from 'src/app/services/formulario.service';
import { RespuestasService } from 'src/app/services/respuestas.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: any;
    lastAutoTable: any;
  }
}

@Component({
  selector: 'app-expedientes',
  templateUrl: './expedientes.component.html',
  styleUrls: ['./expedientes.component.css']
})
export class ExpedientesComponent implements OnInit {
  enviosget: EnvioForm[] = [];
  usuariosget: Usuarios[] = [];
  cuestionariosget: Cuestionarios[] = [];
  preguntasget: Preguntas[] = [];
  filteredEnvios: EnvioForm[] = [];

  // Se inyecta la interfaz en lugar del servicio concreto
  constructor(
    private chatSrv: ChatService,
    private usuariosServ: UsuariosService,
    private formularioSrv: FormularioService,
    private respuestasSrv: RespuestasService,
    @Inject(RESPUESTA_SERVICE_TOKEN) private respuestaAdapter: IRespuestaService
  ) {}

  ngOnInit(): void {
    this.formularioSrv.getForm().subscribe(
      (res: Cuestionarios[]) => {
        this.cuestionariosget = res;
      },
      err => console.error('Error al obtener cuestionarios:', err)
    );

    this.formularioSrv.getPre().subscribe(
      (res: Preguntas[]) => {
        this.preguntasget = res;
      },
      err => console.error('Error al obtener preguntas:', err)
    );

    this.chatSrv.getEnvioForm().subscribe(
      (res: EnvioForm[]) => {
        this.enviosget = res;
        this.filterEnviosByUsuario();
      },
      err => console.error(err)
    );

    this.usuariosServ.getuser().subscribe(
      (res: Usuarios[]) => {
        this.usuariosget = res;
        this.filterEnviosByUsuario();
      }
    );
  }

  filterEnviosByUsuario(): void {
    if (this.enviosget.length && this.usuariosget.length) {
      const uniqueEnviosMap = new Map<number, EnvioForm>();
      this.enviosget.forEach(envio => {
        if (envio.IdUsuario !== undefined && !uniqueEnviosMap.has(envio.IdUsuario)) {
          uniqueEnviosMap.set(envio.IdUsuario, envio);
        }
      });
      this.filteredEnvios = Array.from(uniqueEnviosMap.values());
    }
  }

  filterAndDownloadPDF(idUsuario: number): void {
    // Usamos la interfaz para interactuar con el servicio
    this.respuestaAdapter.obtenerRespuestasFiltradasPorUsuario(idUsuario).subscribe(respuestas => {

      this.respuestasSrv.getIdClienteByIdUser(idUsuario).subscribe(cliente => {
        if (!cliente) {
          console.error('No se encontró un cliente asociado al usuario.');
          return;
        }

        const formulariosDelUsuario = this.enviosget.filter(envio => envio.IdUsuario === idUsuario);
        const idsCuestionarios = formulariosDelUsuario.map(envio => envio.IdCuestionario);
        const preguntasFiltradas = this.preguntasget.filter(pregunta =>
          idsCuestionarios.includes(pregunta.IdCuestionario)
        );

        this.generatePDF(cliente, formulariosDelUsuario, preguntasFiltradas, respuestas);
      });
    });
  }

  generatePDF(cliente: any, formularios: any[], preguntas: any[], respuestas: any[]): void {
    const doc = new jsPDF();
    const margin = 20; // Margen superior
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    let yPosition = margin + 25; // Empieza después del título con espacio

    // Información del usuario (fuera de la función addContent para que sea accesible en todo el código)
    const usuario = this.usuariosget.find(u => u.IdUsuario === cliente.IdUsuario);

    // Función para agregar el encabezado en la esquina superior derecha (fuera de márgenes)
    const addHeader = () => {
      const headerText = "SanaConexión. Conexion directa con expertos en bienestar";
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100); // Gris para el texto
      doc.text(headerText, pageWidth - margin - doc.getTextWidth(headerText), margin + 10);
    };

    // Función para agregar contenido en cada página
    const addContent = () => {
      // Título del documento centrado
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);  // Color negro para el título
      const title = 'Expediente del Cliente';
      const titleWidth = doc.getTextWidth(title);
      doc.text(title, (pageWidth - titleWidth) / 2, yPosition); // Centrado
      yPosition += 30;  // Ajusta el espacio después del título

      // Información del usuario y cliente en formato de tabla
      const clientInfo = [
        { label: 'Nombre', value: usuario?.NombreCompleto || 'No disponible' },
        { label: 'Teléfono', value: usuario?.Telefono || 'No disponible' },
        { label: 'Email', value: usuario?.Email || 'No disponible' },
        { label: 'Edad', value: cliente?.Edad ? `${cliente.Edad} años` : 'No disponible' },
        { label: 'Sexo', value: cliente?.Sexo || 'No disponible' },
        { label: 'Peso', value: cliente?.Peso ? `${cliente.Peso} kg` : 'No disponible' },
        { label: 'Estatura', value: cliente?.Estatura ? `${cliente.Estatura} metros` : 'No disponible' },
        { label: 'Enfermedades Crónicas', value: cliente?.EnfCronicas || 'No disponible' },
        { label: 'Alergias', value: cliente?.Alergias || 'No disponible' },
        { label: 'Objetivo de Salud', value: cliente?.ObjetivoSalud || 'No disponible' },
        { label: 'Medicamentos', value: cliente?.Medicamentos || 'No disponible' }
      ];

      // Definir los encabezados de la tabla
      const headers = [['Información', 'Detalles']];

      // Crear la tabla con autoTable
      doc.autoTable({
        head: headers,
        body: clientInfo.map(info => [info.label, info.value]),
        startY: yPosition, // Posición inicial de la tabla
        margin: { top: 10, left: margin, right: margin }, // Márgenes de la tabla
        theme: 'striped', // Estilo de la tabla
        styles: { fontSize: 10 }, // Tamaño de la fuente
        columnStyles: { 0: { cellWidth: 'auto' }, 1: { cellWidth: 'auto' } }, // Ajustar el ancho de las columnas
        headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, // Colores de los encabezados
        bodyStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0] }, // Estilos de las filas
      });

      // Actualizar yPosition después de la tabla
      yPosition = doc.lastAutoTable.finalY + 15; // Añadir un margen después de la tabla

      // Continuar con el resto de la generación del PDF, como la lista de formularios
      doc.setFontSize(12);
      this.writeMultilineText(doc, 'Cuestionarios del cliente:', margin, yPosition);
      yPosition += 15; // Espacio antes de formularios

      const formulariosConPreguntas = formularios.map(formulario => {
        const preguntasDelFormulario = preguntas.filter(pregunta => pregunta.IdCuestionario === formulario.IdCuestionario);
        const cuestionario = this.cuestionariosget.find(c => c.IdCuestionario === formulario.IdCuestionario);

        return {
          formulario,
          preguntas: preguntasDelFormulario,
          cuestionario
        };
      });

      formulariosConPreguntas.forEach((item, index) => {
        const nombreCuestionario = item.cuestionario?.NomCuestionario || `Cuestionario ${item.formulario.IdCuestionario}`;
        const descripcionCuestionario = item.cuestionario?.Descripcion || 'Sin descripción';

        // Estilo para el nombre del cuestionario (más grande y elegante)
        doc.setFontSize(15);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);  // Color negro para el título
        this.writeMultilineText(doc, `${index + 1}. ${nombreCuestionario}`, margin, yPosition);
        yPosition += 8;

        // Añadir línea divisoria sutil debajo del nombre del cuestionario
        doc.setDrawColor(180, 180, 180); // Gris suave
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 6;

        // Estilo para la descripción (fuente normal y tamaño más pequeño)
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(90, 90, 90);  // Gris oscuro para la descripción
        this.writeMultilineText(doc, `Descripción: ${descripcionCuestionario}`, margin, yPosition);
        yPosition += 12;

        // Agregar línea divisoria después de la descripción
        doc.setDrawColor(220, 220, 220); // Gris aún más claro
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;

        // Escribir las preguntas y respuestas
        item.preguntas.forEach((pregunta, idx) => {
          // Filtrar la respuesta correcta para esta pregunta y cliente
          const respuesta = respuestas.find(resp => resp.IdPregunta === pregunta.IdPregunta && resp.IdCliente === cliente.IdCliente);

          // Si no se encuentra respuesta, mostrar "Sin respuesta"
          const textoRespuesta = respuesta ? respuesta.Respuesta : 'Sin respuesta';

          // Estilo para las preguntas (más pequeñas)
          doc.setFontSize(10); // Cambié el tamaño a 10
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 0, 0);  // Negro para las preguntas
          this.writeMultilineText(doc, `${pregunta.Pregunta}`, margin, yPosition);
          yPosition += 10;

          // Estilo para las respuestas (gris claro para las respuestas)
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(120, 120, 120); // Gris claro para las respuestas
          this.writeMultilineText(doc, `Respuesta: ${textoRespuesta}`, margin + 10, yPosition);  // Sangría de 10 para las respuestas
          yPosition += 12;  // Espacio entre pregunta y respuesta

          // Verificar si es necesario agregar una nueva página
          if (yPosition >= pageHeight - margin - 30) {  // Ajuste para dejar espacio para el margen inferior
            doc.addPage();  // Agregar nueva página si se excede el límite
            addHeader(); // Agregar encabezado a la nueva página
            yPosition = margin + 25;  // Restablecer posición Y para la nueva página
          }
        });

        // Añadir espacio extra entre formularios
        yPosition += 15;

        // Línea divisoria para separar formularios
        doc.setDrawColor(220, 220, 220); // Gris suave
        doc.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 10;
      });
    }

    // Agregar encabezado a la primera página
    addHeader(); // Agregar encabezado a la primera página

    // Agregar contenido
    addContent();

    // Guardar el PDF con el nombre del usuario o un valor por defecto
    doc.save(`${usuario?.NombreCompleto || 'Expediente'}_Expediente.pdf`);
  }

  // Función auxiliar para escribir texto ajustado (con salto de línea automático)
  writeMultilineText(doc: jsPDF, text: string, x: number, y: number, maxWidth: number = 180): void {
    const splitText = doc.splitTextToSize(text, maxWidth); // Divide el texto si es demasiado largo
    doc.text(splitText, x, y);
  }

}
