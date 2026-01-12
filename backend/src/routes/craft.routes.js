import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { listCrafts, getCraft, createCraft, updateCraft, deleteCraft } from '../controllers/craft.controller.js';

const router = express.Router();

/**
 * GET /api/crafts
 * List all crafts (public endpoint)
 * Query: { page, limit, search }
 * Returns: [{ id, title, description, price, image, seller_id }]
 */
router.get('/', listCrafts);

/**
 * GET /api/crafts/:id
 * Get single craft details by ID (public endpoint)
 * Returns: { id, title, description, price, stock_quantity, image, seller_id }
 */
router.get('/:id', getCraft);

/**
 * POST /api/crafts
 * Create a new craft (seller only)
 * Protected: Requires JWT token
 * Body: { title, description, price, stock_quantity, image }
 * Returns: { id, title, ... }
 */
router.post('/', authMiddleware, createCraft);

/**
 * PUT /api/crafts/:id
 * Update craft details (owner only)
 * Protected: Requires JWT token, must be craft owner
 * Body: { title, description, price, stock_quantity, image }
 * Returns: { message, craft }
 */
router.put('/:id', authMiddleware, updateCraft);

/**
 * DELETE /api/crafts/:id
 * Delete a craft (owner only)
 * Protected: Requires JWT token, must be craft owner
 * Returns: { message }
 */
router.delete('/:id', authMiddleware, deleteCraft);

export default router;
