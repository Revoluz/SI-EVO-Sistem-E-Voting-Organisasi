const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let counts = {};

/**
 * Display voting page with candidates
 */
exports.showVotePage = async (req, res) => {
  try {
    // 1️⃣ wajib login
    if (!req.session.voterId) {
      return res.redirect('/');
    }

    // 2️⃣ cek voter
    const voter = await prisma.voter.findUnique({
      where: { id: req.session.voterId }
    });

    if (voter?.hasVoted) {
      return res.redirect('/results');
    }

    // 3️⃣ ambil session TERAKHIR
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

    // 4️⃣ ambil kandidat
    const candidates = await prisma.candidate.findMany({
      where: { electionSessionId: electionSession.id }
    });

    // 5️⃣ render SATU KALI SAJA
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
    // ambil session aktif
    const electionSession = await prisma.electionSession.findFirst({
      where: { status: 'ACTIVE' },
      orderBy: { id: 'desc' }
    });

    if (!electionSession) {
      return res.json({
        success: false,
        message: 'Voting tidak tersedia. Session belum ACTIVE.'
      });
    }

    // cek login
    if (!req.session.voterId) {
      return res.json({ 
        success: false, 
        message: 'Not authenticated' 
      });
    }

    // ambil candidateId
    const { candidateId } = req.body;
    const cid = parseInt(candidateId);

    if (!cid || isNaN(cid)) {
      return res.json({ 
        success: false, 
        message: 'Invalid candidate ID' 
      });
    }

    // cek sudah voting
    const voter = await prisma.voter.findUnique({
      where: { id: req.session.voterId }
    });

    if (voter.hasVoted) {
      return res.json({ 
        success: false, 
        message: 'You have already voted' 
      });
    }

    // cek candidate
    const candidate = await prisma.candidate.findUnique({
      where: { id: cid }
    });

    if (!candidate) {
      return res.json({ 
        success: false, 
        message: 'Candidate not found' 
      });
    }

    // simpan vote ke database
    const vote = await prisma.vote.create({
      data: {
        voterId: req.session.voterId,
        candidateId: cid,
        electionSessionId: electionSession.id,
        votedAt: new Date()
      }
    });

    // update voter
    await prisma.voter.update({
      where: { id: req.session.voterId },
      data: { hasVoted: true }
    });

    // 🔥🔥🔥 KERJAAN TEMENMU — ARRAY REAL-TIME (JANGAN DIHAPUS)
    counts[cid] = (counts[cid] || 0) + 1;
    console.log(`✓ Real-time Array Updated: Candidate ${cid} now has ${counts[cid]} votes`);

    // audit log (tetap)
    await prisma.auditLog.create({
      data: {
        action: 'VOTE',
        details: JSON.stringify({
          voterId: req.session.voterId,
          candidateId: cid,
          electionSessionId: electionSession.id
        })
      }
    });

    res.json({ 
      success: true, 
      message: 'Vote submitted successfully',
      voteId: vote.id 
    });

  } catch (error) {
    console.error('Error submitting vote:', error);
    res.json({ 
      success: false, 
      message: 'Server error while submitting vote' 
    });
  }
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

    // ambil semua kandidat di session ini  🔥🔥🔥 (INI YANG HILANG TADI)
    const allCandidates = await prisma.candidate.findMany({
      where: { electionSessionId: electionSession.id }
    });

    // 🔥 PAKAI ARRAY counts KERJAAN TEMENMU (TIDAK DIHAPUS)
    const finalResults = allCandidates.map(c => ({
      candidateId: c.id,
      candidateName: c.name,
      voteCount: counts[c.id] || 0
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

// 🔥 FUNGSI RESET ARRAY (UNTUK UNDO ADMIN)
exports.resetCounts = () => {
  counts = {};
  console.log('↩ Real-time counts array RESET by UNDO');
};
