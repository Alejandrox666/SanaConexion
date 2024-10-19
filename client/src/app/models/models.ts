export interface Usuarios {
    IdUsuario: number,
    NombreCompleto: string,
    Telefono: number,
    Email: string,
    Password: string,
    FechaRegistro: Date | string,
    tipoUsuario: string
};

export interface Especialistas{
    IdUsuario?: number,
    IdEspecialista?: number,
    NumCedula?: string,
    GradoEstudios?: string,
    Especialidad?: string,
    Certificaciones?: string,
    YearsExperience?: number,
    Foto?: Blob
}