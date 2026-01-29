
const {PrismaClient} = require('@prisma/client');
const BinarySearchTree = require('../structures/BSTCache');
const prisma = new PrismaClient();

class VoterCacheService {
  constructor(maxCacheSize = 25) {
    this.bstByEmail = new BinarySearchTree(); // Sorted by EMAIL
    this.maxCacheSize = maxCacheSize;
    this.cacheOrder = []; // Track email untuk FIFO eviction
  }

  async findByEmail(email) {
    console.log(`[Cache] Search email: ${email}`);

    let voter = this.bstByEmail.search(email);
    if (voter) {
      console.log(`[Cache] ✓ Hit (BST Email)`);
      return {
        id: voter.userId,
        name: voter.name,
        email: voter.email,
        password: voter.password,
      };
    }

    console.log(`[Cache] ✗ Miss, querying DB...`);
    voter = await prisma.voter.findUnique({
      where: { email },
    });

    if (voter) {
      this._addToCache(voter);
    }

    return voter;
  }
  async _addToCache(voter) {
    // Cek kapasitas cache
    if (this.cacheOrder.length >= this.maxCacheSize) {
      // Evict voter tertua (FIFO)
      const oldestEmail = this.cacheOrder.shift();
      this.bstByEmail.delete(oldestEmail);
      console.log(`[Cache] Evicted oldest voter with Email: ${oldestEmail}`);
    }

    // Tambah voter baru ke BST dan cacheOrder
    this.bstByEmail.insert(
      voter.id,
      voter.name,
      voter.email,
      voter.password
    );
    this.cacheOrder.push(voter.email);
    console.log(
      `[Cache] Added voter ID: ${voter.id} (Email: ${voter.email}) to cache`,
    );
  }

  getStats() {
    const allVoters = this.bstByEmail.getAll();
    this.bstByEmail.toString();
    return {
      size: this.bstByEmail.size,
      max: this.maxCacheSize,
      order: this.cacheOrder,
      tree: this.bstByEmail.getStats(),
      voters: allVoters.map((v) => ({
        id: v.userId,
        email: v.email,
        name: v.name,
      })),
    };
  }

}




module.exports = new VoterCacheService(2);