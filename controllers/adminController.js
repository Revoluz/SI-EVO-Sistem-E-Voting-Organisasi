const { PrismaClient } = require('@prisma/client');
const { skip } = require('@prisma/client/runtime/library');
const prisma = new PrismaClient();
const LinkedList = require('../structures/LinkedList');
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
