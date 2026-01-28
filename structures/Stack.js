class Stack {
  constructor(maxSize = 50) {
    this.items = [];
    this.maxSize = maxSize;
  }

  push(action) {
    if (this.items.length >= this.maxSize) {
      this.items.shift(); // buang yang paling lama
    }
    this.items.push(action);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }

  getHistory() {
    return this.items;
  }
}

module.exports = Stack;
