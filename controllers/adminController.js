const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Get all voters
 */
exports.getVoters = async (req, res) => {
  try {
    // Check admin authentication (to be implemented)
    // if (!req.session.adminId) {
    //   return res.redirect('/');
    // }

    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    // Fetch voters with pagination
    const voters = await prisma.voter.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    });

    // Get total count
    const totalVoters = await prisma.voter.count();
    const totalPages = Math.ceil(totalVoters / pageSize);

    console.log(`✓ Admin fetched voters list. Total: ${totalVoters}`);

    res.render('admin/voters', {
      title: 'Voters - SI-EVO Admin',
      voters,
      currentPage: page,
      totalPages,
      totalVoters
    });
  } catch (error) {
    console.error('Error fetching voters:', error);
    res.render('admin/voters', {
      title: 'Voters - SI-EVO Admin',
      voters: [],
      currentPage: 1,
      totalPages: 0,
      errorMessage: 'An error occurred while fetching voters'
    });
  }
};

/**
 * Get audit logs
 */
exports.getAudit = async (req, res) => {
  try {
    // Check admin authentication (to be implemented)
    // if (!req.session.adminId) {
    //   return res.redirect('/');
    // }

    // Fetch all audit logs ordered by most recent first
    const auditLogs = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' }
    });

    console.log(`✓ Admin fetched audit logs. Total: ${auditLogs.length}`);

    res.render('admin/audit', {
      title: 'Audit Logs - SI-EVO Admin',
      auditLogs
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.render('admin/audit', {
      title: 'Audit Logs - SI-EVO Admin',
      auditLogs: [],
      errorMessage: 'An error occurred while fetching audit logs'
    });
  }
};

/**
 * Get admin dashboard
 */
exports.getDashboard = async (req, res) => {
  try {
    // Check admin authentication (to be implemented)
    // if (!req.session.adminId) {
    //   return res.redirect('/');
    // }

    // Fetch statistics
    const totalVoters = await prisma.voter.count();
    const votersParticipated = await prisma.voter.count({
      where: { hasVoted: true }
    });

    // Get active session
    const activeSession = await prisma.electionSession.findFirst({
      where: { status: 'ACTIVE' }
    });

    // Get total votes
    const totalVotes = await prisma.vote.count(
      activeSession ? { where: { electionSessionId: activeSession.id } } : {}
    );

    // Get recent audit logs
    const recentActions = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    const sessionStatus = activeSession ? activeSession.status : 'PREPARATION';

    console.log(`✓ Dashboard loaded - Voters: ${totalVoters}, Participated: ${votersParticipated}`);

    res.render('admin/dashboard', {
      title: 'Dashboard - SI-EVO Admin',
      totalVoters,
      votersParticipated,
      totalVotes,
      sessionStatus,
      recentActions
    });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.render('admin/dashboard', {
      title: 'Dashboard - SI-EVO Admin',
      totalVoters: 0,
      votersParticipated: 0,
      totalVotes: 0,
      sessionStatus: 'ERROR',
      recentActions: [],
      errorMessage: 'An error occurred while loading the dashboard'
    });
  }
};
