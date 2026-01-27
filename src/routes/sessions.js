import express from 'express';
import { body } from 'express-validator';
import { register, login, current } from '../controllers/sessionController.js';

const router = express.Router();

/**
 * @route   POST /api/sessions/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', [
    body('first_name').trim().notEmpty().withMessage('First name is required'),
    body('last_name').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('age').isInt({ min: 0 }).withMessage('Age must be a positive number'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

/**
 * @route   POST /api/sessions/login
 * @desc    Login user and get JWT token
 * @access  Public
 */
router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], login);

/**
 * @route   GET /api/sessions/current
 * @desc    Get current logged user data from JWT
 * @access  Protected (requires valid JWT token)
 * @note    Uses Passport "current" strategy to validate token and extract user data
 */
router.get('/current', current);

export default router;
