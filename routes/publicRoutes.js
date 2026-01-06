const express = require('express');
const router = express.Router();

// Import controllers
const { loginPage, loginProcess, logout } = require('../controllers/authController');
const { showVotePage, submitVote, showResults } = require('../controllers/voteController');

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

module.exports = router;
