import db from '../src/config/database.js';
import bcrypt from 'bcryptjs';

async function seed() {
  const email = 'demo@craftly.test';
  const [rows] = await db.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
  if (rows.length) {
    console.log('Demo user already exists');
    process.exit(0);
  }
  const hashed = await bcrypt.hash('password', 10);

  // Detect whether the schema has `password_hash` or `password` column and avoid forcing created_at
  const [cols] = await db.query("SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users'");
  const colNames = cols.map(c => c.COLUMN_NAME);
  const passwordCol = colNames.includes('password_hash') ? 'password_hash' : (colNames.includes('password') ? 'password' : null);

  if (!passwordCol) {
    console.warn('No password column found on users table; inserting without password column');
    const [res] = await db.query('INSERT INTO users (email, name, role) VALUES (?, ?, ?)', [email, 'Demo User', 'buyer']);
    console.log('Inserted demo user id', res.insertId);
    process.exit(0);
  }

  const fields = ['email', passwordCol, 'name', 'role'];
  const placeholders = fields.map(_ => '?').join(', ');
  const values = [email, hashed, 'Demo User', 'buyer'];
  const sql = `INSERT INTO users (${fields.join(',')}) VALUES (${placeholders})`;
  const [res] = await db.query(sql, values);
  console.log('Inserted demo user id', res.insertId);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
