import express from 'express';
import { register, login, me, becomeSeller } from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Create a new user account
 * Body: { email, password, name }
 * Returns: { token, user }
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Authenticate user and receive JWT token
 * Body: { email, password }
 * Returns: { token, user }
 */
router.post('/login', login);

/**
 * GET /api/auth/me
 * Get current authenticated user profile
 * Protected: Requires JWT token in Authorization header (Bearer <token>)
 * Returns: { id, email, name, role }
 */
router.get('/me', authMiddleware, me);

/**
 * POST /api/auth/me/become-seller
 * Upgrade user account to seller role
 * Protected: Requires JWT token in Authorization header
 * Returns: { message, user }
 */
router.post('/me/become-seller', authMiddleware, becomeSeller);

export default router;
