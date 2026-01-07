import bcryptjs from 'bcryptjs';
import db from '../config/database.js';

async function findByEmail(email) {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email]);
  const row = rows[0] || null;
  if (row && row.password_hash && !row.password) {
    row.password = row.password_hash;
  }
  return row;
}

async function findById(id) {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ? LIMIT 1', [Number(id)]);
  const row = rows[0] || null;
  if (row && row.password_hash && !row.password) {
    row.password = row.password_hash;
  }
  return row;
}

async function create({ email, password, name, role = 'buyer' }) {
  const hashed = await hashPassword(password);
  const [result] = await db.query(
    'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
    [email, hashed, name, role]
  );
  const id = result.insertId;
  return findById(id);
}

async function update(id, updates) {
  const fields = [];
  const values = [];
  if (updates.email) { fields.push('email = ?'); values.push(updates.email); }
  if (updates.name) { fields.push('name = ?'); values.push(updates.name); }
  if (updates.role) { fields.push('role = ?'); values.push(updates.role); }
  if (updates.password) {
    const hashed = await hashPassword(updates.password);
    fields.push('password_hash = ?'); values.push(hashed);
  }
  if (fields.length === 0) return findById(id);
  values.push(Number(id));
  await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
  return findById(id);
}

// Helper to hash password
async function hashPassword(password) {
  return bcryptjs.hash(password, 10);
}

// Helper to compare password
async function comparePassword(password, hashedPassword) {
  return bcryptjs.compare(password, hashedPassword);
}

export { findByEmail, findById, create, update, hashPassword, comparePassword };
