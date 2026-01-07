import db from '../src/config/database.js';
import * as User from '../src/models/user.model.js';
import * as Craft from '../src/models/craft.model.js';
import * as Order from '../src/models/order.model.js';

async function run() {
  try {
    const demoEmail = 'demo@craftly.test';
    const user = await User.findByEmail(demoEmail);
    if (!user) {
      console.error('Demo user not found');
      process.exit(1);
    }
    console.log('Demo user', user.id);

    let crafts = await Craft.findAll();
    if (!Array.isArray(crafts) || crafts.length === 0) {
      console.log('No crafts found — inserting a sample craft');
      const [res] = await db.query('INSERT INTO crafts (userId, title, description, price, stock_quantity) VALUES (?, ?, ?, ?, ?)', [user.id, 'Sample Craft', 'Auto-inserted sample', 150.00, 5]);
      const insertId = res.insertId;
      crafts = await Craft.findAll();
      console.log('Inserted craft id', insertId);
    }

    const craft = crafts[0];
    console.log('Using craft', craft.id, 'stock', craft.stock_quantity);

    // decrement stock by 1
    const ok = await Craft.decrementStock(craft.id, 1);
    console.log('decrementStock ok?', ok);

    // Insert order using current schema (userId column)
    const [oRes] = await db.query('INSERT INTO orders (userId, total, status, createdAt) VALUES (?, ?, ?, NOW())', [user.id, craft.price, 'Pending']);
    const orderId = oRes.insertId;
    await db.query('INSERT INTO order_items (order_id, craft_id, quantity, price) VALUES (?, ?, ?, ?)', [orderId, craft.id, 1, craft.price]);
    console.log('Created order id', orderId);

    process.exit(0);
  } catch (err) {
    console.error('manual_order_test error', err);
    process.exit(1);
  }
}

run();
