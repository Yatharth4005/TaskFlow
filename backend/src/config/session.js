const session = require('express-session');

const sessionConfig = {
  name: 'taskflow.sid',
  secret: process.env.SESSION_SECRET || 'taskflow-super-secret-key-2026-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    secure: process.env.NODE_ENV === 'production'
  }
};

module.exports = session(sessionConfig);

