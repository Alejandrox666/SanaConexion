import { Request, Response } from 'express';

import pool from '../database';

class ClientesController{
    public async list(req: Request, res: Response): Promise<void> {
        const usuarios = await pool.query('SELECT * FROM clientes');
        res.json(usuarios);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        try {
            const usuarios = await pool.query('SELECT * FROM clientes WHERE id = ?', [id]);
            if (usuarios.length > 0) {
                return res.json(usuarios[0]);
            }
            res.status(404).json({ text: "The user doesn't exist" });
        } catch (error) {
            res.status(500).json({ error: "Error retrieving user" });
        }
    }

    public async getOneIdUsuario(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        try {
            const usuarios = await pool.query('SELECT * FROM clientes WHERE idUsuario = ?', [id]);
            if (usuarios.length > 0) {
                return res.json(usuarios[0]);
            }
            res.status(404).json({ text: "The user doesn't exist" });
        } catch (error) {
            res.status(500).json({ error: "Error retrieving user" });
        }
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
          const { Foto, ...datosCliente } = req.body;
          
          // Aquí podrías agregar lógica para manipular o guardar la imagen si es necesario
          await pool.query('INSERT INTO clientes SET ?', [{ ...datosCliente, Foto }]);
          
          res.json({ message: 'Cliente guardado exitosamente' });
        } catch (error) {
          console.error("Error al guardar cliente:", error);
          res.status(500).json({ error: 'Error al guardar cliente' });
        }
      }
      

    public  async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM clientes WHERE id = ?', [id]);
        res.json({ message: "The user was deleted" });
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const oldHouse = req.body;
        console.log(req.body);
        await pool.query('UPDATE clientes set ? WHERE IdUsuario = ?', [req.body, id]);
        res.json({ message: "The user was Updated" });
    }




}

const clientesController = new ClientesController();
export default clientesController;