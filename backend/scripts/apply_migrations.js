// ARCHIVED: original backend script moved to archive/archived_2026-01-08/backend_scripts/apply_migrations.js
// See archive/archived_2026-01-08/backend_scripts/apply_migrations.js for original content.


async function run() {
  try {
    console.log('[MIGRATE] Starting idempotent migrations on', (await db.query('SELECT DATABASE()'))[0][0]['DATABASE()']);

    // USERS
    if (!await tableExists('users')) {
      console.log('[MIGRATE] Creating table users');
      await db.query(`
        CREATE TABLE users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255),
          email VARCHAR(255) NOT NULL UNIQUE,
          password_hash VARCHAR(255),
          role ENUM('buyer','seller','admin') DEFAULT 'buyer',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
    } else {
      if (!await columnExists('users', 'password_hash')) {
        console.log('[MIGRATE] Adding column users.password_hash');
        await db.query('ALTER TABLE users ADD COLUMN password_hash VARCHAR(255)');
      }
      if (!await columnExists('users', 'role')) {
        console.log('[MIGRATE] Adding column users.role');
        await db.query("ALTER TABLE users ADD COLUMN role ENUM('buyer','seller','admin') DEFAULT 'buyer'");
      }
    }

    // CRAFTS
    if (!await tableExists('crafts')) {
      console.log('[MIGRATE] Creating table crafts');
      await db.query(`
        CREATE TABLE crafts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          seller_id INT NOT NULL,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          stock_quantity INT NOT NULL DEFAULT 0,
          image_url VARCHAR(1024),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
    } else {
      if (!await columnExists('crafts', 'stock_quantity')) {
        console.log('[MIGRATE] Adding column crafts.stock_quantity');
        await db.query('ALTER TABLE crafts ADD COLUMN stock_quantity INT NOT NULL DEFAULT 0');
      }
      if (!await columnExists('crafts', 'image_url')) {
        console.log('[MIGRATE] Adding column crafts.image_url');
        await db.query('ALTER TABLE crafts ADD COLUMN image_url VARCHAR(1024)');
      }
      // ensure price column type
      // Note: altering column type may fail on some setups; we attempt safely
      try {
        await db.query('ALTER TABLE crafts MODIFY COLUMN price DECIMAL(12,2) NOT NULL DEFAULT 0.00');
      } catch (err) {
        console.warn('[MIGRATE] Could not modify crafts.price type:', err.message);
      }
    }

    // CARTS & CART_ITEMS
    if (!await tableExists('carts')) {
      console.log('[MIGRATE] Creating table carts');
      await db.query(`
        CREATE TABLE carts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL UNIQUE,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
    }

    if (!await tableExists('cart_items')) {
      console.log('[MIGRATE] Creating table cart_items');
      await db.query(`
        CREATE TABLE cart_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          cart_id INT NOT NULL,
          craft_id INT NOT NULL,
          quantity INT NOT NULL DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY cart_item_unique (cart_id, craft_id),
          FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
          FOREIGN KEY (craft_id) REFERENCES crafts(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
    }

    // ORDERS & ORDER_ITEMS
    if (!await tableExists('orders')) {
      console.log('[MIGRATE] Creating table orders');
      await db.query(`
        CREATE TABLE orders (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          total_amount DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          status VARCHAR(50) DEFAULT 'Pending',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
    }

    if (!await tableExists('order_items')) {
      console.log('[MIGRATE] Creating table order_items');
      await db.query(`
        CREATE TABLE order_items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          order_id INT NOT NULL,
          craft_id INT NOT NULL,
          quantity INT NOT NULL DEFAULT 1,
          price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
          FOREIGN KEY (craft_id) REFERENCES crafts(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
    }

    // Indexes
    try {
      await db.query('CREATE INDEX idx_crafts_seller ON crafts(seller_id)');
    } catch (e) {}
    try {
      await db.query('CREATE INDEX idx_cartitems_cart ON cart_items(cart_id)');
    } catch (e) {}
    try {
      await db.query('CREATE INDEX idx_orderitems_order ON order_items(order_id)');
    } catch (e) {}

    // Password migration: copy bcrypt-like password -> password_hash if password_hash empty
    const [pwdCols] = await db.query("SHOW COLUMNS FROM users LIKE 'password' ");
    if (pwdCols.length > 0) {
      console.log('[MIGRATE] users.password column exists — checking for bcrypt values to copy to password_hash');
      const [rows] = await db.query(
        "SELECT id, password FROM users WHERE password_hash IS NULL AND password IS NOT NULL LIMIT 1000"
      );
      let copied = 0;
      for (const r of rows) {
        const p = r.password;
        if (typeof p === 'string' && (p.startsWith('$2a$') || p.startsWith('$2b$') || p.startsWith('$2y$'))) {
          await db.query('UPDATE users SET password_hash = ? WHERE id = ?', [p, r.id]);
          copied++;
        }
      }
      console.log(`[MIGRATE] Copied ${copied} bcrypt passwords into password_hash (if present)`);
    }

    console.log('[MIGRATE] Migrations complete');
    process.exit(0);
  } catch (err) {
    console.error('[MIGRATE] Migration failed:', err);
    process.exit(1);
  }
}

run();
