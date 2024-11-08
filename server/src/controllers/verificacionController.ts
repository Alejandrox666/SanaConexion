// controllers/verificacion.controller.ts
import { Request, Response } from 'express';
import sgMail from '@sendgrid/mail';
import db from '../models';

sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

// Generar código aleatorio
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000); // Código de 6 dígitos
}

class VerificacionController {
    // Controlador para enviar el código de verificación
    public async enviarCodigoVerificacion(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        const codigo = generateVerificationCode();
        const timestamp = new Date();

        try {
            // Enviar el correo con el código de verificación
            const msg = {
                to: email,
                from: 'tu-email@tudominio.com',
                subject: 'Código de Verificación',
                text: `Tu código de verificación es: ${codigo}`,
            };
            await sgMail.send(msg);

            // Guardar el código y el timestamp en la base de datos
            await db.CodigosVerificacion.create({ email, codigo, timestamp });
            res.status(200).json({ message: 'Código enviado exitosamente' });
        } catch (error) {
            console.error("Error al enviar el código:", error);
            res.status(500).json({ error: 'Error al enviar el código de verificación' });
        }
    }

    // Controlador para verificar el código ingresado
    public async verificarCodigo(req: Request, res: Response): Promise<void> {
        const { email, codigo } = req.body;

        try {
            const registro = await db.CodigosVerificacion.findOne({ where: { email } });
            if (registro && registro.codigo === codigo && !this.isCodeExpired(registro.timestamp)) {
                res.status(200).json({ valid: true });
            } else {
                res.status(400).json({ valid: false, error: 'Código incorrecto o expirado' });
            }
        } catch (error) {
            console.error("Error al verificar el código:", error);
            res.status(500).json({ error: 'Error al verificar el código' });
        }
    }

    // Función para verificar si el código ha expirado (por ejemplo, 10 minutos)
    private isCodeExpired(timestamp: Date): boolean {
        const expirationTime = 10 * 60 * 1000; // 10 minutos en milisegundos
        return (new Date().getTime() - timestamp.getTime()) > expirationTime;
    }
}

const verificacionController = new VerificacionController();
export default verificacionController;
