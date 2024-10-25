import { Request, Response } from "express";

import pool from "../database";

class FormularioController {

    public async formList(req: Request, res: Response): Promise<void> {
        const formularios = await pool.query(`Select Cuestionarios.NomCuestionario, Cuestionarios.Descripcion, Cuestionarios.FechaCreacion, Preguntas.Pregunta
    FROM Cuestionarios
    INNER JOIN Preguntas ON Cuestionarios.IdCuestionario = Preguntas.IdCuestionario`)
        res.json(formularios)
    }

    public async getOneForm(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        try {
            const formulario = await pool.query(`Select Cuestionarios.NomCuestionario, Cuestionarios.Descripcion, Cuestionarios.FechaCreacion, Preguntas.Pregunta
    FROM Cuestionarios
    INNER JOIN Preguntas ON Cuestionarios.IdCuestionario = Preguntas.IdCuestionario
    WHERE Cuestionarios.IdCuestionario = ?`, [id])
            if (formulario.length > 0) {
                return res.json(formulario[0]);
            }
            res.status(404).json({ text: "The user doesn't exist" });
        } catch (error) {
            res.status(500).json({ error: "Error retrieving user" });
        }

    }

}
const formularioController = new FormularioController()
export default formularioController;