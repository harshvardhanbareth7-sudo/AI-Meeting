const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const meetingRoutes = require('./routes/meetings');
const taskRoutes    = require('./routes/tasks');
const aiRoutes      = require('./routes/ai');
const authRoutes    = require('./routes/auth');
const notifRoutes   = require('./routes/notifications');

const errorHandler  = require('./middleware/errorHandler');
const { connectDB } = require('./config/database');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Database ──
connectDB();

// ── Security / Middleware ──
app.use(helmet({
  contentSecurityPolicy: false,  // Disable for demo; enable & configure in production
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ── Rate Limiting ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ── Static Frontend ──
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ── API Routes ──
app.use('/api/auth',          authRoutes);
app.use('/api/meetings',      meetingRoutes);
app.use('/api/tasks',         taskRoutes);
app.use('/api/ai',            aiRoutes);
app.use('/api/notifications', notifRoutes);

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// ── Catch-all → landing page ──
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'pages', 'landing.html'));
});

// ── Error Handler ──
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
