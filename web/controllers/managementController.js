const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

/**
 * GET /admin/management
 * Display management page untuk CRUD Voters, Candidates, Admins
 */
exports.getManagement = async (req, res) => {
  try {
    const voters = await prisma.voter.findMany({
      orderBy: { id: 'asc' },
    });

    const candidates = await prisma.candidate.findMany({
      orderBy: { id: 'asc' },
    });

    const admins = await prisma.admin.findMany({
      orderBy: { id: 'asc' },
    });

    const sessions = await prisma.electionSession.findMany({
      orderBy: { id: 'asc' },
    });

    res.render('admin/management', {
      title: 'Management - SI-EVO Admin',
      voters,
      candidates,
      admins,
      sessions,
      adminEmail: req.session.adminEmail,
    });
  } catch (error) {
    console.error('Error fetching management data:', error);
    res.status(500).render('error', { message: 'Error loading management page' });
  }
};

/**
 * POST /admin/voter/create
 * Create new voter
 */
exports.createVoter = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const voter = await prisma.voter.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'VOTER_CREATED',
        details: JSON.stringify({ voterId: voter.id, email: voter.email }),
      },
    });

    res.json({ success: true, voter });
  } catch (error) {
    console.error('Error creating voter:', error);
    res.status(500).json({ error: 'Failed to create voter' });
  }
};

/**
 * POST /admin/voter/update/:id
 * Update voter
 */
exports.updateVoter = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const voter = await prisma.voter.update({
      where: { id: parseInt(id) },
      data: { name, email },
    });

    await prisma.auditLog.create({
      data: {
        action: 'VOTER_UPDATED',
        details: JSON.stringify({ voterId: voter.id, email: voter.email }),
      },
    });

    res.json({ success: true, voter });
  } catch (error) {
    console.error('Error updating voter:', error);
    res.status(500).json({ error: 'Failed to update voter' });
  }
};

/**
 * DELETE /admin/voter/delete/:id
 * Delete voter
 */
exports.deleteVoter = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.voter.delete({
      where: { id: parseInt(id) },
    });

    await prisma.auditLog.create({
      data: {
        action: 'VOTER_DELETED',
        details: JSON.stringify({ voterId: id }),
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting voter:', error);
    res.status(500).json({ error: 'Failed to delete voter' });
  }
};

/**
 * POST /admin/candidate/create
 * Create new candidate
 */
exports.createCandidate = async (req, res) => {
  try {
    const { name, vision, mission, sessionId } = req.body;

    if (!name || !sessionId) {
      return res.status(400).json({ error: 'Name and session required' });
    }

    const candidate = await prisma.candidate.create({
      data: {
        name,
        vision: vision || '',
        mission: mission || '',
        electionSessionId: parseInt(sessionId),
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'CANDIDATE_CREATED',
        details: JSON.stringify({ candidateId: candidate.id, name: candidate.name }),
      },
    });

    res.json({ success: true, candidate });
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ error: 'Failed to create candidate' });
  }
};

/**
 * POST /admin/candidate/update/:id
 * Update candidate
 */
exports.updateCandidate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, vision, mission } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name required' });
    }

    const candidate = await prisma.candidate.update({
      where: { id: parseInt(id) },
      data: { name, vision, mission },
    });

    await prisma.auditLog.create({
      data: {
        action: 'CANDIDATE_UPDATED',
        details: JSON.stringify({ candidateId: candidate.id, name: candidate.name }),
      },
    });

    res.json({ success: true, candidate });
  } catch (error) {
    console.error('Error updating candidate:', error);
    res.status(500).json({ error: 'Failed to update candidate' });
  }
};

/**
 * DELETE /admin/candidate/delete/:id
 * Delete candidate
 */
exports.deleteCandidate = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.candidate.delete({
      where: { id: parseInt(id) },
    });

    await prisma.auditLog.create({
      data: {
        action: 'CANDIDATE_DELETED',
        details: JSON.stringify({ candidateId: id }),
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
};

/**
 * POST /admin/admin/create
 * Create new admin
 */
exports.createAdmin = async (req, res) => {
  try {
    const { username, email, password, isSuper } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await prisma.admin.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isSuper: isSuper === 'true' || isSuper === true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_CREATED',
        details: JSON.stringify({ adminId: admin.id, username: admin.username }),
      },
    });

    res.json({ success: true, admin });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'Failed to create admin' });
  }
};

/**
 * POST /admin/admin/update/:id
 * Update admin
 */
exports.updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, isSuper } = req.body;

    if (!username || !email) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const admin = await prisma.admin.update({
      where: { id: parseInt(id) },
      data: {
        username,
        email,
        isSuper: isSuper === 'true' || isSuper === true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_UPDATED',
        details: JSON.stringify({ adminId: admin.id, username: admin.username }),
      },
    });

    res.json({ success: true, admin });
  } catch (error) {
    console.error('Error updating admin:', error);
    res.status(500).json({ error: 'Failed to update admin' });
  }
};

/**
 * DELETE /admin/admin/delete/:id
 * Delete admin
 */
exports.deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.admin.delete({
      where: { id: parseInt(id) },
    });

    await prisma.auditLog.create({
      data: {
        action: 'ADMIN_DELETED',
        details: JSON.stringify({ adminId: id }),
      },
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({ error: 'Failed to delete admin' });
  }
};
