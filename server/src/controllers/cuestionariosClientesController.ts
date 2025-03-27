import { Request, Response } from 'express';
import pool from '../database';

class CuestionariosClientesController {
    // Listar todas las asignaciones de cuestionarios a clientes
    public async list(req: Request, res: Response): Promise<void> {
        const cuestionariosClientes = await pool.query('SELECT * FROM cuestionariosClientes');
        res.json(cuestionariosClientes);
    }

    // Obtener una asignación de cuestionario a cliente por ID
    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        try {
            const cuestionarioCliente = await pool.query('SELECT * FROM cuestionariosClientes WHERE IdCuestionarioCliente = ?', [id]);
            if (cuestionarioCliente.length > 0) {
                return res.json(cuestionarioCliente[0]);
            }
            res.status(404).json({ message: "The assignment doesn't exist" });
        } catch (error) {
            res.status(500).json({ error: "Error retrieving assignment" });
        }
    }

    // Crear una nueva asignación de cuestionario a cliente
    public async create(req: Request, res: Response): Promise<void> {
        const result = await pool.query('INSERT INTO cuestionariosClientes SET ?', [req.body]);
        res.json({ message: 'Assignment saved' });
    }

    // Eliminar una asignación de cuestionario a cliente por ID
    public async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM cuestionariosClientes WHERE IdCuestionarioCliente = ?', [id]);
        res.json({ message: "Assignment deleted" });
    }

    // Actualizar una asignación de cuestionario a cliente
    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('UPDATE cuestionariosClientes SET ? WHERE IdCuestionarioCliente = ?', [req.body, id]);
        res.json({ message: "Assignment updated" });
    }

    // Obtener todos los cuestionarios asignados a un cliente específico
    public async getAllCuestionariosByCliente(req: Request, res: Response): Promise<any> {
        const { IdCliente } = req.params;
        try {
            const cuestionarios = await pool.query(
                'SELECT cuestionariosClientes.IdCuestionarioCliente, cuestionarios.NomCuestionario, cuestionariosClientes.Estado ' +
                'FROM cuestionariosClientes ' +
                'JOIN cuestionarios ON cuestionariosClientes.IdCuestionario = cuestionarios.IdCuestionario ' +
                'WHERE cuestionariosClientes.IdCliente = ?',
                [IdCliente]
            );
            
            if (cuestionarios.length > 0) {
                return res.json(cuestionarios);
            }
            
            res.status(404).json({ message: "No questionnaires found for the specified client ID." });
        } catch (error) {
            res.status(500).json({ error: "Error retrieving questionnaires for client." });
        }
    }
}

const cuestionariosClientesController = new CuestionariosClientesController();
export default cuestionariosClientesController;