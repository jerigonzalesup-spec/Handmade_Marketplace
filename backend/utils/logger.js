export function logError(err, req) {
  const time = new Date().toISOString();
  const method = req?.method || 'N/A';
  const url = req?.originalUrl || 'N/A';

  console.error(`[${time}] ${method} ${url}`);
  console.error(err?.stack || err);
}
