import * as User from '../src/models/user.model.js';

async function run() {
  const hash = '$2a$10$9gmKNySaal1IQuTK/t.ug.dIWugAIa0wBgiACcMhQrRRJ.gdhFbfO';
  const ok = await User.comparePassword('password', hash);
  console.log('compare result', ok);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
