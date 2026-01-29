const express = require('express');
const router = express.Router();

// Import controllers
const { loginPage, loginProcess, logout } = require('../controllers/authController');
const { showVotePage, submitVote, showResults } = require('../controllers/voteController');

// Import voter cache untuk debug endpoint
const voterCache = require('../services/voterCacheService');

/**
 * GET /
 * Display login page
 */
router.get('/', loginPage);

/**
 * POST /login
 * Process login and create session
 */
router.post('/login', loginProcess);

/**
 * GET /logout
 * Handle logout
 */
router.get('/logout', logout);

/**
 * GET /vote
 * Display voting/candidate selection page
 */
router.get('/vote', showVotePage);

/**
 * POST /vote
 * Submit vote to queue
 */
router.post('/vote', submitVote);

/**
 * GET /results
 * Display voting results
 */
router.get('/results', showResults);
/**
 * GET /cache-stats
 * Display voter cache statistics (debug endpoint)
 */
router.get('/cache-stats', (req, res) => {
  const stats = voterCache.getStats();
  res.json({
    message: 'Voter Cache Statistics',
    stats,
    info: 'Cache menyimpan maksimal 25 voter terakhir yang login. Saat login, sistem cek BST dulu, jika tidak ada baru query database.'
  });
});

module.exports = router;
