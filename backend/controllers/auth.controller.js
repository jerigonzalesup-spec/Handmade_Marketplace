// Auth controller
// - Exposes register/login/me endpoints used by the API routes.
// - Keep business logic minimal here; user persistence belongs in `backend/src/models/user.model.js`.
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';
import * as User from '../models/user.model.js';

// Helper to format user object with isSeller flag
function formatUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isSeller: user.role === 'seller' || user.is_seller === 1 || user.is_seller === true
  };
}

export const register = async (req, res) => {
  try {
    // Safe logging: never print raw password in logs
    if (process.env.NODE_ENV !== 'production') {
      const safeBody = { ...req.body } || {};
      if (safeBody.password) safeBody.password = '***';
      console.log('[AUTH] Register body:', safeBody);
    }

    const { email, password, name, role } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    const exists = await User.findByEmail(email);
    if (exists) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const user = await User.create({ email, password, name, role: role || 'buyer' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.status(201).json({
      message: 'User registered successfully',
      token,
      user: formatUser(user)
    });
  } catch (err) {
    console.error('[AUTH] Register error:', err);
    return res.status(500).json({ message: 'Registration failed: ' + err.message });
  }
};

export const login = async (req, res) => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      const safeBody = { ...req.body } || {};
      if (safeBody.password) safeBody.password = '***';
      console.log('[AUTH] Login body:', safeBody);
    }

    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password required' });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await User.comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      token,
      user: formatUser(user)
    });
  } catch (err) {
    console.error('[AUTH] Login error:', err);
    return res.status(500).json({ error: 'Login failed: ' + err.message });
  }
};

export const me = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ user: formatUser(user) });
  } catch (err) {
    console.error('[AUTH] Me error:', err);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const becomeSeller = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.is_seller) {
      return res.status(400).json({ error: 'User is already a seller' });
    }
    
    // Update user to add seller permissions (keep role as buyer, set is_seller=1)
    const updated = await User.update(userId, { is_seller: 1 });
    if (!updated) {
      return res.status(500).json({ error: 'Failed to update user' });
    }
    
    return res.json({ user: formatUser(updated) });
  } catch (err) {
    console.error('[AUTH] becomeSeller error:', err);
    return res.status(500).json({ error: 'Failed to become seller: ' + err.message });
  }
};
