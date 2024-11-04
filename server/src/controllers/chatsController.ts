import { Request, Response } from "express";

import pool from "../database";

class ChatsController {

    public async chatList(req: Request, res: Response): Promise<void> {
        const chat = await pool.query(`Select * FROM Chats`)
        res.json(chat)
    }

    public async partList(req: Request, res: Response): Promise<void> {
        const msj = await pool.query(`Select * FROM ParticipantesChat`)
        res.json(msj)
    }

    public async msjList(req: Request, res: Response): Promise<void> {
        const msj = await pool.query(`Select * FROM Mensajes`)
        res.json(msj)
    }

    public async getOneMsj(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        try {
            const msj = await pool.query(`Select * FROM Mensajes
    WHERE IdChat = ?`, [id])
            if (msj.length > 0) {
                return res.json(msj);
            }
            res.status(404).json({ text: "The msj doesn't exist" });
        } catch (error) {
            res.status(500).json({ error: "Error retrieving user" });
        }

    }

    

    public async createChat(req: Request, res: Response): Promise<void> {
        try {
            const result = await pool.query('INSERT INTO Chats set ?', [req.body]);

            const chatId = result.insertId

            res.json({ IdChat: chatId, message: 'Chat Saved' });
        } catch (error) {
            res.status(500).json({ message: 'error creating chat' });
        }
    }

    public async createPart(req: Request, res: Response): Promise<void> {
        try {
            const result = await pool.query('INSERT INTO ParticipantesChat set ?', [req.body]);

            const chatId = result.insertId

            res.json({ IdCuestionario: chatId, message: 'Member Saved' });
        } catch (error) {
            res.status(500).json({ message: 'error creating member' });
        }
    }

    public async createMsj(req: Request, res: Response): Promise<void> {
        await pool.query('INSERT INTO Mensajes set ?', [req.body]);
        res.json({ message: 'MSJ save' })
    }
}
const chatsController = new ChatsController()
export default chatsController;