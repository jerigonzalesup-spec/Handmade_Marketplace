import mysql from 'mysql2/promise';
import bcryptjs from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: new URL('../.env', import.meta.url) });

const DB_CONFIG = {
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: Number(process.env.MYSQL_PORT || 3306),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'craftly_db',
};

async function createAdminUser() {
  let connection;
  try {
    console.log('[ADMIN] Connecting to database...');
    connection = await mysql.createConnection(DB_CONFIG);

    const email = 'admin@admin.com';
    const password = 'admin';
    const name = 'Admin User';
    const role = 'admin';

    // Check if user already exists
    const [existing] = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      console.log(`[ADMIN] User ${email} already exists`);
      await connection.end();
      return;
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    await connection.execute(
      'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, NOW())',
      [name, email, hashedPassword, role]
    );

    console.log(`[ADMIN] ✓ Admin user created successfully`);
    console.log(`[ADMIN] Email: ${email}`);
    console.log(`[ADMIN] Password: ${password}`);
    console.log(`[ADMIN] Role: ${role}`);

    await connection.end();
  } catch (err) {
    console.error('[ADMIN] Error:', err.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

createAdminUser();
