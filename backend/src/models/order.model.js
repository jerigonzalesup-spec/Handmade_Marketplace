import db from '../config/database.js';

async function findByUserId(userId) {
	// Support both snake_case and camelCase column names depending on DB migration state
	const [rows] = await db.query(
		`SELECT * FROM orders WHERE (user_id = ? OR userId = ?) ORDER BY id DESC`,
		[Number(userId), Number(userId)]
	);
	return rows;
}

async function findBySellerId(sellerId) {
	// crafts may store seller as `seller_id` or `userId`; order_items may use snake_case columns
	const [rows] = await db.query(
		`SELECT DISTINCT o.* FROM orders o
		 JOIN order_items oi ON (oi.order_id = o.id OR oi.orderId = o.id)
		 JOIN crafts c ON (c.id = oi.craft_id OR c.id = oi.craftId)
		 WHERE (c.seller_id = ? OR c.userId = ?)
		 ORDER BY o.id DESC`,
		[Number(sellerId), Number(sellerId)]
	);
	return rows;
}

async function create({ userId, items, total, fullName, address, phone, status = 'Pending', date = null }, conn = null) {
	const connection = conn || db;
	// Use snake_case column names to match canonical schema (user_id, total)
	const [res] = await connection.query(
		'INSERT INTO orders (user_id, total, status, full_name, address, phone) VALUES (?, ?, ?, ?, ?, ?)',
		[Number(userId), Number(total), status, fullName || null, address || null, phone || null]
	);
	const orderId = res.insertId;
	// insert order items
	for (const it of items) {
		await connection.query('INSERT INTO order_items (order_id, craft_id, quantity, price) VALUES (?, ?, ?, ?)', [orderId, Number(it.craftId), Number(it.qty), Number(it.price || 0)]);
	}
	const [rows] = await connection.query('SELECT * FROM orders WHERE id = ? LIMIT 1', [orderId]);
	return rows[0] || null;
}

async function updateStatus(orderId, status) {
	const [res] = await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, Number(orderId)]);
	return res.affectedRows > 0;
}

export { findByUserId, create, findBySellerId, updateStatus };
