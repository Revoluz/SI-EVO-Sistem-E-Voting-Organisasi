const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Display login page
 */
exports.loginPage = (req, res) => {
  res.render('voter/login', { 
    title: 'Login - SI-EVO',
    errorMessage: null 
  });
};

/**
 * Process login and create session
 */
exports.loginProcess = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.render('voter/login', {
        title: 'Login - SI-EVO',
        errorMessage: 'Email and password are required'
      });
    }

    // Find voter in database
    const voter = await prisma.voter.findUnique({
      where: { email }
    });

    if (!voter) {
      return res.render('voter/login', {
        title: 'Login - SI-EVO',
        errorMessage: 'Invalid email or password'
      });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, voter.password);

    if (!passwordMatch) {
      return res.render('voter/login', {
        title: 'Login - SI-EVO',
        errorMessage: 'Invalid email or password'
      });
    }

    // Create session
    req.session.voterId = voter.id;
    req.session.voterName = voter.name;
    req.session.voterEmail = voter.email;

    // Log the login action
    await prisma.auditLog.create({
      data: {
        action: 'LOGIN',
        details: JSON.stringify({
          voterId: voter.id,
          email: voter.email,
          timestamp: new Date().toISOString()
        })
      }
    });

    console.log(`✓ Voter logged in: ${voter.email}`);
    res.redirect('/vote');
  } catch (error) {
    console.error('Login error:', error);
    res.render('voter/login', {
      title: 'Login - SI-EVO',
      errorMessage: 'An error occurred during login. Please try again.'
    });
  }
};

/**
 * Handle logout
 */
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', error);
      return res.send('Error logging out');
    }
    res.redirect('/');
  });
};
