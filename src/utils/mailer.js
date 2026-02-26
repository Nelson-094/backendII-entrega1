import nodemailer from 'nodemailer';
import { config } from '../config/config.js';

const transporter = nodemailer.createTransport({
    service: config.mailService,
    port: config.mailPort,
    auth: {
        user: config.mailUser,
        pass: config.mailPass
    }
});

/**
 * Enviar email de recuperación de contraseña
 */
export const sendPasswordResetEmail = async (email, name, resetUrl) => {
    const mailOptions = {
        from: `"E-commerce App" <${config.mailUser}>`,
        to: email,
        subject: 'Recuperación de Contraseña',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333;">Hola ${name},</h2>
                <p>Recibimos una solicitud para restablecer tu contraseña.</p>
                <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="background-color: #4CAF50; color: white; padding: 14px 28px; 
                              text-decoration: none; border-radius: 5px; font-size: 16px;">
                        Restablecer Contraseña
                    </a>
                </div>
                <p style="color: #666; font-size: 14px;">
                    Este enlace expirará en <strong>1 hora</strong>.
                </p>
                <p style="color: #666; font-size: 14px;">
                    Si no solicitaste este cambio, puedes ignorar este correo.
                </p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="color: #999; font-size: 12px;">E-commerce App - No responder a este correo.</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error al enviar email:', error.message);
        // No lanzar error para no revelar si el email existe
    }
};
