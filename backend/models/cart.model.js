import db from '../config/database.js';





async function getCart(userId) {
  const [rows] = await db.query(
    `SELECT ci.craft_id AS craftId, ci.quantity AS qty, c.*
     FROM cart_items ci
     JOIN crafts c ON c.id = ci.craft_id
     WHERE ci.cart_id = (SELECT id FROM carts WHERE user_id = ? LIMIT 1)`,
    [Number(userId)]
  );
  return rows.map(r => ({ craftId: r.craftId, qty: r.qty, craft: r }));
}

async function setCart(userId, items) {
  const uid = Number(userId);
  // Replace user's cart items
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    // Ensure a cart exists for this user
    const [carts] = await conn.query('SELECT id FROM carts WHERE user_id = ?', [uid]);
    let cartId = carts[0]?.id;
    if (!cartId) {
      const [res] = await conn.query('INSERT INTO carts (user_id) VALUES (?)', [uid]);
      cartId = res.insertId;
    }
    // Clear and insert items
    await conn.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);
    for (const it of items) {
      await conn.query('INSERT INTO cart_items (cart_id, craft_id, quantity) VALUES (?, ?, ?)', [cartId, Number(it.craftId), Number(it.qty)]);
    }
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
  return getCart(uid);
}

async function clearCart(userId) {
  const uid = Number(userId);
  const [res] = await db.query('DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = ?)', [uid]);
  return res.affectedRows;
}

export { getCart, setCart, clearCart };
// placeholder
