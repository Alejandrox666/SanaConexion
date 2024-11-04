import { Request, Response } from 'express';

import pool from '../database';

class RespuestasController{
    public async list(req: Request, res: Response): Promise<void> {
        const usuarios = await pool.query('SELECT * FROM respuestas');
        res.json(usuarios);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        try {
            const usuarios = await pool.query('SELECT * FROM respuestas WHERE id = ?', [id]);
            if (usuarios.length > 0) {
                return res.json(usuarios[0]);
            }
            res.status(404).json({ text: "The respuesta doesn't exist" });
        } catch (error) {
            res.status(500).json({ error: "Error retrieving user" });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        const result = await pool.query('INSERT INTO respuestas set ?', [req.body]);
        res.json({ message: 'Answer Saved' });
    }

    public  async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM respuestas WHERE id = ?', [id]);
        res.json({ message: "The user was deleted" });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const oldHouse = req.body;
        await pool.query('UPDATE respuestas set ? WHERE id = ?', [req.body, id]);
        res.json({ message: "The user was Updated" });
    }

    public async getAllPreguntasByIdCuestionario(req: Request, res: Response): Promise<any> {
        const { IdCuestionario } = req.params;
        try {
            const respuestas = await pool.query(
                'SELECT Preguntas.IdPregunta, Preguntas.Pregunta FROM Preguntas WHERE Preguntas.IdCuestionario = ?;',
                [IdCuestionario]
            );
            
            if (respuestas.length > 0) {
                return res.json(respuestas); // Devuelve todas las preguntas
            }
            
            res.status(404).json({ text: "No questions found for the specified Cuestionario ID." });
        } catch (error) {
            res.status(500).json({ error: "Error retrieving questions" });
        }
    }
    
    public async getOneCliente(req: Request, res: Response): Promise<any> {
        const { IdUsuario } = req.params;
        try {
            const cliente = await pool.query('SELECT * FROM clientes WHERE IdUsuario = ? ', [IdUsuario]);
            if (cliente.length > 0) {
                return res.json(cliente[0]); // Devuelve el primer cliente encontrado
            }
            res.status(404).json({ message: "The client doesn't exist." });
        } catch (error) {
            res.status(500).json({ error: "Error retrieving client." });
        }
    }

}

const respuestasController = new RespuestasController();
export default respuestasController;