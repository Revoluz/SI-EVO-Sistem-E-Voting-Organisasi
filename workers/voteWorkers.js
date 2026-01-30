const voteQueue = require('../structures/Queue');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



let voteResultsArray = [];

// simple sleep helper
const sleep = ms => new Promise(res => setTimeout(res, ms));

const startWorker = () => {
    console.log("Worker suara mulai berjalan...");
    let processing = false;
    
    setInterval(async () => {
        if (voteQueue.size() > 0 && !processing) {
            processing = true;

            // Log current queue status and next item's schedule (best-effort)
            try {
                const next = voteQueue.peek();
                const stats = voteQueue.getStats();
                if (next) {
                    console.log('[VoteWorker] queue size', stats.size, 'next position', next.position, 'processAfter', new Date(next.processAfter).toISOString());
                } else {
                    console.log('[VoteWorker] queue size', stats.size, 'no peek item');
                }
            } catch (e) {
                // ignore logging errors
            }

            // wait 5 seconds before dequeuing to make the queue visible to users
            const preDequeueMs = 10000;
            console.log('[VoteWorker] queue non-empty, waiting', preDequeueMs, 'ms before dequeuing');
            await sleep(preDequeueMs);

            const votesToProcess = voteQueue.dequeueBatch(5);
            
            for (const vote of votesToProcess) {
                try {
                    // include electionSessionId (required by prisma schema)
                    await prisma.vote.create({
                        data: {
                            voterId: vote.voterId,
                            candidateId: vote.candidateId,
                            electionSessionId: vote.electionSessionId
                        }
                    });

                    // Log inserted vote payload and current queue internal array
                    console.log('Suara berhasil diproses:', JSON.stringify({
                        voterId: vote.voterId,
                        candidateId: vote.candidateId,
                        electionSessionId: vote.electionSessionId
                    }));

                    try {
                        // Access internal queue array for debugging (best-effort)
                        console.log('[VoteWorker] current queue array (internal):', JSON.stringify(voteQueue.data));
                    } catch (e) {
                        console.log('[VoteWorker] current queue array: <unavailable>');
                    }
                } catch (err) {
                    // handle duplicate or constraint errors gracefully
                    if (err.code === 'P2002') {
                        // unique constraint violation (voter already has a vote for this session)
                        console.warn(`Vote already exists for voterId=${vote.voterId} session=${vote.electionSessionId}`);
                    } else {
                        console.error('Gagal memproses suara:', err);
                    }
                }
            }
            processing = false;
        }
    }, 2000); 
};

module.exports = { startWorker };