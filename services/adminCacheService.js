const { PrismaClient } = require('@prisma/client');
const BinarySearchTree = require('../structures/BSTCache');
const { name } = require('ejs');
const prisma = new PrismaClient();

class AdminCacheService {
  constructor(maxCacheSize = 10) {
    this.bstByEmail = new BinarySearchTree(); // Sorted by EMAIL
    this.maxCacheSize = maxCacheSize;
    this.cacheOrder = []; // Track email untuk FIFO eviction
  }

  /**
   * Find admin by email (dengan BST cache)
   * Cache first, fallback ke database
   */
  async findByEmail(email) {
    console.log(`[AdminCache] Search email: ${email}`);

    // Cek cache (BST)
    let admin = this.bstByEmail.search(email);
    if (admin) {
      console.log(`[AdminCache] ✓ Hit (BST Email)`);
      return {
        id: admin.userId,
        username: admin.name,
        email: admin.email,
        password: admin.password,
        isSuper: admin.isSuper || false,
      };
    }

    console.log(`[AdminCache] ✗ Miss, querying DB...`);
    admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (admin) {
      this._addToCache(admin);
    }

    return admin;
  }

  /**
   * Add admin to cache dengan FIFO eviction
   */
  _addToCache(admin) {
    // Cek kapasitas cache
    if (this.cacheOrder.length >= this.maxCacheSize) {
      // Evict admin tertua (FIFO)
      const oldestEmail = this.cacheOrder.shift();
      this.bstByEmail.delete(oldestEmail);
      console.log(`[AdminCache] Evicted oldest admin: ${oldestEmail}`);
    }

    // Tambah admin baru ke BST dan cacheOrder
    // insert(userId, name, email, password)
    this.bstByEmail.insert(
      admin.id,
      admin.username,
      admin.email,
      admin.password
    );

    // Track insertion order
    this.cacheOrder.push(admin.email);
    console.log(`[AdminCache] Added admin: ${admin.email}`);
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const allAdmins = this.bstByEmail.getAll();
    this.bstByEmail.toString();
    return {
      size: this.bstByEmail.size,
      max: this.maxCacheSize,
      length: this.cacheOrder.length,
      order: this.cacheOrder,
      tree: this.bstByEmail.getStats(),
      admins: allAdmins.map((a) => ({
        id: a.userId,
        email: a.email,
        name : a.name,
      })),
    };
  }

  /**
   * Clear cache (untuk testing/debugging)
   */
  clear() {
    this.bstByEmail = new BinarySearchTree();
    this.cacheOrder = [];
    console.log('[AdminCache] Cache cleared');
  }
}

// Export singleton instance
module.exports = new AdminCacheService(2);
