import express from 'express';
import {
    getCart,
    createCart,
    addProduct,
    removeProduct,
    updateProductQuantity,
    updateAllProducts,
    clearCart,
    purchase
} from '../controllers/cartController.js';
import { authenticate, isUser } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/carts/:cid
 * @desc    Obtener carrito por ID
 * @access  Usuario autenticado
 */
router.get('/:cid', authenticate, getCart);

/**
 * @route   POST /api/carts
 * @desc    Crear nuevo carrito
 * @access  Usuario autenticado
 */
router.post('/', authenticate, createCart);

/**
 * @route   POST /api/carts/:cid/product/:pid
 * @desc    Agregar producto al carrito
 * @access  Solo Usuario (no admin)
 */
router.post('/:cid/product/:pid', authenticate, isUser, addProduct);

/**
 * @route   DELETE /api/carts/:cid/product/:pid
 * @desc    Eliminar producto del carrito
 * @access  Usuario autenticado
 */
router.delete('/:cid/product/:pid', authenticate, removeProduct);

/**
 * @route   PUT /api/carts/:cid/product/:pid
 * @desc    Actualizar cantidad de un producto en el carrito
 * @access  Usuario autenticado
 */
router.put('/:cid/product/:pid', authenticate, updateProductQuantity);

/**
 * @route   PUT /api/carts/:cid
 * @desc    Actualizar todos los productos del carrito
 * @access  Usuario autenticado
 */
router.put('/:cid', authenticate, updateAllProducts);

/**
 * @route   DELETE /api/carts/:cid
 * @desc    Vaciar carrito
 * @access  Usuario autenticado
 */
router.delete('/:cid', authenticate, clearCart);

/**
 * @route   POST /api/carts/:cid/purchase
 * @desc    Finalizar compra del carrito
 * @access  Usuario autenticado
 */
router.post('/:cid/purchase', authenticate, isUser, purchase);

export default router;
