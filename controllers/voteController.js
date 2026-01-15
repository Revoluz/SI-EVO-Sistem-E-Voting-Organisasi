const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

let counts = {};

/**
 * Display voting page with candidates
 */
exports.showVotePage = async (req, res) => {
  try {
    // Check if voter is authenticated
    if (!req.session.voterId) {
      return res.redirect('/');
    }

    // Check if voter has already voted
    const voter = await prisma.voter.findUnique({
      where: { id: req.session.voterId }
    });

    if (voter && voter.hasVoted) {
      return res.redirect('/results');
    }

    // Fetch active election session
    const electionSession = await prisma.electionSession.findFirst({
      where: { status: 'ACTIVE' }
    });

    if (!electionSession) {
      return res.render('voter/vote', {
        title: 'Vote - SI-EVO',
        candidates: [],
        session: null,
        errorMessage: 'No active election session available'
      });
    }

    // Fetch candidates for this session
    const candidates = await prisma.candidate.findMany({
      where: { electionSessionId: electionSession.id }
    });

    console.log(`✓ Vote page loaded for voter: ${req.session.voterEmail}`);

    res.render('voter/vote', {
      title: 'Vote - SI-EVO',
      candidates,
      session: electionSession,
      user: {
        id: req.session.voterId,
        name: req.session.voterName,
        email: req.session.voterEmail
      }
    });
  } catch (error) {
    console.error('Error loading vote page:', error);
    res.render('voter/vote', {
      title: 'Vote - SI-EVO',
      candidates: [],
      session: null,
      errorMessage: 'An error occurred while loading the voting page'
    });
  }
};

/**
 * Submit vote
 */
exports.submitVote = async (req, res) => {
  try {
    // Check if voter is authenticated
    if (!req.session.voterId) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authenticated' 
      });
    }

    const { candidateId } = req.body;

    // Validate candidateId
    if (!candidateId || typeof candidateId !== 'number') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid candidate ID' 
      });
    }

    // Check if voter has already voted
    const voter = await prisma.voter.findUnique({
      where: { id: req.session.voterId }
    });

    if (voter.hasVoted) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already voted' 
      });
    }

    // Verify candidate exists
    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId }
    });

    if (!candidate) {
      return res.status(404).json({ 
        success: false, 
        message: 'Candidate not found' 
      });
    }

    // Get active election session
    const electionSession = await prisma.electionSession.findFirst({
      where: { status: 'ACTIVE' }
    });

    if (!electionSession) {
      return res.status(400).json({ 
        success: false, 
        message: 'No active election session' 
      });
    }

    // Create vote record
    const vote = await prisma.vote.create({
      data: {
        voterId: req.session.voterId,
        candidateId,
        electionSessionId: electionSession.id,
        votedAt: new Date()
      }
    });

    // Update voter hasVoted flag
    await prisma.voter.update({
      where: { id: req.session.voterId },
      data: { hasVoted: true }
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        action: 'VOTE',
        details: JSON.stringify({
          voterId: req.session.voterId,
          candidateId,
          electionSessionId: electionSession.id,
          timestamp: new Date().toISOString()
        })
      }
    });

    console.log(`✓ Vote submitted - Voter: ${req.session.voterEmail}, Candidate ID: ${candidateId}`);
    counts[candidateId] = (counts[candidateId] || 0) + 1; 
    console.log(`✓ Real-time Array Updated: Candidate ${candidateId} now has ${counts[candidateId]} votes`);
    
    res.json({ 
      success: true, 
      message: 'Vote submitted successfully',
      voteId: vote.id 
    });
  } catch (error) {
    console.error('Error submitting vote:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while submitting your vote' 
    });
  }
};

/**
 * Show voting results
 */
exports.showResults = async (req, res) => {
  try {
    // Get active election session
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

    // Fetch vote counts grouped by candidate
    const voteResults = await prisma.vote.groupBy({
      by: ['candidateId'],
      where: { electionSessionId: electionSession.id },
      _count: {
        id: true
      }
    });

    // Get candidate details and map to results
    const results = await Promise.all(
      voteResults.map(async (vr) => {
        const candidate = await prisma.candidate.findUnique({
          where: { id: vr.candidateId }
        });
        return {
          candidateId: vr.candidateId,
          candidateName: candidate?.name || 'Unknown',
          voteCount: vr._count.id
        };
      })
    );

    // Get candidates with zero votes
    const allCandidates = await prisma.candidate.findMany({
      where: { electionSessionId: electionSession.id }
    });

    const candidatesWithZeroVotes = allCandidates.filter(
      c => !results.find(r => r.candidateId === c.id)
    );

    const zeroVoteResults = candidatesWithZeroVotes.map(c => ({
      candidateId: c.id,
      candidateName: c.name,
      voteCount: 0
    }));

    const finalResults = allCandidates.map(c => ({
  candidateId: c.id,
  candidateName: c.name,    
  voteCount: counts[c.id] || 0 
    }));

    console.log(`✓ Results page loaded. Total votes: ${finalResults.reduce((sum, r) => sum + r.voteCount, 0)}`);

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
