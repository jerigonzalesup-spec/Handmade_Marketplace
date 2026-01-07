import db from '../src/config/database.js';

async function run() {
  const [cols] = await db.query("SHOW COLUMNS FROM crafts");
  console.log(cols.map(c=>c.Field));
  process.exit(0);
}

run().catch(e=>{ console.error(e); process.exit(1); });
