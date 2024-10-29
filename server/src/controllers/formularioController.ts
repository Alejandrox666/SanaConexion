import { Request, Response } from "express";

import pool from "../database";

class FormularioController {

    public async formList(req: Request, res: Response): Promise<void> {
        const formularios = await pool.query(`Select * FROM Cuestionarios`)
        res.json(formularios)
    }

    public async preList(req: Request, res: Response): Promise<void> {
        const formularios = await pool.query(`Select * FROM Preguntas`)
        res.json(formularios)
    }

    public async getOneForm(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        try {
            const formulario = await pool.query(`Select * FROM Cuestionarios
    WHERE IdCuestionario = ?`, [id])
            if (formulario.length > 0) {
                return res.json(formulario);
            }
            res.status(404).json({ text: "The user doesn't exist" });
        } catch (error) {
            res.status(500).json({ error: "Error retrieving user" });
        }

    }

    public async createForm(req: Request, res: Response): Promise<void> {
        try {
            const result = await pool.query('INSERT INTO Cuestionarios set ?', [req.body]);

            const formId = result.insertId

            res.json({ IdCuestionario: formId, message: 'Form Saved' });
        } catch (error) {
            res.status(500).json({ message: 'error creating form' });
        }
    }

    public async createPre(req: Request, res: Response): Promise<void> {
        await pool.query('INSERT INTO Preguntas set ?', [req.body]);
        res.json({ message: 'Question save' })
    }

    public async updateForm(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query(`Update Cuestionarios set ? where IdCuestionario = ?`, [req.body, id])
        res.json({ message: 'The form was update' })
    }

    public async updatePre(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        await pool.query(`Update Preguntas set ? where idPregunta = ?`, [req.body, id])
        res.json({ message: 'The question was update' })
    }

    public async deleteForm(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        await pool.query(`Delete From Cuestionarios where IdCuestionario = ?`, id)
        res.json({ message: 'The form was deleted' })
    }

    public async deletePre(req: Request, res: Response): Promise<void> {
        const { id } = req.params
        await pool.query(`Delete From Preguntas where idPregunta = ?`, id)
        res.json({ message: 'The question was deleted' })
    }
}
const formularioController = new FormularioController()
export default formularioController;