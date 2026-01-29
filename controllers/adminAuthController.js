const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const adminCache = require('../services/adminCacheService');
const prisma = new PrismaClient();

/**
 * Display admin login page
 */
exports.loginPage = (req, res) => {
  res.render('admin/login', {
    title: 'Admin Login - SI-EVO',
    errorMessage: null,
  });
};

/**
 * Process admin login with BST Cache
 * Cache first, fallback ke database
 */
exports.loginProcess = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`🔐 Admin attempting login: ${email}`);
    console.log(`🔐 Admin attempting login: ${password}`);

    // Validate input
    if (!email || !password) {
      return res.render('admin/login', {
        title: 'Admin Login - SI-EVO',
        errorMessage: 'Email and password are required',
      });
    }

    // Find admin menggunakan cache service (BST + DB)
    const admin = await adminCache.findByEmail(email);

    if (!admin) {
      return res.render('admin/login', {
        title: 'Admin Login - SI-EVO',
        errorMessage: 'Invalid email or password',
      });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.render('admin/login', {
        title: 'Admin Login - SI-EVO',
        errorMessage: 'Invalid email or password',
      });
    }

    // Create session
    req.session.adminId = admin.id;
    req.session.adminEmail = admin.email;
    req.session.adminUsername = admin.username;
    req.session.isSuper = admin.isSuper || false;

    console.log(`✅ Admin ${admin.email} login successful`);

    // Log ke AuditLog
    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_LOGIN',
        details: JSON.stringify({
          adminId: admin.id,
          email: admin.email,
          username: admin.username,
          timestamp: new Date(),
        }),
      },
    });
    console.log(adminCache.getStats());

    // Redirect ke dashboard
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('❌ Login error:', error);
    res.render('admin/login', {
      title: 'Admin Login - SI-EVO',
      errorMessage: 'An error occurred during login',
    });
  }
};

/**
 * Logout admin
 */
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.redirect('/admin/login');
  });
};
