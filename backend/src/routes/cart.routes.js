import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import * as Cart from '../models/cart.model.js';
import * as Craft from '../models/craft.model.js';

const router = express.Router();

/**
 * GET /api/cart
 * Get all items in user's shopping cart
 * Protected: Requires JWT token
 * Returns: [{ craftId, title, price, qty, ... }]
 */
router.get('/', authMiddleware, async (req, res) => {
	try {
		const items = await Cart.getCart(req.user.id);
		res.json(items);
	} catch (err) {
		console.error('[CART] get error', err);
		res.status(500).json({ error: 'Failed to load cart' });
	}
});

/**
 * POST /api/cart/items
 * Add a craft to cart or increment quantity
 * Protected: Requires JWT token
 * Body: { craftId, qty }
 * Returns: [{ craftId, qty, ... }]
 */
router.post('/items', authMiddleware, async (req, res) => {
	try {
		const userId = req.user.id;
		const { craftId, qty } = req.body || {};
		if (!craftId || !qty || qty <= 0) return res.status(400).json({ error: 'Invalid item' });

		const items = await Cart.getCart(userId);
		const existing = items.find(i => Number(i.craftId) === Number(craftId));
		const currentQty = existing ? existing.qty : 0;

		const craft = await Craft.findById(craftId);
		if (!craft) return res.status(400).json({ error: 'Craft not found' });
		if (currentQty + qty > (craft.stock_quantity ?? craft.stock ?? 0)) return res.status(400).json({ error: 'Not enough stock' });

		const newItems = items.map(i => ({ craftId: i.craftId, qty: i.qty }));
		if (existing) {
			for (const it of newItems) if (Number(it.craftId) === Number(craftId)) it.qty = currentQty + qty;
		} else {
			newItems.push({ craftId: Number(craftId), qty: Number(qty) });
		}

		const cart = await Cart.setCart(userId, newItems);
		res.json(cart);
	} catch (err) {
		console.error('[CART] POST /items error', err);
		res.status(500).json({ error: 'Failed to add item' });
	}
});

/**
 * PUT /api/cart/items/:id
 * Update quantity for a craft in cart
 * Protected: Requires JWT token
 * Params: id (craftId)
 * Body: { qty } (set to 0 to remove from cart)
 * Returns: [{ craftId, qty, ... }]
 */
router.put('/items/:id', authMiddleware, async (req, res) => {
	try {
		const userId = req.user.id;
		const craftId = req.params.id;
		const { qty } = req.body || {};
		if (!craftId) return res.status(400).json({ error: 'Invalid craft id' });
		if (qty == null || qty < 0) return res.status(400).json({ error: 'Invalid qty' });

		const craft = await Craft.findById(craftId);
		if (!craft) return res.status(400).json({ error: 'Craft not found' });
		if (qty > (craft.stock_quantity ?? craft.stock ?? 0)) return res.status(400).json({ error: 'Not enough stock' });

		const items = await Cart.getCart(userId);
		const newItems = items.filter(i => Number(i.craftId) !== Number(craftId)).map(i => ({ craftId: i.craftId, qty: i.qty }));
		if (qty > 0) newItems.push({ craftId: Number(craftId), qty: Number(qty) });

		const cart = await Cart.setCart(userId, newItems);
		res.json(cart);
	} catch (err) {
		console.error('[CART] PUT /items/:id error', err);
		res.status(500).json({ error: 'Failed to update item' });
	}
});

/**
 * DELETE /api/cart/items/:id
 * Remove a craft from cart completely
 * Protected: Requires JWT token
 * Params: id (craftId)
 * Returns: [{ craftId, qty, ... }]
 */
router.delete('/items/:id', authMiddleware, async (req, res) => {
	try {
		const userId = req.user.id;
		const craftId = req.params.id;
		if (!craftId) return res.status(400).json({ error: 'Invalid craft id' });

		const items = await Cart.getCart(userId);
		const newItems = items.filter(i => Number(i.craftId) !== Number(craftId)).map(i => ({ craftId: i.craftId, qty: i.qty }));
		const cart = await Cart.setCart(userId, newItems);
		res.json(cart);
	} catch (err) {
		console.error('[CART] DELETE /items/:id error', err);
		res.status(500).json({ error: 'Failed to remove item' });
	}
});

/**
 * POST /api/cart/add
 * Add or increment a single item (compatibility endpoint)
 * Protected: Requires JWT token
 * Body: { craftId, qty }
 * Returns: [{ craftId, qty, ... }]
 */
router.post('/add', authMiddleware, async (req, res) => {
	// reuse logic from /item
	try {
		const userId = req.user.id;
		const { craftId, qty } = req.body || {};
		if (!craftId || !qty || qty <= 0) return res.status(400).json({ error: 'Invalid item' });

		const items = await Cart.getCart(userId);
		const existing = items.find(i => Number(i.craftId) === Number(craftId));
		const currentQty = existing ? existing.qty : 0;

		const craft = await Craft.findById(craftId);
		if (!craft) return res.status(400).json({ error: 'Craft not found' });
		if (currentQty + qty > craft.stock_quantity) return res.status(400).json({ error: 'Not enough stock' });

		const newItems = items.map(i => ({ craftId: i.craftId, qty: i.qty }));
		if (existing) {
			for (const it of newItems) if (Number(it.craftId) === Number(craftId)) it.qty = currentQty + qty;
		} else {
			newItems.push({ craftId: Number(craftId), qty: Number(qty) });
		}

		const cart = await Cart.setCart(userId, newItems);
		res.json(cart);
	} catch (err) {
		console.error('[CART] add error', err);
		res.status(500).json({ error: 'Failed to add item' });
	}
});

