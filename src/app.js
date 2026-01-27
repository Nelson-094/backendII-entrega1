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

// Initialize Passport
app.use(passport.initialize());

// Welcome route
app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Ecommerce API with JWT Authentication',
        version: '1.0.0',
        endpoints: {
            sessions: {
                register: 'POST /api/sessions/register',
                login: 'POST /api/sessions/login',
                current: 'GET /api/sessions/current'
            },
            users: {
                getAll: 'GET /api/users',
                getById: 'GET /api/users/:id',
                update: 'PUT /api/users/:id',
                delete: 'DELETE /api/users/:id'
            }
        }
    });
});

// API Routes
app.use('/api', routes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
