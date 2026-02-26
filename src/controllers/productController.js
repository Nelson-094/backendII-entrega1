import ProductRepository from '../repositories/ProductRepository.js';
import ProductDTO from '../dto/ProductDTO.js';

const productRepository = new ProductRepository();

/**
 * Obtener todos los productos (con paginación)
 * GET /api/products
 */
export const getAll = async (req, res, next) => {
    try {
        const result = await productRepository.getAll(req.query);
        res.json({
            status: 'success',
            payload: result
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obtener producto por ID
 * GET /api/products/:pid
 */
export const getById = async (req, res, next) => {
    try {
        const product = await productRepository.getById(req.params.pid);
        const productDTO = new ProductDTO(product);
        res.json({
            status: 'success',
            payload: productDTO
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Crear producto (solo admin)
 * POST /api/products
 */
export const create = async (req, res, next) => {
    try {
        const product = await productRepository.create(req.body);
        const productDTO = new ProductDTO(product);
        res.status(201).json({
            status: 'success',
            payload: productDTO
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Actualizar producto (solo admin)
 * PUT /api/products/:pid
 */
export const update = async (req, res, next) => {
    try {
        const product = await productRepository.update(req.params.pid, req.body);
        const productDTO = new ProductDTO(product);
        res.json({
            status: 'success',
            payload: productDTO
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Eliminar producto (solo admin)
 * DELETE /api/products/:pid
 */
export const deleteProduct = async (req, res, next) => {
    try {
        await productRepository.delete(req.params.pid);
        res.json({
            status: 'success',
            message: 'Producto eliminado correctamente'
        });
    } catch (error) {
        next(error);
    }
};
