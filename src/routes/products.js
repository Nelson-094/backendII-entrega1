import express from 'express';
import { getAll, getById, create, update, deleteProduct } from '../controllers/productController.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Obtener todos los productos (público, con paginación)
 * @access  Público
 */
router.get('/', getAll);

/**
 * @route   GET /api/products/:pid
 * @desc    Obtener producto por ID
 * @access  Público
 */
router.get('/:pid', getById);

/**
 * @route   POST /api/products
 * @desc    Crear producto
 * @access  Solo Admin
 */
router.post('/', authenticate, isAdmin, create);

/**
 * @route   PUT /api/products/:pid
 * @desc    Actualizar producto
 * @access  Solo Admin
 */
router.put('/:pid', authenticate, isAdmin, update);

/**
 * @route   DELETE /api/products/:pid
 * @desc    Eliminar producto
 * @access  Solo Admin
 */
router.delete('/:pid', authenticate, isAdmin, deleteProduct);

export default router;
