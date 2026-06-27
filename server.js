/**
 * Vireon Technologies – Express Backend Server
 * Entry point: node server.js  or  npm start
 *
 * Only Auth (Login / Signup) is exposed — all other demo routes
 * (contact, newsletter, careers, insights) have been removed since
 * the frontend doesn't post to them.
 */

const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const rateLimit = require('express-rate-limit');
const path     = require('path');
require('dotenv').config();

const connectDB = require('./backend/config/db');
const authRoutes = require('./backend/routes/auth');

const app  = express();
const PORT = process.env.PORT || 3000;

/* ─── Security & Middleware ─── */
app.use(helmet({
  contentSecurityPolicy: false   // allow inline styles / CDN scripts for the SPA
}));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/* ─── Rate Limiter (global) ─── */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

/* ─── API Routes ─── */
app.use('/api/auth', authRoutes);

/* ─── Health Check ─── */
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    service: 'Vireon Technologies API',
    status: 'operational',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

/* ─── Serve Frontend ─── */
app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* ─── 404 ─── */
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

/* ─── Global Error Handler ─── */
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════╗
║   Vireon Technologies API                ║
║   Running on http://localhost:${PORT}         ║
╚══════════════════════════════════════════╝
  `);
  });
}

startServer();

module.exports = app;
