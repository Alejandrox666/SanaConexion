import { Request, Response } from "express";

import pool from "../database";

class EnvioFormController {

    public async list(req: Request, res: Response): Promise<void> {
        const envioForm = await pool.query('SELECT * FROM enviosFfrmularios');
        res.json(envioForm);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        try {
            const envioForm = await pool.query('SELECT * FROM enviosformularios WHERE IdEnvio = ?', [id]);
            if (envioForm.length > 0) {
                return res.json(envioForm[0]);
            }
            res.status(404).json({ message: "The send doesn't exist" });
        } catch (error) {
            res.status(500).json({ error: "Error retrieving send" });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        const result = await pool.query('INSERT INTO enviosformularios SET ?', [req.body]);
        res.json({ message: 'Send saved' });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query(`Update enviosformularios set ? where IdEnvio = ?`, [req.body, id])
        res.json({ message: 'The send was update' })
    }

    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM enviosformularios WHERE IdEnvio = ?', [id]);
        res.json({ message: "Send deleted" });
    }
}
const envioFormController = new EnvioFormController()
export default envioFormController;