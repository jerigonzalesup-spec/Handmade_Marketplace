import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.js';
import * as User from '../models/user.model.js';

export const register = async (req, res) => {
  try {
    console.log('[AUTH] Register body:', req.body);
    const { email, password, name, role } = req.body || {};

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'email, password, and name are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
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
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
    });
  } catch (err) {
    console.error('[AUTH] Register error:', err);
    return res.status(500).json({ error: 'Registration failed: ' + err.message });
  }
};

export const login = async (req, res) => {
  try {
    console.log('[AUTH] Login body:', req.body);
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password required' });
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
      user: { id: user.id, email: user.email, name: user.name, role: user.role }
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
    return res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error('[AUTH] Me error:', err);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
};
