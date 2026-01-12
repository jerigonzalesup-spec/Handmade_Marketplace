#!/usr/bin/env node
const { spawn } = require('child_process');
const http = require('http');
const net = require('net');

const BACKEND_PORT = 4002;
const BACKEND_HEALTH = `http://127.0.0.1:${BACKEND_PORT}/api/health`;
const FRONTEND_PORT = 5173;

function checkPortOpen(port, host = '127.0.0.1', timeout = 500) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let called = false;
    socket.setTimeout(timeout);
    socket.on('connect', () => {
      called = true;
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      if (called) return; called = true; socket.destroy(); resolve(false);
    });
    socket.on('error', () => {
      if (called) return; called = true; socket.destroy(); resolve(false);
    });
    socket.connect(port, host);
  });
}

function waitForHealth(url, interval = 500, timeout = 30000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const req = http.get(url, (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json && json.status === 'ok') return resolve(json);
          } catch (e) {
            // ignore
          }
          if (Date.now() - start > timeout) return reject(new Error('Health check timeout'));
          setTimeout(attempt, interval);
        });
      });
      req.on('error', () => {
        if (Date.now() - start > timeout) return reject(new Error('Health check timeout'));
        setTimeout(attempt, interval);
      });
      req.setTimeout(2000, () => req.abort());
    };
    attempt();
  });
}

async function run() {
  try {
    console.log('[DEV] Checking port', BACKEND_PORT, 'availability...');
    const inUse = await checkPortOpen(BACKEND_PORT);
    let backend = null;
    if (inUse) {
      console.log(`[DEV] Backend already running on port ${BACKEND_PORT} — skipping start.`);
    } else {
      console.log('[DEV] Starting backend...');
      backend = spawn('npm', ['--prefix', 'backend', 'run', 'start'], { stdio: 'inherit', shell: true });

      backend.on('error', (err) => {
        console.error('[DEV] Failed to start backend process:', err && err.message ? err.message : err);
      });

      backend.on('exit', (code, sig) => {
        if (code !== 0) console.error('[SERVER] backend exited with code', code, sig || '');
      });
    }

    let backendExited = false;
    backend.on('exit', (code, sig) => {
      backendExited = true;
      if (code !== 0) console.error('[SERVER] backend exited with code', code, sig || '');
    });

    // Wait for health
    console.log('[DEV] Waiting for backend health at', BACKEND_HEALTH);
    try {
      const res = await waitForHealth(BACKEND_HEALTH, 500, 30000);
      console.log('[SERVER] backend healthy on', BACKEND_PORT);
    } catch (err) {
      console.error('[ERROR] Backend did not become healthy within timeout:', err.message);
      if (backend && !backend.killed) backend.kill();
      process.exit(1);
    }

    // Start frontend only after backend healthy
    console.log('[DEV] Starting frontend...');
    const client = spawn('npm', ['--prefix', 'client', 'run', 'dev', '--', '--port', String(FRONTEND_PORT)], { stdio: 'inherit', shell: true });
    client.on('exit', (code) => {
      console.log('[CLIENT] exited with code', code);
    });
    console.log('[CLIENT] running on', FRONTEND_PORT);

    // Propagate signals
    const shutdown = () => {
      if (!backend.killed) backend.kill();
      if (!client.killed) client.kill();
      process.exit();
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('[DEV] Error:', err.message || err);
    process.exit(1);
  }
}

run();
