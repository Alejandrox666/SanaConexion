export interface Cuestionarios {
    IdCuestionario: number;
    IdEspecialista: number;
    NomCuestionario: string;
    Descripcion: string;
    FechaCreacion: Date | string;

    preguntas?: Preguntas[];
    IdEnvio?:number;
}

export interface Preguntas {
    IdPregunta: number;
    IdCuestionario: number;
    Pregunta: string;
}

export interface Respuestas {
    IdRespuesta?: number;
    IdPregunta: number;
    IdCliente: number;
    Respuesta: string;
}