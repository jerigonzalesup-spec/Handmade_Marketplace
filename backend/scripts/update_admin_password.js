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

async function updateAdminPassword() {
  let connection;
  try {
    console.log('[ADMIN] Connecting to database...');
    connection = await mysql.createConnection(DB_CONFIG);

    const email = 'admin@admin.com';
    const newPassword = 'adminadmin1';

    // Hash new password
    const hashedPassword = await bcryptjs.hash(newPassword, 10);

    // Update password
    const [result] = await connection.execute(
      'UPDATE users SET password_hash = ? WHERE email = ?',
      [hashedPassword, email]
    );

    if (result.affectedRows === 0) {
      console.log(`[ADMIN] User ${email} not found`);
      await connection.end();
      return;
    }

    console.log(`[ADMIN] ✓ Admin password updated successfully`);
    console.log(`[ADMIN] Email: ${email}`);
    console.log(`[ADMIN] New Password: ${newPassword}`);

    await connection.end();
  } catch (err) {
    console.error('[ADMIN] Error:', err.message);
    if (connection) await connection.end();
    process.exit(1);
  }
}

updateAdminPassword();
