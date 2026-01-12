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

async function recreateJeremy() {
  let connection;
  try {
    console.log('[JEREMY] Connecting to database...');
    connection = await mysql.createConnection(DB_CONFIG);

    const email = 'jeremy@gmail.com';
    const newRole = 'buyer';

    // Update Jeremy to be a buyer instead of seller
    const [result] = await connection.execute(
      'UPDATE users SET role = ? WHERE email = ?',
      [newRole, email]
    );

    if (result.affectedRows === 0) {
      console.log(`[JEREMY] User ${email} not found - creating...`);
      
      const password = 'jeremy12';
      const hashedPassword = await bcryptjs.hash(password, 10);
      
      await connection.execute(
        'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, NOW())',
        ['Jeremy Seller', email, hashedPassword, 'buyer']
      );
      
      console.log(`[JEREMY] ✓ User ${email} created as buyer`);
    } else {
      console.log(`[JEREMY] ✓ User ${email} updated to buyer role`);
    }
    
    console.log(`[JEREMY] Email: ${email}`);
    console.log(`[JEREMY] Password: jeremy12`);
    console.log(`[JEREMY] Role: buyer (can upgrade to seller)`);

    await connection.end();
  } catch (err) {
    console.error('[JEREMY] Error:', err.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

recreateJeremy();
