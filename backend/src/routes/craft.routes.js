import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { listCrafts, getCraft, createCraft, updateCraft, deleteCraft } from '../controllers/craft.controller.js';

const router = express.Router();

// GET /api/crafts/  (public)
router.get('/', listCrafts);
// GET /api/crafts/:id (public)
router.get('/:id', getCraft);

// POST /api/crafts/  (protected)
router.post('/', authMiddleware, createCraft);

// PUT /api/crafts/:id (protected, owner only)
router.put('/:id', authMiddleware, updateCraft);

// DELETE /api/crafts/:id (protected, owner only)
router.delete('/:id', authMiddleware, deleteCraft);

export default router;
