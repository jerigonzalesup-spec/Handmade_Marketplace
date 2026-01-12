import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: new URL('../.env', import.meta.url) });

const DB_CONFIG = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'craftly_db',
};

async function addSellerColumn() {
  let connection;
  try {
    console.log('[MIGRATE] Connecting to database...');
    connection = await mysql.createConnection(DB_CONFIG);

    // Add is_seller column if it doesn't exist
    console.log('[MIGRATE] Adding is_seller column to users table...');
    await connection.execute(
      'ALTER TABLE users ADD COLUMN IF NOT EXISTS is_seller BOOLEAN DEFAULT 0'
    );

    console.log('[MIGRATE] ✓ Column added successfully');
    await connection.end();
  } catch (err) {
    console.error('[MIGRATE] Error:', err.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

addSellerColumn();
