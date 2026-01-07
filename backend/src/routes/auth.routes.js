import express from 'express';
import { register, login, me } from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// POST /auth/register
router.post('/register', register);

// POST /auth/login
router.post('/login', login);

// GET /auth/me (protected)
router.get('/me', authMiddleware, me);

export default router;
