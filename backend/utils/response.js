const isDev = process.env.NODE_ENV !== 'production';

function info(...args) {
  if (isDev) console.info('[info]', ...args);
}

function warn(...args) {
  console.warn('[warn]', ...args);
}

function error(...args) {
  console.error('[error]', ...args);
}

export { info, warn, error };
