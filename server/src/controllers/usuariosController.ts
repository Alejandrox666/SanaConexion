import { Request, Response } from 'express';
import crypto from 'crypto'; 
import pool from '../database';
import nodemailer from 'nodemailer';


class UsuariosController{
    public async list(req: Request, res: Response): Promise<void> {
        const usuarios = await pool.query('SELECT * FROM usuarios');
        res.json(usuarios);
    }

    public async getOne(req: Request, res: Response): Promise<any> {
        const { id } = req.params;
        try {
            const usuarios = await pool.query('SELECT * FROM usuarios WHERE IdUsuario = ?', [id]);
            
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
            // Realiza la inserción y almacena el resultado
            const result = await pool.query('INSERT INTO usuarios set ?', [req.body]);
            
            // Obtiene el ID del usuario recién creado
            const userId = result.insertId; // Asegúrate de que el método de consulta devuelve insertId
            
            // Devuelve el ID del usuario como parte de la respuesta
            res.json({ IdUsuario: userId, message: 'User Saved' });
        } catch (error) {
            console.error('Error al crear usuario:', error);
            res.status(500).json({ message: 'Error al crear usuario' });
        }
    }
    

    public  async delete(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
        res.json({ message: "The user was deleted" });

    }

    public async updatePasswd(req: Request, res: Response): Promise<void> {
        const { email, newPassword } = req.body; // Extrae email y newPassword de req.body
        
        if (email && newPassword) {
            const query = `UPDATE usuarios SET password = ? WHERE email = ?`;
            const values = [newPassword, email];
            await pool.query('UPDATE usuarios set password = ? WHERE email = ?', [newPassword, email]);
            res.json({ message: "The user was Updated" });
            console.log(newPassword,email)
            
           
        } else {
            res.status(400).send("Email o contraseña no proporcionados");
        }
    }
    

    public async update(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { NombreCompleto, Telefono, Email, Password } = req.body; // Desestructura los campos específicos de req.body
    
        try {
            await pool.query(
                'UPDATE usuarios SET NombreCompleto = ?, Telefono = ?, Email = ?, Password = ? WHERE IdUsuario = ?',
                [NombreCompleto, Telefono, Email, Password, id]
            );
            res.json({ message: "The user was updated successfully" });
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ message: "Error updating user", error });
        }
    }
    

   
    

    public async sendVerificationCode(req: Request, res: Response): Promise<any> {
        const { email } = req.body;

        // Validar el formato del correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Email no válido' });
        }

        const verificationCode = crypto.randomBytes(3).toString('hex');

        // Configura el transporte de nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'xela0206hena@gmail.com', // Utiliza variables de entorno
                pass: 'otmf udry kibx nxmt'  // Utiliza variables de entorno
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Código de Verificación',
            text: `Tu código de verificación es: ${verificationCode}`
        };

        try {
            await transporter.sendMail(mailOptions);
            await pool.query('INSERT INTO verification_codes (email, code) VALUES (?, ?)', [email, verificationCode]);
            return res.json({ message: 'Código de verificación enviado' });
        } catch (error) {
            console.error('Error al enviar el correo o guardar en la base de datos:', error);
            return res.status(500).json({ message: 'Error al enviar el correo o guardar en la base de datos' });
        }
    }
    

    public async verifyCode(req: Request, res: Response): Promise<void> {
        // Log para ver qué contiene req.body
        console.log("Contenido de req.body:", req.body);
    
        const { email, code } = req.body;
    
        // Validación para verificar si existen email y code en el body
        if (!email) {
            console.error("Email no proporcionado");
            res.status(400).json({ message: 'Email es requerido' });
            return;
        }
        if (!code) {
            console.error("Código no proporcionado");
            res.status(400).json({ message: 'Código es requerido' });
            return;
        }
    
        try {
            const result = await pool.query('SELECT * FROM verification_codes WHERE email = ? AND code = ?', [email, code]);
            console.log("Resultado de la consulta:", result);
    
            if (result.length > 0) {
                await pool.query('DELETE FROM verification_codes WHERE email = ?', [email]);
                res.json({ message: 'Código verificado correctamente' });
            } else {
                console.error("Código inválido");
                res.status(400).json({ message: 'Código inválido' });
            }
        } catch (error) {
            console.error("Error al verificar el código:", error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

    public async sendNewPassword(req: Request, res: Response): Promise<any> {
        const { email } = req.body;
    
        // Validar el formato del correo electrónico
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Email no válido' });
        }
    
        // Generar una nueva contraseña aleatoria
        const newPassword = crypto.randomBytes(4).toString('hex'); // Contraseña de 8 caracteres
    
        // Configura el transporte de nodemailer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'xela0206hena@gmail.com', // Utiliza variables de entorno
                pass: 'otmf udry kibx nxmt' // Utiliza variables de entorno
            }
        });
    
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Nueva contraseña generada',
            text: `Tu nueva contraseña es: ${newPassword}`
        };
    
        try {
            // Envía el correo
            await transporter.sendMail(mailOptions);
            
            // Aquí podrías agregar lógica para actualizar la contraseña en la base de datos
            await pool.query('UPDATE usuarios SET password = ? WHERE email = ?', [newPassword, email]);
            
            return res.json({ message: 'Nueva contraseña enviada al correo' });
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            return res.status(500).json({ message: 'Error al enviar el correo' });
        }
    }
    



}

const usuariosController = new UsuariosController();
export default usuariosController;