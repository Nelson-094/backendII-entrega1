import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

export const config = {
    port: process.env.PORT || 8080,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
    jwtSecret: process.env.JWT_SECRET || 'default_secret_key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    baseUrl: process.env.BASE_URL || 'http://localhost:8080',
    // Configuración de mail
    mailService: process.env.MAIL_SERVICE || 'gmail',
    mailPort: process.env.MAIL_PORT || 587,
    mailUser: process.env.MAIL_USER || '',
    mailPass: process.env.MAIL_PASS || ''
};