// PUT /api/cart/update  (protected) - update quantity (body: { craftId, qty })
router.put('/update', authMiddleware, async (req, res) => {
	try {
		const userId = req.user.id;
		const { craftId, qty } = req.body || {};
		if (!craftId) return res.status(400).json({ error: 'Invalid craft id' });
		if (qty == null || qty < 0) return res.status(400).json({ error: 'Invalid qty' });

		const items = await Cart.getCart(userId);
		const craft = await Craft.findById(craftId);
		if (!craft) return res.status(400).json({ error: 'Craft not found' });
		if (qty > craft.stock_quantity) return res.status(400).json({ error: 'Not enough stock' });

		const newItems = items.filter(i => Number(i.craftId) !== Number(craftId)).map(i => ({ craftId: i.craftId, qty: i.qty }));
		if (qty > 0) newItems.push({ craftId: Number(craftId), qty: Number(qty) });

		const cart = await Cart.setCart(userId, newItems);
		res.json(cart);
	} catch (err) {
		console.error('[CART] update error', err);
		res.status(500).json({ error: 'Failed to update cart' });
	}
});

// DELETE /api/cart/remove  (protected) - remove item (body: { craftId })
router.delete('/remove', authMiddleware, async (req, res) => {
	try {
		const userId = req.user.id;
		const { craftId } = req.body || {};
		if (!craftId) return res.status(400).json({ error: 'Invalid craft id' });

		const items = await Cart.getCart(userId);
		const newItems = items.filter(i => Number(i.craftId) !== Number(craftId)).map(i => ({ craftId: i.craftId, qty: i.qty }));
		const cart = await Cart.setCart(userId, newItems);
		res.json(cart);
	} catch (err) {
		console.error('[CART] remove error', err);
		res.status(500).json({ error: 'Failed to remove item' });
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

// POST /api/cart/item  (protected) - add or increment a single item
router.post('/item', authMiddleware, async (req, res) => {
	try {
		const userId = req.user.id;
		const { craftId, qty } = req.body || {};
		if (!craftId || !qty || qty <= 0) return res.status(400).json({ error: 'Invalid item' });

		// load existing items
		const items = await Cart.getCart(userId);
		const existing = items.find(i => Number(i.craftId) === Number(craftId));
		const currentQty = existing ? existing.qty : 0;

		// validate stock
		const craft = await Craft.findById(craftId);
		if (!craft) return res.status(400).json({ error: 'Craft not found' });
		if (currentQty + qty > craft.stock_quantity) return res.status(400).json({ error: 'Not enough stock' });

		const newItems = items.map(i => ({ craftId: i.craftId, qty: i.qty }));
		if (existing) {
			for (const it of newItems) if (Number(it.craftId) === Number(craftId)) it.qty = currentQty + qty;
		} else {
			newItems.push({ craftId: Number(craftId), qty: Number(qty) });
		}

		const cart = await Cart.setCart(userId, newItems);
		res.json(cart);
	} catch (err) {
		console.error('[CART] add item error', err);
		res.status(500).json({ error: 'Failed to add item' });
	}
});

// PUT /api/cart/:craftId  (protected) - update quantity for a craft in cart
router.put('/:craftId', authMiddleware, async (req, res) => {
	try {
		const userId = req.user.id;
		const craftId = req.params.craftId;
		const { qty } = req.body || {};
		if (!craftId) return res.status(400).json({ error: 'Invalid craft id' });
		if (qty == null || qty < 0) return res.status(400).json({ error: 'Invalid qty' });

		const items = await Cart.getCart(userId);
		const craft = await Craft.findById(craftId);
		if (!craft) return res.status(400).json({ error: 'Craft not found' });
		if (qty > craft.stock_quantity) return res.status(400).json({ error: 'Not enough stock' });

		const newItems = items.filter(i => Number(i.craftId) !== Number(craftId)).map(i => ({ craftId: i.craftId, qty: i.qty }));
		if (qty > 0) newItems.push({ craftId: Number(craftId), qty: Number(qty) });

		const cart = await Cart.setCart(userId, newItems);
		res.json(cart);
	} catch (err) {
		console.error('[CART] update item error', err);
		res.status(500).json({ error: 'Failed to update item' });
	}
});

// DELETE /api/cart/:craftId  (protected) - remove an item from cart
router.delete('/:craftId', authMiddleware, async (req, res) => {
	try {
		const userId = req.user.id;
		const craftId = req.params.craftId;
		if (!craftId) return res.status(400).json({ error: 'Invalid craft id' });

		const items = await Cart.getCart(userId);
		const newItems = items.filter(i => Number(i.craftId) !== Number(craftId)).map(i => ({ craftId: i.craftId, qty: i.qty }));
		const cart = await Cart.setCart(userId, newItems);
		res.json(cart);
	} catch (err) {
		console.error('[CART] delete item error', err);
		res.status(500).json({ error: 'Failed to remove item' });
	}
});

export default router;
