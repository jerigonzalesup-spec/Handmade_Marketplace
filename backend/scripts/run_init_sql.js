import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

async function main() {
  const host = process.env.MYSQL_HOST || '127.0.0.1';
  const port = Number(process.env.MYSQL_PORT || 3306);
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || '';
  const dbName = process.env.MYSQL_DATABASE || 'craftly_db';

  console.log('[INIT_SQL] Connecting to MySQL', host + ':' + port, 'as', user);
  const conn = await mysql.createConnection({ host, port, user, password, multipleStatements: true });

  try {
    console.log('[INIT_SQL] Ensuring database exists:', dbName);
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await conn.query(`USE \`${dbName}\``);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const sqlPath = path.join(__dirname, '..', 'migrations', 'init.sql');
    console.log('[INIT_SQL] Reading', sqlPath);
    const content = await fs.readFile(sqlPath, 'utf8');
    if (!content || !content.trim()) {
      console.error('[INIT_SQL] migrations/init.sql is empty or missing');
      process.exit(1);
    }

    console.log('[INIT_SQL] Applying SQL...');
    await conn.query(content);
    console.log('[INIT_SQL] SQL applied successfully');
    process.exit(0);
  } catch (err) {
    console.error('[INIT_SQL] Failed:', err.message || err);
    process.exit(1);
  } finally {
    try { await conn.end(); } catch (e) {}
  }
}

main();
