require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

// Import routes
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Import cache services
const voterCache = require('./services/voterCacheService');
const adminCache = require('./services/adminCacheService');
const { startWorker } = require('./workers/voteWorkers');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 // 24 hours
  }
}));

// View Engine Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`SI-EVO Server running on http://localhost:${PORT}`);
  console.log(`[Cache] Voter Cache Service initialized (max 25 users)`);
  console.log(`[Cache] Voter Stats:`, voterCache.getStats());
  console.log(`[Cache] Admin Cache Service initialized (max 10 admins)`);
  console.log(`[Cache] Admin Stats:`, adminCache.getStats());
});

startWorker();

