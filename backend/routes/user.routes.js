import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { me } from '../controllers/auth.controller.js';

const router = express.Router();

// GET /api/users/me (protected)
router.get('/me', authMiddleware, me);

export default router;
