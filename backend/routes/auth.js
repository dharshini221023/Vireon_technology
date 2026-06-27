/**
 * Auth Routes – Client Portal (MongoDB-backed)
 * POST /api/auth/register
 * POST /api/auth/login
 * POST /api/auth/logout
 * GET  /api/auth/me
 *
 * Users are stored in MongoDB (backend/models/User.js).
 * Passwords are hashed with bcrypt. Sessions are stateless JWTs
 * signed with JWT_SECRET from .env, so they survive server restarts.
 */
const express = require('express');
const jwt     = require('jsonwebtoken');
const { body } = require('express-validator');
const { validate } = require('../middleware/validate');
const User = require('../models/User');

const router = express.Router();

function generateToken(user) {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

/* ─── POST /api/auth/register ─── */
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], validate, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const newUser = await User.create({ name, email: email.toLowerCase(), password, role: 'client' });
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: newUser
    });
  } catch (err) {
    console.error('[AUTH REGISTER ERROR]', err);
    res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
});

/* ─── POST /api/auth/login ─── */
router.post('/login', [
  body('email').trim().isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password is required')
], validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user
    });
  } catch (err) {
    console.error('[AUTH LOGIN ERROR]', err);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
});

/* ─── POST /api/auth/logout ─── */
/* Stateless JWTs need no server-side cleanup; client just discards the token. */
router.post('/logout', (_req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

/* ─── GET /api/auth/me ─── */
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false, message: 'Not authenticated' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });

    res.json({ success: true, user });
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

module.exports = router;
