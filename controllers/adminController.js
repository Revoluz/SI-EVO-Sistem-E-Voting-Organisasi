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
        // cek dan ambil seluruh request dari audit.ejs
        const {action, adminId, start, end, page = 1 , limit: queryLimit} = req.query;
        // batas data yang ingin ditampilkan jika tidak ada maka 10 dan maksimal 1000 
        const limit = Math.min(parseInt(queryLimit) || 10, 1000);
        // buat object linkedlist baru
        const list = new LinkedList();

        // ambil data dari database dan tambahkan ke object linkedlist
        const auditLogs = await prisma.auditLog.findMany({ orderBy: { timestamp: 'desc' } });
        auditLogs.forEach(data => list.append(data.adminId, data));

        // seleksi sesuai request yang tercipta dari audit.ejs
        let result;
        if (action) {
            result = list.getByAction(action);
        } else if (start && end) {
            result = list.getByDateRange(start, end);
        } else if (adminId) {
            result = list.getByAdmin(adminId);
        } else if (queryLimit) {
            result = list.getRecent(limit);
        } else{
            result = list.getAll();
        }

        // simpan pointer head
        let displayNode = result.startNode;
        // hitung pagination untuk iterasi node berikutnya 
        let skipCount = (parseInt(page) - 1) * limit;

        // Navigasi ke halaman yang tepat dengan tenary operator
        for (let i = 0; i < skipCount && displayNode !== null; i++) {
            displayNode = (action || adminId || (start && end) || queryLimit) ? displayNode.tempNext : displayNode.next;
        }

        // kirimkan semua data ke admin/audit.ejs
        res.render('admin/audit', {
            title: 'Audit Logs - SI-EVO Admin',
            startNode: displayNode,
            totalCount: result.total, // Gunakan nama totalCount agar sesuai EJS
            currentPage: parseInt(page),
            limit: limit,
            totalPages: Math.ceil(result.total / limit) || 1,
            currentAction: action || '',
            isFiltered: !!(action || adminId || (start && end) || queryLimit)
        });
    } catch (error) { // tangkap error yang tercipta
        console.error(error);
        res.render('admin/audit', { startNode: null, totalCount: 0, currentPage: 1, limit: 10, totalPages: 1, currentAction: '', isFiltered: false });
    }
};

/**
 * Get admin dashboard
 */
exports.getDashboard = async (req, res) => {
  try {
    // total voter
    const totalVoters = await prisma.voter.count();

    // ambil session TERAKHIR (bukan cuma ACTIVE)
    const latestSession = await prisma.electionSession.findFirst({
      orderBy: { id: 'desc' }
    });

    let sessionStatus = 'PREPARATION';
    let totalVotes = 0;
    let votersParticipated = 0;

    if (latestSession) {
      sessionStatus = latestSession.status;

      // hitung vote HANYA kalau session ACTIVE
      if (latestSession.status === 'ACTIVE') {
        totalVotes = await prisma.vote.count({
          where: { electionSessionId: latestSession.id }
        });

        votersParticipated = await prisma.voter.count({
          where: { hasVoted: true }
        });
      }
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
    console.error('Error loading dashboard:', error);
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


exports.performAction = async (req, res) => {
  try {
    const { type } = req.body;

    // Ambil session terakhir
    const currentSession = await prisma.electionSession.findFirst({
      orderBy: { id: 'desc' }
    });

    if (!currentSession) {
      return res.redirect('/admin/dashboard');
    }

    // SIMPAN STATUS LAMA KE STACK (UNTUK UNDO)
    // SIMPAN STATUS LAMA + WAKTU (UNTUK UNDO TOTAL)
    adminActionStack.push({
      sessionId: currentSession.id,
      previousStatus: currentSession.status,
      action: type,
      time: new Date(),              // waktu admin klik
      startTime: type === 'START_SESSION' ? new Date() : null
    });



    let newStatus = currentSession.status;

    if (type === 'START_SESSION') newStatus = 'ACTIVE';
    if (type === 'PAUSE_SESSION') newStatus = 'PAUSED';
    if (type === 'END_SESSION') newStatus = 'ENDED';

    // UPDATE STATUS SESSION
    await prisma.electionSession.update({
      where: { id: currentSession.id },
      data: { status: newStatus }
    });

    // SIMPAN KE AUDIT LOG
    await prisma.auditLog.create({
      data: {
        action: type,
        details: JSON.stringify({
          from: currentSession.status,
          to: newStatus
        })
      }
    });

    console.log(`✓ SESSION CHANGED: ${currentSession.status} → ${newStatus}`);

    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error performAction:', error);
    res.redirect('/admin/dashboard');
  }
};

exports.undoAction = async (req, res) => {
  try {
    if (adminActionStack.isEmpty()) {
      console.log('⚠ Tidak ada aksi untuk di-undo');
      return res.redirect('/admin/dashboard');
    }

    const lastAction = adminActionStack.pop();

    // BALIKKAN STATUS SESSION
    await prisma.electionSession.update({
      where: { id: lastAction.sessionId },
      data: { status: lastAction.previousStatus }
    });

    // 🔥 JIKA UNDO DARI START_SESSION → ROLLBACK SEMUA VOTING
    if (lastAction.action === 'START_SESSION' && lastAction.startTime) {

      console.log('↩ UNDO START_SESSION → rollback voting');

      // ambil semua vote setelah START
      const votesToDelete = await prisma.vote.findMany({
        where: {
          electionSessionId: lastAction.sessionId,
          votedAt: { gte: lastAction.startTime }
        }
      });

      // ambil semua voter yang tadi voting
      const voterIds = votesToDelete.map(v => v.voterId);

      // hapus vote-vote itu
      await prisma.vote.deleteMany({
        where: {
          electionSessionId: lastAction.sessionId,
          votedAt: { gte: lastAction.startTime }
        }
      });

      // balikin voter.hasVoted = false
      if (voterIds.length > 0) {
        await prisma.voter.updateMany({
          where: { id: { in: voterIds } },
          data: { hasVoted: false }
        });
      }

      // 🔥 RESET ARRAY REAL-TIME (KERJAAN TEMENMU AMAN)
      resetCounts();
    }

    // SIMPAN LOG UNDO
    await prisma.auditLog.create({
      data: {
        action: 'UNDO_' + lastAction.action,
        details: JSON.stringify({
          backTo: lastAction.previousStatus
        })
      }
    });

    console.log(`↩ UNDO BERHASIL: Session kembali ke ${lastAction.previousStatus}`);

    res.redirect('/admin/dashboard');

  } catch (error) {
    console.error('Error undoAction:', error);
    res.redirect('/admin/dashboard');
  }
};
