/**
 * Database Configuration
 * Using in-memory store by default (no install needed for demo).
 * Swap with mongoose.connect() for MongoDB in production.
 */

// ── In-memory data store (demo / hackathon mode) ──
const db = {
  users:         [],
  meetings:      [],
  tasks:         [],
  notifications: [],
};

let connected = false;

async function connectDB() {
  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    try {
      const mongoose = require('mongoose');
      await mongoose.connect(mongoUri);
      console.log('✅ MongoDB connected');
      connected = true;
    } catch (err) {
      console.warn('⚠️  MongoDB connection failed, falling back to in-memory store:', err.message);
      connected = true; // in-memory
    }
  } else {
    console.log('ℹ️  No MONGODB_URI found – using in-memory store (data resets on restart)');
    connected = true;
  }
}

module.exports = { connectDB, db };
