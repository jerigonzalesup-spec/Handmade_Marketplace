import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import * as Cart from '../models/cart.model.js';
import * as Craft from '../models/craft.model.js';

const router = express.Router();

// GET /api/cart  (protected)
router.get('/', authMiddleware, async (req, res) => {
	try {
		const items = await Cart.getCart(req.user.id);
		res.json(items);
	} catch (err) {
		console.error('[CART] get error', err);
		res.status(500).json({ error: 'Failed to load cart' });
	}
});

// POST /api/cart  (protected) - set cart items
router.post('/', authMiddleware, async (req, res) => {
	try {
		const items = req.body.items || [];
		// basic validation
		for (const it of items) {
			if (!it.craftId || !it.qty || it.qty <= 0) return res.status(400).json({ error: 'Invalid cart item' });
			const craft = await Craft.findById(it.craftId);
			if (!craft) return res.status(400).json({ error: `Craft ${it.craftId} not found` });
			if (it.qty > craft.stock_quantity) return res.status(400).json({ error: `Not enough stock for ${craft.title}` });
		}
		const cart = await Cart.setCart(req.user.id, items);
		res.json(cart);
	} catch (err) {
		console.error('[CART] set error', err);
		res.status(500).json({ error: 'Failed to set cart' });
	}
});

export default router;
