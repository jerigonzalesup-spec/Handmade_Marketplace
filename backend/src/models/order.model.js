import db from '../config/database.js';

async function findByUserId(userId) {
	const [rows] = await db.query('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [Number(userId)]);
	return rows;
}

async function create({ userId, items, total, fullName, address, phone, status = 'Pending', date = null }, conn = null) {
	const connection = conn || db;
	const [res] = await connection.query(
		'INSERT INTO orders (userId, total, status) VALUES (?, ?, ?)',
		[Number(userId), Number(total), status]
	);
	const orderId = res.insertId;
	// insert order items
	for (const it of items) {
		await connection.query('INSERT INTO order_items (order_id, craft_id, quantity, price) VALUES (?, ?, ?, ?)', [orderId, Number(it.craftId), Number(it.qty), Number(it.price || 0)]);
	}
	const [rows] = await connection.query('SELECT * FROM orders WHERE id = ? LIMIT 1', [orderId]);
	return rows[0] || null;
}

export { findByUserId, create };
