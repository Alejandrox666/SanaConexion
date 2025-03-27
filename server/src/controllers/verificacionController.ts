import { Request, Response } from 'express';
import sgMail from '@sendgrid/mail';

// Configura SendGrid (asegúrate de tener la API Key)
sgMail.setApiKey('YOUR_SENDGRID_API_KEY');

// Almacén temporal en memoria (simula una DB)
const codigosTemporales: Record<string, { codigo: number; timestamp: Date }> = {};

// Generar código aleatorio (6 dígitos)
function generateVerificationCode(): number {
    return Math.floor(100000 + Math.random() * 900000);
}

class VerificacionController {
    // Enviar código de verificación por email
    public async enviarCodigoVerificacion(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        const codigo = generateVerificationCode();
        const timestamp = new Date();

        try {
            // Guardar en memoria
            codigosTemporales[email] = { codigo, timestamp };

            // Enviar email con SendGrid
            const msg = {
                to: email,
                from: 'tu-email@tudominio.com',
                subject: 'Código de Verificación',
                text: `Tu código de verificación es: ${codigo}`,
            };
            await sgMail.send(msg);

            res.status(200).json({ message: 'Código enviado exitosamente' });
        } catch (error) {
            console.error("Error al enviar el código:", error);
            res.status(500).json({ error: 'Error al enviar el código de verificación' });
        }
    }

    // Verificar si el código es correcto y no ha expirado
    public async verificarCodigo(req: Request, res: Response): Promise<void> {
        const { email, codigo } = req.body;

        try {
            const registro = codigosTemporales[email];
            
            if (!registro) {
                res.status(400).json({ valid: false, error: 'No hay código registrado para este email' });
                return;
            }

            if (registro.codigo === codigo && !this.isCodeExpired(registro.timestamp)) {
                res.status(200).json({ valid: true });
            } else {
                res.status(400).json({ valid: false, error: 'Código incorrecto o expirado' });
            }
        } catch (error) {
            console.error("Error al verificar el código:", error);
            res.status(500).json({ error: 'Error al verificar el código' });
        }
    }

    // Verifica si el código expiró (10 minutos)
    private isCodeExpired(timestamp: Date): boolean {
        const expirationTime = 10 * 60 * 1000; // 10 minutos en milisegundos
        return (new Date().getTime() - timestamp.getTime()) > expirationTime;
    }
}

const verificacionController = new VerificacionController();
export default verificacionController;