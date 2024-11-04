export interface Clientes {
    IdCliente: number;          // Asegúrate de que este campo sea el ID de cliente
    IdUsuario: number;          // Este campo será la llave foránea referenciando a Usuario
    Edad: number;               // Edad del cliente
    Sexo: string;               // Sexo del cliente (M/F)
    Peso: number;               // Peso en kg
    Estatura: number;           // Estatura en m
    EnfCronicas?: string;       // Enfermedades crónicas (opcional)
    Alergias?: string;          // Alergias (opcional)
    ObjetivoSalud?: string;     // Objetivo de salud (opcional)
    Medicamentos?: string;      // Medicamentos que toma (opcional)
    Foto?: File;                // Foto del cliente (opcional)

    Nombre?: string; // Esta es la propiedad que deberías usar
  }

  export interface CuestionariosClientes {
    IdCuestionarioCliente: number
    IdCliente: number,
    IdCuestionario: number
    Estado: string,
    FechaAsignacion: Date | string
  }