import dotenv from 'dotenv';

// Load environment variables immediately
dotenv.config();

export const config = {
    port: process.env.PORT || 8080,
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
    jwtSecret: process.env.JWT_SECRET || 'default_secret_key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h'
};
