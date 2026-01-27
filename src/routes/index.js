import express from 'express';
import sessionsRouter from './sessions.js';
import usersRouter from './users.js';

const router = express.Router();

// Mount routes
router.use('/sessions', sessionsRouter);
router.use('/users', usersRouter);

export default router;
