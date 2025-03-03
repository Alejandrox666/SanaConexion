export interface Usuarios {
    IdUsuario: number,
    NombreCompleto: string,
    Telefono: string,
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
    Certificaciones?: File,
    YearsExperience?: string,
    Foto?: File,
    moatrarMas? : boolean
}