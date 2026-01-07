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

// fire-and-forget
runMigrations().catch(err => console.error('[DB] migration error', err));

export default pool;
