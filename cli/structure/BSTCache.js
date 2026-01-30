class Node {
  constructor(userId, name, password, voted = false) {
    this.userId = userId;
    this.name = name;
    this.password = password;
    this.voted = voted;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
    this.size = 0;
  }

  /**
   * Insert new user (voter or admin)
   */
  insert(userId,  name,  password) {
    const oldSize = this.size;
    this.root = this._insertNode(
      this.root,
      userId,
      name,
      password,
    );
    return this.size > oldSize;
  }
  _insertNode(node, userId,  name, password) {
    if (node === null) {
      this.size++;
      return new Node(userId,  name, password);
    }
    if (name < node.name) {
      node.left = this._insertNode(
        node.left,
        userId,
        name,
        password,
      );
    } else if (name > node.name) {
      node.right = this._insertNode(
        node.right,
        userId,
        name,
        password,
      );
    } else {
      // Duplicate email, do not insert
      return node;
    }
    return node;
  }
  search(name) {
    console.log('Searching for name:', name);
    return this._searchNode(this.root, name);
  }
  _searchNode(node, name) {
    if (node === null) {
      return null;
    }
    if (name < node.name) {
      return this._searchNode(node.left, name);
    } else if (name > node.name) {
      return this._searchNode(node.right, name);
    } else {
      // console.log('Found node:', node);
      return node;
    }
  }
  searchNameAndPassword(name, password) {
    return this._searchNameAndPasswordNode(this.root, name, password);
  }
  _searchNameAndPasswordNode(node, name, password) {
    if (node === null) {
      return null;
    }
    if (name < node.name) {
      return this._searchNameAndPasswordNode(node.left, name, password);
    } else if (name > node.name) {
      return this._searchNameAndPasswordNode(node.right, name, password);
    } else {
      // Name matches, check password
      if (node.password === password) {
        return node;
      } else {
        return null;
      }
    }
  }

  /**
   * Get all users in sorted order (in-order traversal)
   */
  getAll() {
    const result = [];
    this._inOrderTraversal(this.root, result);
    return result;
  }
  _inOrderTraversal(node, result) {
    if (node !== null) {
      this._inOrderTraversal(node.left, result);
      result.push({
        userId: node.userId,
        name: node.name,
        password: node.password,
      });
      this._inOrderTraversal(node.right, result);
    }
  }
  /**
   * Clear the tree
   */
  clear() {
    this.root = null;
    this.size = 0;
  }

  exists(name) {
    return this.search(name) !== null;
  }

  delete(name) {
    const oldSize = this.size;
    this.root = this._deleteNode(this.root, name);
    return this.size < oldSize;
  }

  _deleteNode(node, name) {
    if (node === null) {
      return null;
    }

    if (name < node.name) {
      node.left = this._deleteNode(node.left, name);
    } else if (name > node.name) {
      node.right = this._deleteNode(node.right, name);
    } else {
      // Node found
      this.size--;

      // Node with only one child or no child
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }

      // Node with two children: Get the inorder successor (smallest in the right subtree)
      let successor = node.right;
      while (successor.left !== null) {
        successor = successor.left;
      }

      // Copy the inorder successor's content to this node
      node.userId = successor.userId;
      node.name = successor.name;
      node.password = successor.password;

      // Delete the inorder successor
      node.right = this._deleteNode(node.right, successor.name);
    }
    return node;
  }
  /**
   * Get tree as visual string (for debugging)
   */
  toString() {
    const lines = [];
    this._buildTreeString(this.root, "", true, lines);
    return lines.join("\n");
  }

  _buildTreeString(node, prefix, isTail, lines) {
    if (node === null) {
      return;
    }

    lines.push(
      prefix + (isTail ? "└── " : "├── ") + `${node.name} (ID: ${node.userId})`,
    );

    const children = [];
    if (node.left !== null) children.push({ node: node.left, isLeft: true });
    if (node.right !== null) children.push({ node: node.right, isLeft: false });

    children.forEach((child, index) => {
      const isLast = index === children.length - 1;
      const extension = isTail ? "    " : "│   ";
      this._buildTreeString(child.node, prefix + extension, isLast, lines);
    });
  }
  getStats() {
    return {
      totalNodes: this.size,
      treeHeight: this.getHeight(),
      isEmpty: this.size === 0,
    };
  }
  getHeight(node = this.root) {
    if (node === null) {
      return 0;
    }
    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }
}

module.exports = BinarySearchTree;