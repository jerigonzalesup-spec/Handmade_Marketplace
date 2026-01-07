const JWT_SECRET = process.env.JWT_SECRET || 'craftly_demo_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export { JWT_SECRET, JWT_EXPIRES_IN };
