/**
 * Binary Search Tree Implementation for SI-EVO
 * Simple tree structure for voter validation and search
 * Time Complexity: Insert O(log n) avg, O(n) worst | Search O(log n) avg, O(n) worst
 */

class BSTNode {
  constructor(voterId, nikNumber, name, email, password) {
    this.voterId = voterId;      // Unique voter ID from database
    this.nikNumber = nikNumber;  // Indonesian ID number (search key)
    this.name = name;
    this.email = email;
    this.password = password;    // Hashed password
    this.left = null;            // Left child (smaller values)
    this.right = null;           // Right child (larger values)
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
    this.size = 0;
  }

  /**
   * Insert voter into BST
   * Returns true if inserted, false if already exists
   */
  insert(voterId, nikNumber, name, email, password) {
    const oldSize = this.size;
    this.root = this._insertNode(this.root, voterId, nikNumber, name, email, password);
    return this.size > oldSize;
  }

  /**
   * Recursive insert
   */
  _insertNode(node, voterId, nikNumber, name, email, password) {
    // Base case: empty node
    if (node === null) {
      this.size++;
      return new BSTNode(voterId, nikNumber, name, email, password);
    }

    // Compare by nikNumber (primary key for search)
    if (nikNumber < node.nikNumber) {
      node.left = this._insertNode(node.left, voterId, nikNumber, name, email, password);
    } else if (nikNumber > node.nikNumber) {
      node.right = this._insertNode(node.right, voterId, nikNumber, name, email, password);
    } else {
      // Duplicate - voter already exists
      return node;
    }

    return node;
  }

  /**
   * Search voter by NIK number
   * Returns voter object if found, null otherwise
   */
  search(nikNumber) {
    return this._searchNode(this.root, nikNumber);
  }

  /**
   * Recursive search
   */
  _searchNode(node, nikNumber) {
    if (node === null) {
      return null;
    }

    if (nikNumber < node.nikNumber) {
      return this._searchNode(node.left, nikNumber);
    } else if (nikNumber > node.nikNumber) {
      return this._searchNode(node.right, nikNumber);
    } else {
      return {
        voterId: node.voterId,
        nikNumber: node.nikNumber,
        name: node.name,
        email: node.email,
        password: node.password
      };
    }
  }

  /**
   * Check if voter exists
   */
  exists(nikNumber) {
    return this.search(nikNumber) !== null;
  }

  /**
   * Delete voter from tree
   */
  delete(nikNumber) {
    const oldSize = this.size;
    this.root = this._deleteNode(this.root, nikNumber);
    return this.size < oldSize;
  }

  /**
   * Recursive delete
   */
  _deleteNode(node, nikNumber) {
    if (node === null) {
      return null;
    }

    if (nikNumber < node.nikNumber) {
      node.left = this._deleteNode(node.left, nikNumber);
    } else if (nikNumber > node.nikNumber) {
      node.right = this._deleteNode(node.right, nikNumber);
    } else {
      // Found node to delete
      this.size--;

      // Case 1: Leaf node (no children)
      if (node.left === null && node.right === null) {
        return null;
      }

      // Case 2: Only right child
      if (node.left === null) {
        return node.right;
      }

      // Case 3: Only left child
      if (node.right === null) {
        return node.left;
      }

      // Case 4: Both children exist
      // Find in-order successor (smallest in right subtree)
      let minRight = node.right;
      while (minRight.left !== null) {
        minRight = minRight.left;
      }

      // Replace node with successor
      node.nikNumber = minRight.nikNumber;
      node.voterId = minRight.voterId;
      node.name = minRight.name;
      node.email = minRight.email;

      // Delete successor
      node.right = this._deleteNode(node.right, minRight.nikNumber);
    }

    return node;
  }

  /**
   * Get all voters in sorted order (in-order traversal)
   */
  getAll() {
    const result = [];
    this._inOrderTraversal(this.root, result);
    return result;
  }

  /**
   * In-order traversal (Left -> Root -> Right)
   * Returns nodes in sorted order
   */
  _inOrderTraversal(node, result) {
    if (node === null) {
      return;
    }

    this._inOrderTraversal(node.left, result);
    result.push({
      voterId: node.voterId,
      nikNumber: node.nikNumber,
      name: node.name,
      email: node.email,
      password: node.password
    });
    this._inOrderTraversal(node.right, result);
  }

  /**
   * Get tree height
   */
  getHeight(node = this.root) {
    if (node === null) {
      return 0;
    }
    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  /**
   * Get tree statistics
   */
  getStats() {
    return {
      totalNodes: this.size,
      treeHeight: this.getHeight(),
      isEmpty: this.size === 0
    };
  }

  /**
   * Clear all nodes
   */
  clear() {
    this.root = null;
    this.size = 0;
  }

  /**
   * Get tree as visual string (for debugging)
   */
  toString() {
    const lines = [];
    this._buildTreeString(this.root, '', true, lines);
    return lines.join('\n');
  }

  _buildTreeString(node, prefix, isTail, lines) {
    if (node === null) {
      return;
    }

    lines.push(
      prefix + (isTail ? '└── ' : '├── ') + 
      `${node.nikNumber} (${node.name})`
    );

    const children = [];
    if (node.left !== null) children.push({ node: node.left, isLeft: true });
    if (node.right !== null) children.push({ node: node.right, isLeft: false });

    children.forEach((child, index) => {
      const isLast = index === children.length - 1;
      const extension = isTail ? '    ' : '│   ';
      this._buildTreeString(child.node, prefix + extension, isLast, lines);
    });
  }
}

module.exports = BinarySearchTree;