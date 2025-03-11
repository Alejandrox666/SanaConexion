export interface Clientes {
  IdCliente: number;          // Asegúrate de que este campo sea el ID de cliente
  IdUsuario: number;          // Este campo será la llave foránea referenciando a Usuario
  Edad: String;               // Edad del cliente
  Sexo: string;               // Sexo del cliente (M/F)
  Peso: String;               // Peso en kg
  Estatura: String;           // Estatura en m
  EnfCronicas?: string;       // Enfermedades crónicas (opcional)
  Alergias?: string;          // Alergias (opcional)
  ObjetivoSalud?: string;     // Objetivo de salud (opcional)
  Medicamentos?: string;      // Medicamentos que toma (opcional)
  Foto?: File;                // Foto del cliente (opcional)

  Nombre?: string;
  chatActivo?: boolean;  // Asegúrate de que esta propiedad esté definida
  mostrar?: boolean;
}

export interface CuestionariosClientes {
  IdCuestionarioCliente: number
  IdCliente: number,
  IdCuestionario: number
  Estado: string,
  FechaAsignacion: Date | string
}