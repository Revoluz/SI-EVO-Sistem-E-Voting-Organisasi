const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let counts = {};

/**
 * Display voting page with candidates
 */
exports.showVotePage = async (req, res) => {
  try {
    // login
    if (!req.session.voterId) {
      return res.redirect('/');
    }

    // cek voter
    const voter = await prisma.voter.findUnique({
      where: { id: req.session.voterId }
    });

    if (voter?.hasVoted) {
      return res.redirect('/results');
    }

    // ambil session TERAKHIR
    const electionSession = await prisma.electionSession.findFirst({
      orderBy: { id: 'desc' }
    });

    if (!electionSession) {
      return res.render('voter/vote', {
        title: 'Vote - SI-EVO',
        candidates: [],
        session: null,
        allowVote: false,
        errorMessage: 'Belum ada sesi pemilihan'
      });
    }

    // ambil kandidat
    const candidates = await prisma.candidate.findMany({
      where: { electionSessionId: electionSession.id }
    });

    //  render
    return res.render('voter/vote', {
      title: 'Vote - SI-EVO',
      candidates,
      session: electionSession,
      allowVote: electionSession.status === 'ACTIVE',
      errorMessage:
        electionSession.status === 'ENDED'
          ? 'Sesi pemilihan telah berakhir'
          : null,
      user: {
        id: req.session.voterId,
        name: req.session.voterName,
        email: req.session.voterEmail
      }
    });

  } catch (error) {
    console.error('Error loading vote page:', error);
    return res.render('voter/vote', {
      title: 'Vote - SI-EVO',
      candidates: [],
      session: null,
      allowVote: false,
      errorMessage: 'Terjadi kesalahan saat membuka halaman voting'
    });
  }
};


/**
 * Submit vote
 */
exports.submitVote = async (req, res) => {
  try {
    const electionSession = await prisma.electionSession.findFirst({
      where: { status: 'ACTIVE' },
      orderBy: { id: 'desc' }
    });

    if (!electionSession) {
      return res.json({ success: false, message: 'Voting tidak tersedia' });
    }

    if (!req.session.voterId) {
      return res.json({ success: false, message: 'Not authenticated' });
    }

    const cid = parseInt(req.body.candidateId);
    if (!cid) {
      return res.json({ success: false, message: 'Invalid candidate' });
    }

    const voterRecord = await prisma.voter.findUnique({ where : { id: req.session.voterId } });
    if (voterRecord?.hasVoted) {
      return res.json({ success: false, message: 'You have already voted' });
    }

    const payload = {
      voterId: req.session.voterId,
      candidateId: cid,
      electionSessionId: electionSession.id
    };

    // Prevent double votes by checking DB first
    const existingVote = await prisma.vote.findFirst({
      where: {
        voterId: req.session.voterId,
        electionSessionId: electionSession.id
      }
    });

    if (existingVote) {
      return res.json({ success: false, message: 'You have already voted' });
    }

    const voteQueueService = require('../services/voteQueue');
    const enqueueResult = voteQueueService.enqueue(payload, 5000);
    if (!enqueueResult) {
      return res.json({ success: false, message: 'Vote queue is full. Please try again later.' });
    }

    // Mark voter as having voted immediately so they can't re-submit while in queue
    await prisma.voter.update({
      where: { id: req.session.voterId },
      data: { hasVoted: true }
    });

    // Log that the vote was queued (will be processed by worker after delay)
    await prisma.auditLog.create({
      data: {
        action: 'VOTE_QUEUED',
        details: JSON.stringify({
          voterId: req.session.voterId,
          voterEmail: req.session.voterEmail,
          candidateId: cid,
          sessionId: electionSession.id,
          position: enqueueResult.position,
          processAfter: new Date(enqueueResult.processAfter).toISOString(),
          timestamp: new Date().toISOString()
        })
      }
    });

    // Respond with queue position and estimated wait time
    const etaMs = Math.max(0, enqueueResult.processAfter - Date.now());
    res.json({
      success: true,
      message: 'Vote queued successfully',
      position: enqueueResult.position,
      etaMs
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: 'Server error while submitting vote'
    });
  }
};

exports.resetCounts = () => {
  counts = {};
  console.log('↩ Real-time counts array RESET by UNDO');
};



/**
 * Show voting results
 */
exports.showResults = async (req, res) => {
  try {
    // ambil session aktif / ended
    const electionSession = await prisma.electionSession.findFirst({
      where: { status: { in: ['ACTIVE', 'ENDED'] } },
      orderBy: { startTime: 'desc' }
    });

    if (!electionSession) {
      return res.render('voter/results', {
        title: 'Results - SI-EVO',
        results: [],
        session: null
      });
    }


    const allCandidates = await prisma.candidate.findMany({
      where: { electionSessionId: electionSession.id }
    });

    // hitung vote dari DATABASE
    const voteCounts = await prisma.vote.groupBy({
      by: ['candidateId'],
      where: { electionSessionId: electionSession.id },
      _count: {
        candidateId: true
      }
    });

    const countMap = {};
    voteCounts.forEach(v => {
      countMap[v.candidateId] = v._count.candidateId;
    });

    const finalResults = allCandidates.map(c => ({
      candidateId: c.id,
      candidateName: c.name,
      voteCount: countMap[c.id] || 0
    }));


    console.log('✓ Results loaded from array counts');

    res.render('voter/results', {
      title: 'Results - SI-EVO',
      results: finalResults,
      session: electionSession,
      user: req.session.voterId ? {
        id: req.session.voterId,
        name: req.session.voterName,
        email: req.session.voterEmail
      } : null
    });

  } catch (error) {
    console.error('Error loading results:', error);
    res.render('voter/results', {
      title: 'Results - SI-EVO',
      results: [],
      session: null,
      errorMessage: 'An error occurred while loading the results'
    });
  }
};



