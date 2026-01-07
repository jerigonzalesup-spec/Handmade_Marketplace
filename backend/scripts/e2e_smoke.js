const BASE = process.env.BASE || 'http://localhost:4004/api';

async function run() {
  // ensure a fetch implementation is available (Node 18+ has global fetch)
  let _fetch = globalThis.fetch;
  if (typeof _fetch !== 'function') {
    try {
      const nf = await import('node-fetch');
      _fetch = nf.default || nf;
    } catch (e) {
      console.error('No fetch available and node-fetch not installed. Please run `npm install node-fetch` or use Node 18+');
      process.exit(1);
    }
  }
  try {
    console.log('E2E: Logging in as demo user');
    let r = await _fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo@craftly.test', password: 'password' })
    });
    const login = await r.json();
    console.log('Login response:', login);
    if (!login.token) {
      console.error('Login failed, aborting');
      process.exit(1);
    }
    const token = login.token;

    console.log('E2E: Fetching crafts');
    r = await _fetch(`${BASE}/crafts`);
    const crafts = await r.json();
    console.log('Crafts count:', Array.isArray(crafts) ? crafts.length : 'err');
    if (!Array.isArray(crafts) || crafts.length === 0) {
      console.error('No crafts available for test');
      process.exit(1);
    }
    const craft = crafts[0];
    console.log('Using craft:', craft.id || craft);

    console.log('E2E: Setting cart with one item');
    r = await _fetch(`${BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ items: [{ craftId: craft.id, qty: 1 }] })
    });
    const cart = await r.json();
    console.log('Cart response:', cart);

    console.log('E2E: Placing order');
    r = await _fetch(`${BASE}/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    const order = await r.json();
    console.log('Order response:', order);

    console.log('E2E: Done');
    process.exit(0);
  } catch (err) {
    console.error('E2E error', err);
    process.exit(1);
  }
}

run();
