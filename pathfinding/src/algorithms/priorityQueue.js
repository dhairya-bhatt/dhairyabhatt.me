/**
 * @fileoverview Custom zero-dependency Binary Min-Heap Priority Queue.
 *
 * Implemented using a flat contiguous array where indices satisfy:
 *   parent(i) = Math.floor((i - 1) / 2)
 *   leftChild(i) = 2 * i + 1
 *   rightChild(i) = 2 * i + 2
 *
 * Provides O(log N) push and pop, and O(1) peek.
 * Contiguous array storage minimizes memory fragmentation and provides
 * superior CPU cache locality compared to pointer-based trees.
 */

export class PriorityQueue {
  /**
   * @param {function(any, any): number} [comparator]
   * Negative if a has higher priority (comes first) than b.
   * Defaults to comparing an item's numeric `.priority` property.
   */
  constructor(comparator = (a, b) => a.priority - b.priority) {
    this.heap = [];
    this.comparator = comparator;
  }

  /**
   * Returns current count of elements in the heap.
   * @returns {number}
   */
  size() {
    return this.heap.length;
  }

  /**
   * Checks if heap contains zero items.
   * @returns {boolean}
   */
  isEmpty() {
    return this.heap.length === 0;
  }

  /**
   * Returns highest priority element without removing it.
   * @returns {any | undefined}
   */
  peek() {
    return this.heap[0];
  }

  /**
   * Inserts an item and bubbles it up to restore heap invariant.
   * Time complexity: O(log N)
   * @param {any} item
   */
  push(item) {
    this.heap.push(item);
    this._bubbleUp(this.heap.length - 1);
  }

  /**
   * Removes and returns highest priority element.
   * Replaces root with last leaf, then trickles it down to restore heap invariant.
   * Time complexity: O(log N)
   * @returns {any | undefined}
   */
  pop() {
    if (this.isEmpty()) {
      return undefined;
    }

    const top = this.heap[0];
    const bottom = this.heap.pop();

    // If more than one element was present, place the last element at root and sink
    if (this.heap.length > 0) {
      this.heap[0] = bottom;
      this._sinkDown(0);
    }

    return top;
  }

  /**
   * Restores min-heap property by swapping child with parent as long as child has higher priority.
   * @private
   * @param {number} index
   */
  _bubbleUp(index) {
    let curr = index;

    while (curr > 0) {
      // Parent index in 0-indexed binary tree
      const parent = Math.floor((curr - 1) / 2);

      // If child is smaller than parent, swap to maintain min-heap property
      if (this.comparator(this.heap[curr], this.heap[parent]) < 0) {
        this._swap(curr, parent);
        curr = parent;
      } else {
        // Heap invariant satisfied
        break;
      }
    }
  }

  /**
   * Restores min-heap property by sinking current node down with its smallest child.
   * @private
   * @param {number} index
   */
  _sinkDown(index) {
    let curr = index;
    const length = this.heap.length;

    while (true) {
      const left = 2 * curr + 1;
      const right = 2 * curr + 2;
      let smallest = curr;

      // Check if left child has higher priority than current smallest
      if (left < length && this.comparator(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }

      // Check if right child has even higher priority
      if (right < length && this.comparator(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }

      // If either child was higher priority, swap and continue sinking
      if (smallest !== curr) {
        this._swap(curr, smallest);
        curr = smallest;
      } else {
        // Both children are larger or equal; invariant satisfied
        break;
      }
    }
  }

  /**
   * Swaps elements at indices i and j.
   * @private
   * @param {number} i
   * @param {number} j
   */
  _swap(i, j) {
    const temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }
}
