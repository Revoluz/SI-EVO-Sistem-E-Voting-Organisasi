
const Queue = require('../structures/Queue');

/**
 * voteQueue service
 * - enqueue(payload, baseDelayMs)
 * - waitUntil(timestamp)
 */
const voteQueueService = {
	/**
	 * Enqueue a vote payload and compute its position and processAfter timestamp.
	 * Returns false when queue is full, otherwise { position, processAfter }
	 */
	enqueue(payload, baseDelayMs = 5000) {
		// position is 1-based and equals current size + 1
		const position = Queue.size() + 1;
		const now = Date.now();
		const processAfter = now + baseDelayMs * position;

		const item = Object.assign({}, payload, {
			enqueuedAt: now,
			position,
			processAfter
		});

		const ok = Queue.enqueue(item);
		if (!ok) {
			console.warn('[VoteQueue] enqueue failed - queue full', { position, maxSize: Queue.getStats().maxSize });
			return false;
		}

		// Log enqueue details and queue stats
		try {
			const stats = Queue.getStats();
			console.log('[VoteQueue] enqueued', {
				position,
				processAfter: new Date(processAfter).toISOString(),
				enqueuedAt: new Date(now).toISOString(),
				queueSize: stats.size,
				maxSize: stats.maxSize,
				enqueuedCount: stats.enqueuedCount,
				dequeuedCount: stats.dequeuedCount
			});

			// Also print current internal queue array for visibility (best-effort)
			try {
				console.log('[VoteQueue] internal queue array:', JSON.stringify(Queue.data));
			} catch (e) {
				console.log('[VoteQueue] internal queue array: <unavailable>');
			}
		} catch (e) {
			// best-effort logging; don't throw
			console.log('[VoteQueue] enqueued position', position);
		}

		return { position, processAfter };
	},

	/**
	 * Returns a promise that resolves when Date.now() >= timestamp
	 */
	waitUntil(timestamp) {
		const now = Date.now();
		const ms = Math.max(0, timestamp - now);
		if (ms === 0) return Promise.resolve();
		return new Promise(resolve => setTimeout(resolve, ms));
	}
};

module.exports = voteQueueService;