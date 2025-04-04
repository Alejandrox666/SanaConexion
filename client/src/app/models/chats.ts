export interface Chats {
    IdChat: number
    FechaInicio: Date | string
    Estado: string;

    participantes?: Participantes[];
    mostrar?: boolean;
    msj?: Mensajes[];
}


export interface Participantes {
    IdParticipacion: number;
    IdChat: number;
    IdUsuario: number;
    Nombre?: string;
    Foto?: string;
}

export interface Mensajes {
    IdMensaje: number;
    IdChat: number;
    IdEmisor: number;
    Texto: string;
    FechaEnvio: Date | string
}


export interface EnvioForm {
    IdEnvio?: number;
    IdCuestionario?: number;
    IdEspecialista?: number;
    IdUsuario?: number;
    FechaEnvio?: string;
    EstadoEnvio?: string;
}