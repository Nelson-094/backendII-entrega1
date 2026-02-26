import UserRepository from '../repositories/UserRepository.js';
import UserDTO from '../dto/UserDTO.js';
import { generateToken } from '../utils/jwt.js';
import { sendPasswordResetEmail } from '../utils/mailer.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from '../config/config.js';
import passport from 'passport';

const userRepository = new UserRepository();

/**
 * Registrar nuevo usuario
 * POST /api/sessions/register
 */
export const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;

        // Verificar si el email ya existe
        const existingUser = await userRepository.getByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'El email ya está registrado'
            });
        }

        // Crear usuario (el repository crea el carrito automáticamente)
        const user = await userRepository.create({
            first_name,
            last_name,
            email,
            age,
            password,
            role: role || 'user'
        });

        const userDTO = new UserDTO(user);

        // Generar JWT token
        const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role
        });

        res.status(201).json({
            status: 'success',
            message: 'Usuario registrado exitosamente',
            data: {
                user: userDTO,
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Login de usuario y generación de JWT
 * POST /api/sessions/login
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email y contraseña son obligatorios'
            });
        }

        const user = await userRepository.getByEmail(email);
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Credenciales inválidas'
            });
        }

        const isPasswordValid = user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Credenciales inválidas'
            });
        }

        const userDTO = new UserDTO(user);

        const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role
        });

        res.status(200).json({
            status: 'success',
            message: 'Login exitoso',
            data: {
                user: userDTO,
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obtener usuario actual desde JWT (usa DTO para no enviar info sensible)
 * GET /api/sessions/current
 */
export const current = (req, res, next) => {
    passport.authenticate('current', { session: false }, (error, user, info) => {
        if (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Error al validar el token',
                error: error.message
            });
        }

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: info?.message || 'Token inválido o expirado'
            });
        }

        // Devolver DTO (sin información sensible)
        const userDTO = new UserDTO(user);

        res.status(200).json({
            status: 'success',
            message: 'Usuario validado exitosamente',
            data: {
                user: userDTO
            }
        });
    })(req, res, next);
};

/**
 * Solicitar recuperación de contraseña
 * POST /api/sessions/forgot-password
 */
export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'El email es obligatorio'
            });
        }

        const user = await userRepository.getByEmail(email);
        if (!user) {
            // No revelar si el email existe o no (seguridad)
            return res.json({
                status: 'success',
                message: 'Si el email existe, se enviará un enlace de recuperación'
            });
        }

        // Generar token de recuperación (expira en 1 hora)
        const resetToken = jwt.sign(
            { id: user._id, email: user.email },
            config.jwtSecret,
            { expiresIn: '1h' }
        );

        const resetUrl = `${config.baseUrl}/api/sessions/reset-password?token=${resetToken}`;

        // Enviar email
        await sendPasswordResetEmail(user.email, user.first_name, resetUrl);

        res.json({
            status: 'success',
            message: 'Si el email existe, se enviará un enlace de recuperación'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Restablecer contraseña
 * POST /api/sessions/reset-password
 */
export const resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Token y nueva contraseña son obligatorios'
            });
        }

        // Verificar token
        let payload;
        try {
            payload = jwt.verify(token, config.jwtSecret);
        } catch (err) {
            return res.status(400).json({
                status: 'error',
                message: 'El enlace de recuperación ha expirado o es inválido. Solicita uno nuevo.'
            });
        }

        const user = await userRepository.getById(payload.id);
        if (!user) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        // Verificar que no sea la misma contraseña
        const isSamePassword = bcrypt.compareSync(newPassword, user.password);
        if (isSamePassword) {
            return res.status(400).json({
                status: 'error',
                message: 'No puedes usar la misma contraseña anterior'
            });
        }

        // Actualizar contraseña
        user.password = newPassword;
        await user.save();

        res.json({
            status: 'success',
            message: 'Contraseña restablecida exitosamente'
        });
    } catch (error) {
        next(error);
    }
};
