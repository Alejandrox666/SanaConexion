export interface Chats {
    
    IdChat: number
    FechaInicio: Date | string
    Estado: string;

    msj?: Mensajes[];
    participantes?: Participantes[];
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