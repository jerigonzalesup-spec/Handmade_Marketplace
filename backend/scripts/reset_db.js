import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

async function runSql(conn, sql) {
  // Run multiple statements safely
  await conn.query(sql);
}

async function main() {
  try {
    const host = process.env.MYSQL_HOST || '127.0.0.1';
    const port = Number(process.env.MYSQL_PORT || 3306);
    const user = process.env.MYSQL_USER || 'root';
    const password = process.env.MYSQL_PASSWORD || '';

    console.log('[RESET_DB] Connecting to MySQL', host + ':' + port, 'as', user);
    const conn = await mysql.createConnection({ host, port, user, password, multipleStatements: true });

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const sqlPath = path.join(__dirname, '..', 'migrations', 'reset.sql');
    console.log('[RESET_DB] Reading', sqlPath);
    const sql = await fs.readFile(sqlPath, 'utf8');
    if (!sql || !sql.trim()) throw new Error('reset.sql is empty');

    console.log('[RESET_DB] Applying reset SQL (this will DROP and recreate the database)');
    try {
      await runSql(conn, sql);
      // Connect to the freshly created DB for seeding
      await conn.query('USE `craftly_db`');
    } catch (dropErr) {
      console.warn('[RESET_DB] DROP DATABASE failed — falling back to dropping tables:', dropErr.message || dropErr);
      // Fallback: ensure DB exists, then drop all tables and recreate schema portion
      await conn.query('CREATE DATABASE IF NOT EXISTS `craftly_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
      await conn.query('USE `craftly_db`');
      // Attempt to drop all tables
      const [tables] = await conn.query("SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE()");
      for (const t of tables) {
        try { await conn.query(`DROP TABLE IF EXISTS \`${t.TABLE_NAME}\``); } catch (e) { /* ignore */ }
      }
      // Recreate canonical schema (append only the create statements from reset.sql)
      // Extract the CREATE TABLE blocks from reset.sql by skipping the initial DROP/CREATE DB statements
      const createIndex = sql.indexOf('\n-- Recreate canonical tables');
      if (createIndex > -1) {
        const createSql = sql.slice(createIndex);
        await runSql(conn, createSql);
      } else {
        throw new Error('Could not find schema creation SQL in reset.sql');
      }
    }

    // Minimal seed: 1 buyer, 1 seller, 1 craft
    const buyerPass = await bcrypt.hash('buyerpass', 10);
    const sellerPass = await bcrypt.hash('sellerpass', 10);

    console.log('[RESET_DB] Inserting minimal seed data');
    await conn.query('INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)', ['buyer@example.com', buyerPass, 'Buyer One', 'buyer']);
    const [r] = await conn.query('INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)', ['seller@example.com', sellerPass, 'Seller One', 'seller']);
    const sellerId = r.insertId;

    await conn.query('INSERT INTO crafts (title, description, price, stock_quantity, image, seller_id) VALUES (?, ?, ?, ?, ?, ?)',
      ['Handmade Bowl', 'A small handmade bowl', 24.99, 10, null, sellerId]);

    console.log('[RESET_DB] Seed complete');
    await conn.end();
    process.exit(0);
  } catch (err) {
    console.error('[RESET_DB] Failed:', err.message || err);
    process.exit(1);
  }
}

main();
