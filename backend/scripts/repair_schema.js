import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

async function tableExists(conn, table) {
  const [rows] = await conn.query('SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?', [table]);
  return rows.length > 0;
}

async function columnExists(conn, table, column) {
  const [rows] = await conn.query("SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?", [table, column]);
  return rows.length > 0;
}

async function run() {
  const host = process.env.MYSQL_HOST || '127.0.0.1';
  const port = Number(process.env.MYSQL_PORT || 3306);
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || '';

  console.log('[REPAIR] Connecting to MySQL', host + ':' + port, 'as', user);
  const conn = await mysql.createConnection({ host, port, user, password, multipleStatements: true });

  try {
    // Ensure database exists and use it
    const dbName = process.env.MYSQL_DATABASE || 'craftly_db';
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await conn.query(`USE \`${dbName}\``);

    // Desired schema objects: tables and required columns
    const tasks = [];

    // USERS
    tasks.push(async () => {
      const t = 'users';
      if (!await tableExists(conn, t)) {
        console.log('[REPAIR] Creating table users');
        await conn.query(`
          CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) DEFAULT NULL,
            password VARCHAR(255) DEFAULT NULL,
            name VARCHAR(255) DEFAULT NULL,
            role ENUM('buyer','seller','admin') DEFAULT 'buyer',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
      } else {
        // add missing columns
        for (const col of ['password_hash','password','name','role','created_at']) {
          if (!await columnExists(conn, t, col)) {
            console.log(`[REPAIR] Adding column users.${col}`);
            let sql;
            if (col === 'password_hash' || col === 'password') sql = `ALTER TABLE users ADD COLUMN ${col} VARCHAR(255)`;
            else if (col === 'name') sql = `ALTER TABLE users ADD COLUMN name VARCHAR(255) DEFAULT NULL`;
            else if (col === 'role') sql = `ALTER TABLE users ADD COLUMN role ENUM('buyer','seller','admin') DEFAULT 'buyer'`;
            else if (col === 'created_at') sql = `ALTER TABLE users ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP`;
            try { await conn.query(sql); } catch (e) { console.warn('[REPAIR] Could not add users.'+col+':', e.message); }
          }
        }
      }
    });

    // CRAFTS (products)
    tasks.push(async () => {
      const t = 'crafts';
      if (!await tableExists(conn, t)) {
        console.log('[REPAIR] Creating table crafts');
        await conn.query(`
          CREATE TABLE crafts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(12,2) NOT NULL DEFAULT 0.00,
            stock_quantity INT NOT NULL DEFAULT 0,
            image VARCHAR(1024) DEFAULT NULL,
            seller_id INT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
      } else {
        for (const col of ['title','description','price','stock_quantity','image','seller_id','created_at']) {
          if (!await columnExists(conn, t, col)) {
            console.log(`[REPAIR] Adding column crafts.${col}`);
            let sql;
            if (col === 'title') sql = `ALTER TABLE crafts ADD COLUMN title VARCHAR(255) NOT NULL`;
            else if (col === 'description') sql = `ALTER TABLE crafts ADD COLUMN description TEXT`;
            else if (col === 'price') sql = `ALTER TABLE crafts ADD COLUMN price DECIMAL(12,2) NOT NULL DEFAULT 0.00`;
            else if (col === 'stock_quantity') sql = `ALTER TABLE crafts ADD COLUMN stock_quantity INT NOT NULL DEFAULT 0`;
            else if (col === 'image') sql = `ALTER TABLE crafts ADD COLUMN image VARCHAR(1024) DEFAULT NULL`;
            else if (col === 'seller_id') sql = `ALTER TABLE crafts ADD COLUMN seller_id INT NOT NULL`;
            else if (col === 'created_at') sql = `ALTER TABLE crafts ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP`;
            try { await conn.query(sql); } catch (e) { console.warn('[REPAIR] Could not add crafts.'+col+':', e.message); }
          }
        }
      }
    });

    // CARTS
    tasks.push(async () => {
      const t = 'carts';
      if (!await tableExists(conn, t)) {
        console.log('[REPAIR] Creating table carts');
        await conn.query(`
          CREATE TABLE carts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL UNIQUE,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
      } else {
        for (const col of ['user_id','created_at']) {
          if (!await columnExists(conn, t, col)) {
            console.log(`[REPAIR] Adding column carts.${col}`);
            let sql = col === 'user_id' ? `ALTER TABLE carts ADD COLUMN user_id INT NOT NULL UNIQUE` : `ALTER TABLE carts ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP`;
            try { await conn.query(sql); } catch (e) { console.warn('[REPAIR] Could not add carts.'+col+':', e.message); }
          }
        }
      }
    });

    // CART_ITEMS
    tasks.push(async () => {
      const t = 'cart_items';
      if (!await tableExists(conn, t)) {
        console.log('[REPAIR] Creating table cart_items');
        await conn.query(`
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
      } else {
        for (const col of ['cart_id','craft_id','quantity','created_at']) {
          if (!await columnExists(conn, t, col)) {
            console.log(`[REPAIR] Adding column cart_items.${col}`);
            let sql;
            if (col === 'cart_id') sql = `ALTER TABLE cart_items ADD COLUMN cart_id INT NOT NULL`;
            else if (col === 'craft_id') sql = `ALTER TABLE cart_items ADD COLUMN craft_id INT NOT NULL`;
            else if (col === 'quantity') sql = `ALTER TABLE cart_items ADD COLUMN quantity INT NOT NULL DEFAULT 1`;
            else sql = `ALTER TABLE cart_items ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP`;
            try { await conn.query(sql); } catch (e) { console.warn('[REPAIR] Could not add cart_items.'+col+':', e.message); }
          }
        }
      }
    });

    // ORDERS
    tasks.push(async () => {
      const t = 'orders';
      if (!await tableExists(conn, t)) {
        console.log('[REPAIR] Creating table orders');
        await conn.query(`
          CREATE TABLE orders (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            total DECIMAL(12,2) NOT NULL DEFAULT 0.00,
            full_name VARCHAR(255) DEFAULT NULL,
            address TEXT DEFAULT NULL,
            phone VARCHAR(50) DEFAULT NULL,
            status VARCHAR(50) DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        `);
      } else {
        for (const col of ['user_id','total','full_name','address','phone','status','created_at']) {
          if (!await columnExists(conn, t, col)) {
            console.log(`[REPAIR] Adding column orders.${col}`);
            let sql;
            if (col === 'user_id') sql = `ALTER TABLE orders ADD COLUMN user_id INT NOT NULL`;
            else if (col === 'total') sql = `ALTER TABLE orders ADD COLUMN total DECIMAL(12,2) NOT NULL DEFAULT 0.00`;
            else if (col === 'full_name') sql = `ALTER TABLE orders ADD COLUMN full_name VARCHAR(255) DEFAULT NULL`;
            else if (col === 'address') sql = `ALTER TABLE orders ADD COLUMN address TEXT DEFAULT NULL`;
            else if (col === 'phone') sql = `ALTER TABLE orders ADD COLUMN phone VARCHAR(50) DEFAULT NULL`;
            else if (col === 'status') sql = `ALTER TABLE orders ADD COLUMN status VARCHAR(50) DEFAULT 'Pending'`;
            else sql = `ALTER TABLE orders ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP`;
            try { await conn.query(sql); } catch (e) { console.warn('[REPAIR] Could not add orders.'+col+':', e.message); }
          }
        }
      }
    });

    // ORDER_ITEMS
    tasks.push(async () => {
      const t = 'order_items';
      if (!await tableExists(conn, t)) {
        console.log('[REPAIR] Creating table order_items');
        await conn.query(`
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
      } else {
        for (const col of ['order_id','craft_id','quantity','price']) {
          if (!await columnExists(conn, t, col)) {
            console.log(`[REPAIR] Adding column order_items.${col}`);
            let sql;
            if (col === 'order_id') sql = `ALTER TABLE order_items ADD COLUMN order_id INT NOT NULL`;
            else if (col === 'craft_id') sql = `ALTER TABLE order_items ADD COLUMN craft_id INT NOT NULL`;
            else if (col === 'quantity') sql = `ALTER TABLE order_items ADD COLUMN quantity INT NOT NULL DEFAULT 1`;
            else sql = `ALTER TABLE order_items ADD COLUMN price DECIMAL(12,2) NOT NULL DEFAULT 0.00`;
            try { await conn.query(sql); } catch (e) { console.warn('[REPAIR] Could not add order_items.'+col+':', e.message); }
          }
        }
      }
    });

    // Execute tasks sequentially (keeps logs clearer)
    for (const t of tasks) {
      try { await t(); } catch (e) { console.error('[REPAIR] Task failed:', e.message || e); }
    }

    console.log('[REPAIR] Schema repair complete. Verifying...');
    // basic verification for users.password_hash
    const hasPwd = await columnExists(conn, 'users', 'password_hash');
    if (!hasPwd) console.warn('[REPAIR] Warning: users.password_hash missing after repair');
    else console.log('[REPAIR] users.password_hash present');

    console.log('[REPAIR] Done. Start your backend and test login/register. If auth still fails, check logs and run: node backend/scripts/repair_schema.js again.');
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('[REPAIR] Failed:', err.message || err);
    process.exit(1);
  }
}

run();
