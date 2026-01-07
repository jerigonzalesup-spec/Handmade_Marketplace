import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';
import * as User from '../models/user.model.js';

export default async function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };
    return next();
  } catch (err) {
    console.error('[AUTH] Token error:', err.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}
