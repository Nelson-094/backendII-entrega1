import User from '../models/User.js';
import Cart from '../models/Cart.js';
import { generateToken } from '../utils/jwt.js';
import passport from 'passport';

/**
 * Register a new user
 * POST /api/sessions/register
 */
export const register = async (req, res, next) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'Email already registered'
            });
        }

        // Create new cart for user
        const cart = await Cart.create({ products: [] });

        // Create new user (password will be hashed by pre-save hook using bcrypt.hashSync)
        const user = await User.create({
            first_name,
            last_name,
            email,
            age,
            password,
            cart: cart._id,
            role: role || 'user'
        });

        // Generate JWT token
        const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role
        });

        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    age: user.age,
                    role: user.role,
                    cart: cart._id
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Login user and generate JWT token
 * POST /api/sessions/login
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await User.findOne({ email }).populate('cart');
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Compare password using bcrypt
        const isPasswordValid = user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const token = generateToken({
            id: user._id,
            email: user.email,
            role: user.role
        });

        res.status(200).json({
            status: 'success',
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    age: user.age,
                    role: user.role,
                    cart: user.cart
                },
                token
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current logged user data from JWT
 * GET /api/sessions/current
 * Uses Passport "current" strategy to validate and extract user data
 */
export const current = (req, res, next) => {
    passport.authenticate('current', { session: false }, (error, user, info) => {
        if (error) {
            return res.status(500).json({
                status: 'error',
                message: 'Error validating token',
                error: error.message
            });
        }

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: info?.message || 'Invalid or expired token'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'User validated successfully',
            data: {
                user
            }
        });
    })(req, res, next);
};
