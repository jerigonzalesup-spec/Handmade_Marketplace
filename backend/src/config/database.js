// Database pool helper
// - Creates a MySQL connection pool used app-wide (exported as `pool`).
// - Applies migrations (best-effort) and verifies schema on startup.
// - To change DB settings, update environment variables or `backend/.env`.
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  // default to existing database name `craftly_db` if env not set
  database: process.env.MYSQL_DATABASE || 'craftly_db',
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
// Run migrations/init.sql automatically (best-effort) to ensure required tables/columns exist
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

async function runMigrations() {
  try {
    // Resolve migration path reliably across platforms
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const sqlPath = path.join(__dirname, '..', '..', 'migrations', 'init.sql');
    const content = await fs.readFile(sqlPath, 'utf8');
    if (content && content.trim()) {
      await pool.query(content);
      console.log('[DB] Migrations applied');
    }
  } catch (err) {
    console.warn('[DB] Migration step failed (continuing):', err.message);
  }
}

// Run migrations then verify schema

// Verify required tables/columns exist to fail early with a clear message
async function verifySchema() {
  const required = {
    users: ['id','email','password_hash'],
    crafts: ['id','title','seller_id','price','stock_quantity'],
    carts: ['id','user_id'],
    cart_items: ['id','cart_id','craft_id','quantity'],
    orders: ['id','user_id','total'],
    order_items: ['id','order_id','craft_id','quantity']
  };
  try {
    for (const [table, cols] of Object.entries(required)) {
      const [rows] = await pool.query(
        'SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?',
        [table]
      );
      if (!rows || rows.length === 0) {
        throw new Error(`Required table '${table}' is missing. Run migrations/reset script.`);
      }
      const existing = new Set(rows.map(r => r.COLUMN_NAME));
      for (const c of cols) {
        if (!existing.has(c)) {
          throw new Error(`Table '${table}' missing column '${c}'. Run migrations/reset script.`);
        }
      }
    }
    console.log('[DB] Schema verified');
  } catch (err) {
    console.error('[DB] Schema verification failed:', err.message);
    console.error('[DB] To recover: run `node backend/scripts/repair_schema.js` to add missing tables/columns (non-destructive).');
    console.error('[DB] If you prefer full reset (destructive), run `node backend/scripts/reset_db.js` after stopping MySQL if necessary.');
    // DON'T exit here; let requests fail with clear DB errors instead of preventing app startup
  }
}

// Run verification after migrations
// Note: don't block on this promise; allow the app to start and log warnings asynchronously
(async () => {
  try {
    await runMigrations();
    await verifySchema();
  } catch (err) {
    console.error('[DB] Critical database issue:', err?.message || err);
    // Still exit, but allow queued events to process
    process.exitCode = 1;
  }
})();

export default pool;
