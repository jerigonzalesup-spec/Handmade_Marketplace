import 'dotenv/config.js';
import http from 'http';
import createApp from './src/app.js';

const PORT = Number(process.env.PORT) || 4002;

async function startServer(port) {
  return new Promise((resolve, reject) => {
    const app = createApp();
    const server = http.createServer(app);
    server.once('error', reject);
    server.once('listening', () => resolve(server));
    server.listen(port);
  });
}

(async () => {
  try {
    let p = PORT;
    const maxRetries = 10;
    for (let i = 0; i < maxRetries; i += 1) {
      try {
        await startServer(p);
        console.log(`✅ Craftly backend running on http://localhost:${p}`);
        console.log(`🔌 API base: http://localhost:${p}/api`);
        break;
      } catch (err) {
        if (err?.code === 'EADDRINUSE') {
          console.warn(`⚠️ Port ${p} is in use. Trying port ${p + 1}...`);
          p += 1;
          continue;
        }
        console.error('❌ Server error:', err?.message || err);
        process.exit(1);
      }
    }
  } catch (err) {
    console.error('❌ Startup failed:', err?.message || err);
    process.exit(1);
  }
})();
