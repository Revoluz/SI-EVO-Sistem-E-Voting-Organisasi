const BinarySearchTree = require("../structure/BSTCache");

class VoterServices {
  constructor() {
    this.voterCache = new BinarySearchTree();
  }

  /**
   * Mencari voter berdasarkan username menggunakan cache BST
   */
  findVoterUserName(name) {
    return this.voterCache.search(name);
  }


  /**
   * Menambahkan voter ke cache BST
   */
  addVoterToCache(voter) {
    this.voterCache.insert(voter.id, voter.name, voter.email, voter.password);
  }

  getStats() {
    const allVoters = this.voterCache.getAll();
    this.voterCache.toString();
    return {
      size: this.voterCache.size,
      max: this.maxCacheSize,
      order: this.cacheOrder,
      tree: this.voterCache.getStats(),
      voters: allVoters.map((v) => ({
        id: v.userId,
        email: v.email,
        name: v.name,
      })),
    };
  }
}

module.exports = VoterServices;