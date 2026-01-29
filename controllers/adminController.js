const { PrismaClient } = require('@prisma/client');
const { skip } = require('@prisma/client/runtime/library'); 
const prisma = new PrismaClient();
const LinkedList = require('../structures/LinkedList');      
const Stack = require('../structures/Stack');
const { resetCounts } = require('./voteController');

// STACK GLOBAL UNTUK SIMPAN RIWAYAT AKSI ADMIN
const adminActionStack = new Stack();

/**
 * Get all voters
 */
exports.getVoters = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 10;
    const skipVal = (page - 1) * pageSize;

    const voters = await prisma.voter.findMany({
      skip: skipVal,
      take: pageSize,
      orderBy: { createdAt: 'desc' }
    });

    const totalVoters = await prisma.voter.count();
    const totalPages = Math.ceil(totalVoters / pageSize);

    res.render('admin/voters', {
      title: 'Voters - SI-EVO Admin',
      voters,
      currentPage: page,
      totalPages,
      totalVoters
    });
  } catch (error) {
    console.error(error);
    res.render('admin/voters', {
      title: 'Voters - SI-EVO Admin',
      voters: [],
      currentPage: 1,
      totalPages: 0
    });
  }
};

/**
 * Get audit logs
 */
exports.getAudit = async (req, res) => {
  try {
    const { action, adminId, start, end, page = 1, limit: queryLimit } = req.query;
    const limit = Math.min(parseInt(queryLimit) || 10, 20);

    const list = new LinkedList();
    const auditLogs = await prisma.auditLog.findMany({
      orderBy: [{ timestamp: 'desc' }, { id: 'desc' }]
    });

    auditLogs.forEach(data => list.append(data.adminId, data));

    let result;
    if (action) result = list.getByAction(action);
    else if (start && end) result = list.getByDateRange(start, end);
    else if (adminId) result = list.getByAdmin(adminId);
    else if (queryLimit) result = list.getRecent(limit);
    else result = list.getAll();

    let displayNode = result.startNode;
    let skipCount = (parseInt(page) - 1) * limit;

    for (let i = 0; i < skipCount && displayNode !== null; i++) {
      displayNode = (action || adminId || (start && end) || queryLimit)
        ? displayNode.tempNext
        : displayNode.next;
    }

    res.render('admin/audit', {
      title: 'Audit Logs - SI-EVO Admin',
      startNode: displayNode,
      totalCount: result.total,
      currentPage: parseInt(page),
      limit,
      totalPages: Math.ceil(result.total / limit) || 1,
      currentAction: action || '',
      isFiltered: !!(action || adminId || (start && end) || queryLimit)
    });
  } catch (error) {
    console.error(error);
    res.render('admin/audit', {
      startNode: null,
      totalCount: 0,
      currentPage: 1,
      limit: 10,
      totalPages: 1,
      currentAction: '',
      isFiltered: false
    });
  }
};

/**
 * Get admin dashboard
 */
exports.getDashboard = async (req, res) => {
  try {
    const totalVoters = await prisma.voter.count();

    const latestSession = await prisma.electionSession.findFirst({
      orderBy: { id: 'desc' }
    });

    let sessionStatus = 'PREPARATION';
    let totalVotes = 0;
    let votersParticipated = 0;

    if (latestSession) {
      sessionStatus = latestSession.status;

      totalVotes = await prisma.vote.count({
        where: { electionSessionId: latestSession.id }
      });

      votersParticipated = await prisma.voter.count({
        where: { hasVoted: true }
      });
    }

    const recentActions = await prisma.auditLog.findMany({
      orderBy: { timestamp: 'desc' },
      take: 10
    });

    res.render('admin/dashboard', {
      title: 'Dashboard - SI-EVO Admin',
      totalVoters,
      votersParticipated,
      totalVotes,
      sessionStatus,
      recentActions
    });
  } catch (error) {
    console.error(error);
    res.render('admin/dashboard', {
      title: 'Dashboard - SI-EVO Admin',
      totalVoters: 0,
      votersParticipated: 0,
      totalVotes: 0,
      sessionStatus: 'ERROR',
      recentActions: []
    });
  }
};

/**
 * Perform admin action
 *  SNAPSHOT STATE UNDO BERSIH
 */
exports.performAction = async (req, res) => {
  try {
    const { type } = req.body;

    const currentSession = await prisma.electionSession.findFirst({
      orderBy: { id: 'desc' }
    });

    if (!currentSession) return res.redirect('/admin/dashboard');

    // ===== SNAPSHOT SEBELUM PERUBAHAN =====
    const existingVotes = await prisma.vote.findMany({
      where: { electionSessionId: currentSession.id },
      select: { id: true, voterId: true }
    });

    adminActionStack.push({
      action: type,
      sessionId: currentSession.id,
      previousStatus: currentSession.status,
      voteSnapshot: existingVotes.map(v => v.id),
      voterSnapshot: existingVotes.map(v => v.voterId)
    });

    let newStatus = currentSession.status;
    if (type === 'START_SESSION') newStatus = 'ACTIVE';
    if (type === 'PAUSE_SESSION') newStatus = 'PAUSED';
    if (type === 'END_SESSION') newStatus = 'ENDED';

    await prisma.electionSession.update({
      where: { id: currentSession.id },
      data: { status: newStatus }
    });

    await prisma.auditLog.create({
      data: {
        action: type,
        details: JSON.stringify({
          from: currentSession.status,
          to: newStatus
        })
      }
    });

    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.redirect('/admin/dashboard');
  }
};

/**
 * Undo admin action (STACK)
 */
exports.undoAction = async (req, res) => {
  try {
    if (adminActionStack.isEmpty()) {
      return res.redirect('/admin/dashboard');
    }

    const last = adminActionStack.pop();

    // kembalikan status session
    await prisma.electionSession.update({
      where: { id: last.sessionId },
      data: { status: last.previousStatus }
    });

    // hapus vote setelah snapshot
    await prisma.vote.deleteMany({
      where: {
        electionSessionId: last.sessionId,
        id: { notIn: last.voteSnapshot }
      }
    });

    // reset semua voter
    await prisma.voter.updateMany({
      data: { hasVoted: false }
    });

    // kembalikan voter snapshot
    if (last.voterSnapshot.length > 0) {
      await prisma.voter.updateMany({
        where: { id: { in: last.voterSnapshot } },
        data: { hasVoted: true }
      });
    }

    resetCounts();

    await prisma.auditLog.create({
      data: {
        action: 'UNDO_' + last.action,
        details: JSON.stringify({
          restoredStatus: last.previousStatus
        })
      }
    });

    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.redirect('/admin/dashboard');
  }
};
