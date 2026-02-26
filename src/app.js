import express from 'express';
import cors from 'cors';
import passport from './config/passport.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inicializar Passport
app.use(passport.initialize());

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'E-commerce API - Desarrollo Avanzado Backend',
        version: '2.0.0',
        endpoints: {
            sessions: {
                register: 'POST /api/sessions/register',
                login: 'POST /api/sessions/login',
                current: 'GET /api/sessions/current',
                forgotPassword: 'POST /api/sessions/forgot-password',
                resetPassword: 'POST /api/sessions/reset-password'
            },
            users: {
                getAll: 'GET /api/users (Admin)',
                getById: 'GET /api/users/:id',
                update: 'PUT /api/users/:id',
                delete: 'DELETE /api/users/:id (Admin)'
            },
            products: {
                getAll: 'GET /api/products',
                getById: 'GET /api/products/:pid',
                create: 'POST /api/products (Admin)',
                update: 'PUT /api/products/:pid (Admin)',
                delete: 'DELETE /api/products/:pid (Admin)'
            },
            carts: {
                getCart: 'GET /api/carts/:cid',
                createCart: 'POST /api/carts',
                addProduct: 'POST /api/carts/:cid/product/:pid (User)',
                removeProduct: 'DELETE /api/carts/:cid/product/:pid',
                updateQuantity: 'PUT /api/carts/:cid/product/:pid',
                updateAll: 'PUT /api/carts/:cid',
                clearCart: 'DELETE /api/carts/:cid',
                purchase: 'POST /api/carts/:cid/purchase (User)'
            }
        }
    });
});

// Rutas de la API
app.use('/api', routes);

// Manejador 404
app.use(notFound);

// Manejador de errores
app.use(errorHandler);

export default app;
