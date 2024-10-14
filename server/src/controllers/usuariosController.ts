import { Request, Response } from 'express';

import pool from '../database';

class UsuariosController{
    public async list(req: Request, res: Response): Promise<void> {
        const usuarios = await pool.query('SELECT * FROM usuarios');
        res.json(usuarios);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        try {
            const usuarios = await pool.query('SELECT * FROM usuarios WHERE id = ?', [id]);
            if (usuarios.length > 0) {
                return res.json(usuarios[0]);
            }
            res.status(404).json({ text: "The user doesn't exist" });
        } catch (error) {
            res.status(500).json({ error: "Error retrieving user" });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        const result = await pool.query('INSERT INTO usuarios set ?', [req.body]);
        res.json({ message: 'User Saved' });
    }

    public  async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
        res.json({ message: "The user was deleted" });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const oldHouse = req.body;
        await pool.query('UPDATE usuarios set ? WHERE id = ?', [req.body, id]);
        res.json({ message: "The user was Updated" });
    }
}

const usuariosController = new UsuariosController();
export default usuariosController;