import { Request, Response } from "express";

import pool from "../database";

class UsuarioEspController {
    public async list(req: Request, res: Response): Promise<void> {
        const usuarios = await pool.query(`SELECT Usuarios.NombreCompleto, Usuarios.Telefono, Usuarios.Email, Especialistas.IdUsuario,Especialistas.NumCedula, Especialistas.GradoEstudios, Especialistas.Especialidad, Especialistas.Certificaciones, Especialistas.YearsExperience, Especialistas.Foto
   FROM Usuarios
   INNER JOIN Especialistas ON Usuarios.IdUsuario = Especialistas.IdUsuario`)
        res.json(usuarios)
    }

    

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;

        try {
            const usuarios = await pool.query(`SELECT Usuarios.NombreCompleto, Usuarios.Telefono, Usuarios.Email, Especialistas.IdEspecialista, Especialistas.NumCedula, Especialistas.GradoEstudios, Especialistas.Especialidad, Especialistas.Certificaciones, Especialistas.YearsExperience, Especialistas.Foto
                FROM Usuarios
                INNER JOIN Especialistas ON Usuarios.IdUsuario = Especialistas.IdUsuario
                WHERE Usuarios.IdUsuario = ?`, [id]);
            if (usuarios.length > 0) {
                return res.json(usuarios[0]);
            }
            res.status(404).json({ text: "The user doesn't exist" });
        } catch (error) {
            res.status(500).json({ error: "Error retrieving user" });
        }
    }

    public async getOne2(req: Request, res: Response): Promise<any> {
        const { id } = req.params;

        try {
            const especialistas = await pool.query(`SELECT *
                FROM Especialistas
                WHERE IdUsuario = ?`, [id]);
            if (especialistas.length > 0) {
                console.log(especialistas);
                return res.json(especialistas[0]);

            }
            res.status(404).json({ text: "The user doesn't exist" });
        } catch (error) {
            res.status(500).json({ error: "Error retrieving user" });
        }
    }

    public async createEsp(req: Request, res: Response): Promise<void> {
        try {
          const { Foto, ...datosEspecialista } = req.body;
          
          // Aquí podrías agregar lógica para manipular o guardar la imagen si es necesario
          await pool.query('INSERT INTO especialistas SET ?', [{ ...datosEspecialista, Foto }]);
          res.json({ message: 'Especialista guardado exitosamente' });
        } catch (error) {
          console.error("Error al guardar especialista:", error);
          res.status(500).json({ error: 'Error al guardar especialista' });
        }
      }
      

    public async updateUsu(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('UPDATE Usuarios set ? WHERE IdUsuario = ?', [req.body, id]);
        res.json({ message: 'The usuario was update' })
    }

    public async updateEsp(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('UPDATE Especialistas set ? WHERE IdEspecialista = ?', [req.body, id]);
        res.json({ message: 'The especialista was update' })
    }
}

const usuarioEspController = new UsuarioEspController();
export default usuarioEspController;