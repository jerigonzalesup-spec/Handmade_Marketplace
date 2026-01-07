import * as logger from '../utils/logger.js';

export default (err, req, res, next) => {
  // log server-side error
  logger.error(err && err.stack ? err.stack : err);

  const isProd = process.env.NODE_ENV === 'production';
  const message = isProd ? 'Internal server error' : (err && err.message) || 'Internal server error';
  const status = err && err.status && Number(err.status) >= 400 ? Number(err.status) : 500;

  res.status(status).json({ error: message });
};
