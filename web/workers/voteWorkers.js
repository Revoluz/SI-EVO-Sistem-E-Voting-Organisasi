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

            const stats = voteQueue.getStats();
            console.log('\n📊 SEBELUM DEQUEUE');
            console.log('   Queue Size:', stats.size);
            console.log('   Queue Array:', JSON.stringify(voteQueue.data, null, 2));

            // wait 5 seconds before dequeuing to make the queue visible to users
            const preDequeueMs = 10000;
            console.log(`\n⏳ Menunggu ${preDequeueMs}ms sebelum dequeue...\n`);
            await sleep(preDequeueMs);

            console.log('📤 DEQUEUING 5 VOTES...');
            const votesToProcess = voteQueue.dequeueBatch(5);
            
            console.log('✅ SETELAH DEQUEUE');
            console.log('   Votes diambil:', votesToProcess.length);
            console.log('   Queue Array:', JSON.stringify(voteQueue.data, null, 2));
            console.log('   Queue Size:', voteQueue.size());
            
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
                    console.log('💾 Suara berhasil disimpan ke DB:', JSON.stringify({
                        voterId: vote.voterId,
                        candidateId: vote.candidateId,
                        electionSessionId: vote.electionSessionId
                    }));

                } catch (err) {
                    // handle duplicate or constraint errors gracefully
                    if (err.code === 'P2002') {
                        // unique constraint violation (voter already has a vote for this session)
                        console.warn(`⚠️  Vote sudah ada untuk voterId=${vote.voterId} session=${vote.electionSessionId}`);
                    } else {
                        console.error('❌ Gagal memproses suara:', err);
                    }
                }
            }
            console.log('');
            processing = false;
        }
    }, 2000); 
};

module.exports = { startWorker };