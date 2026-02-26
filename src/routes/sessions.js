import express from 'express';
import { body } from 'express-validator';
import { register, login, current, forgotPassword, resetPassword } from '../controllers/sessionController.js';

const router = express.Router();

/**
 * @route   POST /api/sessions/register
 * @desc    Registrar nuevo usuario
 * @access  Público
 */
router.post('/register', [
    body('first_name').trim().notEmpty().withMessage('El nombre es obligatorio'),
    body('last_name').trim().notEmpty().withMessage('El apellido es obligatorio'),
    body('email').isEmail().withMessage('Debe ser un email válido'),
    body('age').isInt({ min: 0 }).withMessage('La edad debe ser un número positivo'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], register);

/**
 * @route   POST /api/sessions/login
 * @desc    Login de usuario y obtener JWT
 * @access  Público
 */
router.post('/login', [
    body('email').isEmail().withMessage('Debe ser un email válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
], login);

/**
 * @route   GET /api/sessions/current
 * @desc    Obtener datos del usuario actual desde JWT (devuelve DTO)
 * @access  Protegido (requiere JWT válido)
 */
router.get('/current', current);

/**
 * @route   POST /api/sessions/forgot-password
 * @desc    Solicitar email de recuperación de contraseña
 * @access  Público
 */
router.post('/forgot-password', [
    body('email').isEmail().withMessage('Debe ser un email válido')
], forgotPassword);

/**
 * @route   POST /api/sessions/reset-password
 * @desc    Restablecer contraseña con token
 * @access  Público (requiere token válido del email)
 */
router.post('/reset-password', [
    body('token').notEmpty().withMessage('El token es obligatorio'),
    body('newPassword').isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres')
], resetPassword);

export default router;
