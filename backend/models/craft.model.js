import db from '../config/database.js';




async function findAll() {
	const [rows] = await db.query('SELECT * FROM crafts ORDER BY id');
	return rows;
}

async function create({ title, description, price, userId, stock = 0, image = null }) {
	const [res] = await db.query(
		'INSERT INTO crafts (title, description, price, stock_quantity, image, seller_id) VALUES (?, ?, ?, ?, ?, ?)',
		[title, description, Number(price), Number(stock), image, Number(userId)]
	);
	const id = res.insertId;
	const [rows] = await db.query('SELECT * FROM crafts WHERE id = ? LIMIT 1', [id]);
	return rows[0] || null;
}

async function findById(id) {
	const [rows] = await db.query('SELECT * FROM crafts WHERE id = ? LIMIT 1', [Number(id)]);
	return rows[0] || null;
}

async function update(id, { title, description, price, stock, image }) {
	const fields = [];
	const vals = [];
	if (title !== undefined) { fields.push('title = ?'); vals.push(title); }
	if (description !== undefined) { fields.push('description = ?'); vals.push(description); }
	if (price !== undefined) { fields.push('price = ?'); vals.push(Number(price)); }
	if (stock !== undefined) { fields.push('stock_quantity = ?'); vals.push(Number(stock)); }
	if (image !== undefined) { fields.push('image = ?'); vals.push(image); }
	if (fields.length === 0) return findById(id);
	vals.push(Number(id));
	await db.query(`UPDATE crafts SET ${fields.join(', ')} WHERE id = ?`, vals);
	return findById(id);
}

async function remove(id) {
	const [res] = await db.query('DELETE FROM crafts WHERE id = ?', [Number(id)]);
	return res.affectedRows > 0;
}

async function decrementStock(craftId, qty, conn = null) {
	const connection = conn || db;
	// Use transaction connection if provided
	const [rows] = await connection.query('SELECT stock_quantity FROM crafts WHERE id = ? LIMIT 1', [Number(craftId)]);
	const c = rows[0];
	if (!c) return false;
	if (c.stock_quantity < qty) return false;
	await connection.query('UPDATE crafts SET stock_quantity = stock_quantity - ? WHERE id = ?', [Number(qty), Number(craftId)]);
	return true;
}

export { findAll, create, findById, update, remove, decrementStock };
