import * as User from '../src/models/user.model.js';

async function run() {
  const email = process.argv[2] || 'demo@craftly.test';
  const user = await User.findByEmail(email);
  console.log(user);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
