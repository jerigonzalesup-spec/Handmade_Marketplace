import db from '../src/config/database.js';

async function run() {
  const email = process.argv[2] || 'demo@craftly.test';
  const [rows] = await db.query('SELECT id, email, password, password_hash, name, role FROM users WHERE email = ? LIMIT 1', [email]);
  console.log(rows[0] || null);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
