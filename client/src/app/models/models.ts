export interface Usuarios {
    IdUsuario: number,
    NombreCompleto: string,
    Telefono: number,
    Email: string,
    Password: string,
    FechaRegistro: Date | string,
    tipoUsuario: string
};