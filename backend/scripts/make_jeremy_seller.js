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

async function makeJeremySeller() {
  let connection;
  try {
    console.log('[JEREMY] Connecting to database...');
    connection = await mysql.createConnection(DB_CONFIG);

    const email = 'jeremy@gmail.com';

    // Update Jeremy to have seller permissions
    const [result] = await connection.execute(
      'UPDATE users SET is_seller = 1 WHERE email = ?',
      [email]
    );

    if (result.affectedRows === 0) {
      console.log(`[JEREMY] User ${email} not found`);
      await connection.end();
      return;
    }

    console.log(`[JEREMY] ✓ User ${email} is now both BUYER and SELLER`);
    console.log(`[JEREMY] Email: ${email}`);
    console.log(`[JEREMY] Password: jeremy12`);
    console.log(`[JEREMY] Role: buyer (with seller permissions)`);
    console.log(`[JEREMY] Can access both /buyer and /seller interfaces`);

    await connection.end();
  } catch (err) {
    console.error('[JEREMY] Error:', err.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

makeJeremySeller();
