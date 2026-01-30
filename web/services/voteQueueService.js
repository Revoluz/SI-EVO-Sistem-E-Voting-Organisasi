// const Queue = require('../structures/Queue');
// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// class VoteQueueService {
//   constructor(maxQueueSize = 50, processingInterval = 5000) {
//     this.queue = new Queue(maxQueueSize);
//     this.processingInterval = processingInterval;
//     this.isProcessing = false;
//     this.startBackgroundWorker();
//   }

//   enqueue(vote) {
//     const success = this.queue.enqueue(vote);
//     if (success) {
//       const position = this.queue.size();
//       const waitTime = position * this.processingInterval;
//       console.log(`📥 Vote enqueued | Pos: ${position} | Wait: ${Math.ceil(waitTime/1000)}s | Queue: [${this.queue.size()}/${this.queue.maxSize}]`);
//       return { success: true, position, waitTime };
//     }
//     console.log('❌ Queue penuh! Tidak bisa enqueue vote.');
//     return { success: false, message: 'Queue is full. Please try again later.' };
//   }

//   startBackgroundWorker() {
//     setInterval(async () => {
//       if (this.queue.size() > 0 && !this.isProcessing) {
//         await this.processQueue();
//       }
//     }, this.processingInterval);
//   }

//   async processQueue() {
//     if (this.isProcessing) return;
//     this.isProcessing = true;

//     try {
//       const votes = this.queue.dequeueBatch(5);
      
//       if (votes.length > 0) {
//         console.log(`\n⚙️  Processing Queue | Batch: ${votes.length} votes | Remaining: ${this.queue.size()}`);
        
//         for (const vote of votes) {
//           try {
//             // Save to database
//             await prisma.vote.create({
//               data: {
//                 voterId: vote.voterId,
//                 candidateId: vote.candidateId,
//                 electionSessionId: vote.electionSessionId,
//                 votedAt: new Date()
//               }
//             });

//             // Catat ke audit log
//             await prisma.auditLog.create({
//               data: {
//                 action: 'VOTE_SUBMITTED',
//                 details: JSON.stringify({
//                   voteId: vote.voterId,
//                   voterId: vote.voterId,
//                   candidateId: vote.candidateId,
//                   sessionId: vote.electionSessionId,
//                   timestamp: new Date().toISOString()
//                 })
//               }
//             });

//             // Update voter status
//             await prisma.voter.update({
//               where: { id: vote.voterId },
//               data: { hasVoted: true }
//             });

//             console.log(`✅ Vote saved | Voter: ${vote.voterId} | Candidate: ${vote.candidateId}`);
//           } catch (error) {
//             console.error(`⚠️  Error voter ${vote.voterId}:`, error.message);
//           }
//         }

//         const stats = this.queue.getStats();
//         console.log(`📊 Queue Stats | Size: ${stats.size}/${stats.maxSize} | Enqueued: ${stats.enqueuedCount} | Processed: ${stats.dequeuedCount}\n`);
//       }
//     } catch (error) {
//       console.error('[Queue] Error processing batch:', error);
//     } finally {
//       this.isProcessing = false;
//     }
//   }

//   getStats() {
//     return this.queue.getStats();
//   }
// }

// module.exports = new VoteQueueService(50, 3000);
