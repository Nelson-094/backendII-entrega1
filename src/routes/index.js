import express from 'express';
import sessionsRouter from './sessions.js';
import usersRouter from './users.js';
import productsRouter from './products.js';
import cartsRouter from './carts.js';

const router = express.Router();

// Montar rutas
router.use('/sessions', sessionsRouter);
router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/carts', cartsRouter);

export default router;
