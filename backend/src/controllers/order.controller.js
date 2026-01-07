import * as Order from '../models/order.model.js';
import * as Craft from '../models/craft.model.js';
import * as Cart from '../models/cart.model.js';
import db from '../config/database.js';

async function getUserOrders(req, res) {
	try {
		if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
		const orders = await Order.findByUserId(req.user.id);
		res.json(orders);
	} catch (err) {
		console.error('[ORDER] getUserOrders error', err);
		res.status(500).json({ error: 'Internal server error' });
	}
}

async function createOrder(req, res) {
	let conn;
	try {
		if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
		const userId = req.user.id;
		const { fullName, address, phone } = req.body || {};

		const items = await Cart.getCart(userId);
		if (!items || items.length === 0) return res.status(400).json({ error: 'Cart is empty' });

		// start transaction
		conn = await db.getConnection();
		await conn.beginTransaction();

		// Validate stock with FOR UPDATE and compute total
		let total = 0;
		for (const it of items) {
			const [rows] = await conn.query('SELECT * FROM crafts WHERE id = ? FOR UPDATE', [it.craftId]);
			const craft = rows[0];
			if (!craft) {
				await conn.rollback();
				return res.status(400).json({ error: `Craft ${it.craftId} not found` });
			}
			if (craft.stock_quantity <= 0) {
				await conn.rollback();
				return res.status(400).json({ error: `Craft ${craft.title} is out of stock` });
			}
			if (it.qty > craft.stock_quantity) {
				await conn.rollback();
				return res.status(400).json({ error: `Not enough stock for ${craft.title}` });
			}
			total += craft.price * it.qty;
		}

		// Deduct stock
		for (const it of items) {
			const ok = await Craft.decrementStock(it.craftId, it.qty, conn);
			if (!ok) {
				await conn.rollback();
				return res.status(400).json({ error: `Failed to deduct stock for item ${it.craftId}` });
			}
		}

		// Create order and order_items
		// include price for each item
		const orderItems = items.map(it => ({ craftId: it.craftId, qty: it.qty, price: it.craft?.price || 0 }));
		const order = await Order.create({ userId, items: orderItems, total, fullName, address, phone, status: 'Pending' }, conn);

		// clear cart
		await conn.query('DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = ?)', [userId]);

		await conn.commit();
		return res.status(201).json(order);
	} catch (err) {
		if (conn) {
			try { await conn.rollback(); } catch (e) {}
		}
		console.error('[ORDER] createOrder error', err);
		return res.status(500).json({ error: 'Internal server error' });
	} finally {
		if (conn) conn.release();
	}
}

export { getUserOrders, createOrder };
