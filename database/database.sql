create database sistema_nutricion;

use sistema_nutricion;

-- Tabla Usuarios
CREATE TABLE Usuarios (
    IdUsuario INT AUTO_INCREMENT PRIMARY KEY,
    NombreCompleto VARCHAR(100),
    Telefono VARCHAR(15),
    Email VARCHAR(100),
    Password VARCHAR(255),
    FechaRegistro DATE,
    tipoUsuario VARCHAR(12)
);

-- Tabla Clientes
CREATE TABLE Clientes (
    IdCliente INT AUTO_INCREMENT PRIMARY KEY,
    IdUsuario INT,
    Edad INT,
    Sexo CHAR(1),
    Peso DECIMAL(5,2),
    Estatura DECIMAL(5,2),
    EnfCronicas TEXT,
    Alergias TEXT,
    ObjetivoSalud TEXT,
    Medicamentos TEXT,
    Foto LONGTEXT,
    FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
);

-- Tabla Especialistas
CREATE TABLE Especialistas (
    IdEspecialista INT AUTO_INCREMENT PRIMARY KEY,
    IdUsuario INT,
    NumCedula VARCHAR(50),
    GradoEstudios VARCHAR(100),
    Especialidad VARCHAR(100),
    Certificaciones LONGTEXT,
    YearsExperience INT,
    Foto LONGTEXT,
    FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario)
);

-- Notificaciones
CREATE TABLE Notificaciones (
    IdNotificacion INT AUTO_INCREMENT PRIMARY KEY,
    IdEspecialista INT,
    IdCliente INT,
    Descripcion TEXT,
    FechaInicio Date,
    FechaFin Date,
    Estado TEXT,
    FOREIGN KEY (IdEspecialista) REFERENCES Especialistas(IdEspecialista) ON DELETE CASCADE,
    FOREIGN KEY (IdCliente) REFERENCES Clientes(IdCliente) ON DELETE CASCADE
);

-- Tabla Cuestionarios
CREATE TABLE Cuestionarios (
    IdCuestionario INT AUTO_INCREMENT PRIMARY KEY,
    IdEspecialista INT,
    NomCuestionario VARCHAR(100),
    Descripcion TEXT,
    FechaCreacion DATE,
    FOREIGN KEY (IdEspecialista) REFERENCES Especialistas(IdEspecialista)
);

-- Tabla Preguntas
CREATE TABLE Preguntas (
    IdPregunta INT AUTO_INCREMENT PRIMARY KEY,
    IdCuestionario INT,
    Pregunta TEXT,
    FOREIGN KEY (IdCuestionario) REFERENCES Cuestionarios(IdCuestionario) ON DELETE CASCADE
);

-- Tabla Respuestas
CREATE TABLE Respuestas (
    IdRespuesta INT AUTO_INCREMENT PRIMARY KEY,
    IdPregunta INT,
    IdCliente INT,
    Respuesta TEXT,
    FOREIGN KEY (IdPregunta) REFERENCES Preguntas(IdPregunta) ON DELETE CASCADE,
    FOREIGN KEY (IdCliente) REFERENCES Clientes(IdCliente) ON DELETE CASCADE
);

-- Tabla verificacion
CREATE TABLE verification_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla Chats
CREATE TABLE Chats (
    IdChat INT AUTO_INCREMENT PRIMARY KEY,
    FechaInicio DATETIME DEFAULT CURRENT_TIMESTAMP,
    Estado VARCHAR(50) DEFAULT 'Activo'
);

-- Participantes
CREATE TABLE ParticipantesChat (
    IdParticipacion INT AUTO_INCREMENT PRIMARY KEY,
    IdChat INT,
    IdUsuario INT,
    FOREIGN KEY (IdChat) REFERENCES Chats(IdChat) ON DELETE CASCADE,
    FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario) ON DELETE CASCADE
);

-- Tabla Mensajes
CREATE TABLE Mensajes (
    IdMensaje INT AUTO_INCREMENT PRIMARY KEY,
    IdChat INT,
    IdEmisor INT, -- ID del usuario que envía el mensaje
    Texto TEXT,
    FechaEnvio DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (IdChat) REFERENCES Chats(IdChat) ON DELETE CASCADE,
    FOREIGN KEY (IdEmisor) REFERENCES Usuarios(IdUsuario) ON DELETE CASCADE
);

-- Envios
CREATE TABLE EnviosFormularios (
    IdEnvio INT AUTO_INCREMENT PRIMARY KEY,
    IdCuestionario INT,
    IdUsuario INT,
    FechaEnvio DATETIME DEFAULT CURRENT_TIMESTAMP,
    EstadoEnvio VARCHAR(50) DEFAULT 'Enviado',
    FOREIGN KEY (IdCuestionario) REFERENCES Cuestionarios(IdCuestionario) ON DELETE CASCADE,
    FOREIGN KEY (IdUsuario) REFERENCES Usuarios(IdUsuario) ON DELETE CASCADE
);