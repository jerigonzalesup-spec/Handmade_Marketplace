import 'dotenv/config';
import http from 'http';
import createApp from './src/app.js';
import dbPool from './src/config/database.js';

// Force backend to run only on port 4002 in development
const PORT = 4002;
let globalServer; // Keep server alive at module scope

async function startServer(port) {
  return new Promise((resolve, reject) => {
    const app = createApp();
    const server = http.createServer(app);
    server.once('error', (err) => {
      // log more context
      console.error('[SERVER] listen error', err && err.code ? `${err.code}: ${err.message}` : err);
      reject(err);
    });
    server.once('listening', () => {
      try { console.log('server listening at', server.address()); } catch (e) {}
      resolve(server);
    });
    // Bind explicitly to IPv4 localhost to ensure local tools can reach the server
    server.listen(port, '127.0.0.1');
  });
}

(async () => {
  try {
    // Wait briefly for DB schema verification to run (migrations + verify run on import)
    await new Promise(r => setTimeout(r, 100));
    globalServer = await startServer(PORT);
    process.env.PORT = String(PORT);
    // Log the canonical message requested by the developer
    console.log(`Backend running on http://localhost:4002`);
    console.log(`🔎 Process env PORT=${process.env.PORT}`);
    console.log(`🔌 API base: http://localhost:4002/api`);
  } catch (err) {
    if (err?.code === 'EADDRINUSE') {
      // If another instance is already bound to the required port, do not crash the process with a stacktrace.
      console.log(`Backend already running on port ${PORT} — skipping duplicate start.`);
      process.exit(0);
    } else {
      console.error('❌ Server error:', err?.stack || err?.message || err);
      process.exit(1);
    }
  }
})();

process.on('unhandledRejection', (reason) => {
  console.error('[UNHANDLED_REJECTION]', reason && reason.stack ? reason.stack : reason);
});
process.on('uncaughtException', (err) => {
  console.error('[UNCAUGHT_EXCEPTION]', err && err.stack ? err.stack : err);
});
process.on('SIGTERM', () => {
  console.log('[SIGTERM] Gracefully shutting down');
  if (globalServer) globalServer.close(() => process.exit(0));
  else process.exit(0);
});
process.on('SIGINT', () => {
  console.log('[SIGINT] Gracefully shutting down');
  if (globalServer) globalServer.close(() => process.exit(0));
  else process.exit(0);
});
