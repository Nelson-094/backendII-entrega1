import express from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { authenticate, isAdmin, isOwnerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Protected (Admin only)
 */
router.get('/', authenticate, isAdmin, getAllUsers);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Protected (Authenticated users)
 */
router.get('/:id', authenticate, getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Protected (Owner or Admin)
 */
router.put('/:id', authenticate, isOwnerOrAdmin, updateUser);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Protected (Admin only)
 */
router.delete('/:id', authenticate, isAdmin, deleteUser);

export default router;
