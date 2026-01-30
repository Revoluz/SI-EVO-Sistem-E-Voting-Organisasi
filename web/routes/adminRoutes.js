const express = require('express');
const router = express.Router();

// Import controllers
const { 
  getDashboard, 
  getVoters, 
  getAudit,
  performAction,
  undoAction
} = require('../controllers/adminController');
const { loginPage, loginProcess, logout } = require('../controllers/adminAuthController');
const { 
  getManagement,
  createVoter, updateVoter, deleteVoter,
  createCandidate, updateCandidate, deleteCandidate,
  createAdmin, updateAdmin, deleteAdmin
} = require('../controllers/managementController');

// Import middleware
const { isAdminLogin, redirectIfAdminLogin } = require('../middleware/adminMiddleware');

/**
 * GET /admin/login
 * Display admin login page
 */
router.get('/login', redirectIfAdminLogin, loginPage);

/**
 * POST /admin/login
 * Process admin login with BST cache
 */
router.post('/login', loginProcess);

/**
 * GET /admin/logout
 * Logout admin
 */
router.get('/logout', logout);

/**
 * GET /admin/dashboard
 * Display admin dashboard with statistics
 */
router.get('/dashboard', isAdminLogin, getDashboard);

/**
 * GET /admin/voters
 * Search and filter voters
 */
router.get('/voters', isAdminLogin, getVoters);

/**
 * GET /admin/management
 * Management page for CRUD operations
 */
router.get('/management', isAdminLogin, getManagement);

// Voter CRUD
router.post('/voter/create', isAdminLogin, createVoter);
router.post('/voter/update/:id', isAdminLogin, updateVoter);
router.delete('/voter/delete/:id', isAdminLogin, deleteVoter);

// Candidate CRUD
router.post('/candidate/create', isAdminLogin, createCandidate);
router.post('/candidate/update/:id', isAdminLogin, updateCandidate);
router.delete('/candidate/delete/:id', isAdminLogin, deleteCandidate);

// Admin CRUD
router.post('/admin/create', isAdminLogin, createAdmin);
router.post('/admin/update/:id', isAdminLogin, updateAdmin);
router.delete('/admin/delete/:id', isAdminLogin, deleteAdmin);

/**
 * GET /admin/session
 * Manage election session
 */
router.get('/session', isAdminLogin, (req, res) => {
  // TODO: Implement manageSession controller
  // - Display current session details
  // - Show session controls (start, pause, end)
  // - Manage candidates
  res.render('admin/session', { title: 'Session - SI-EVO Admin' });
});

/**
 * POST /admin/action
 * Perform administrative action
 */
router.post('/action', isAdminLogin, performAction);

/**
 * GET /admin/undo
 * Undo last action (AVL Tree rebalancing concept)
 */
router.get('/undo', isAdminLogin, undoAction);

/**
 * GET /admin/audit
 * View audit logs (Linked List implementation)
 */
router.get('/audit', isAdminLogin, getAudit);

module.exports = router;
