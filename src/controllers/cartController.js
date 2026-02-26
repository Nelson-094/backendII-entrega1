import CartRepository from '../repositories/CartRepository.js';
import CartDTO from '../dto/CartDTO.js';

const cartRepository = new CartRepository();

/**
 * Obtener carrito por ID
 * GET /api/carts/:cid
 */
export const getCart = async (req, res, next) => {
    try {
        const cart = await cartRepository.getById(req.params.cid);
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Crear carrito
 * POST /api/carts
 */
export const createCart = async (req, res, next) => {
    try {
        const cart = await cartRepository.create();
        res.status(201).json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Agregar producto al carrito (solo user)
 * POST /api/carts/:cid/product/:pid
 */
export const addProduct = async (req, res, next) => {
    try {
        const cart = await cartRepository.addProduct(req.params.cid, req.params.pid);
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Eliminar producto del carrito
 * DELETE /api/carts/:cid/product/:pid
 */
export const removeProduct = async (req, res, next) => {
    try {
        const cart = await cartRepository.removeProduct(req.params.cid, req.params.pid);
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Actualizar cantidad de un producto en el carrito
 * PUT /api/carts/:cid/product/:pid
 */
export const updateProductQuantity = async (req, res, next) => {
    try {
        const cart = await cartRepository.updateProductQuantity(
            req.params.cid,
            req.params.pid,
            req.body.quantity
        );
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Actualizar todos los productos del carrito
 * PUT /api/carts/:cid
 */
export const updateAllProducts = async (req, res, next) => {
    try {
        const cart = await cartRepository.updateAllProducts(req.params.cid, req.body.products);
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Vaciar carrito
 * DELETE /api/carts/:cid
 */
export const clearCart = async (req, res, next) => {
    try {
        const cart = await cartRepository.clearCart(req.params.cid);
        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Finalizar compra del carrito
 * POST /api/carts/:cid/purchase
 */
export const purchase = async (req, res, next) => {
    try {
        const result = await cartRepository.purchase(req.params.cid, req.user.email);
        res.json({
            status: 'success',
            message: 'Compra realizada exitosamente',
            payload: {
                ticket: result.ticket,
                productsNotProcessed: result.productsNotProcessed
            }
        });
    } catch (error) {
        next(error);
    }
};
