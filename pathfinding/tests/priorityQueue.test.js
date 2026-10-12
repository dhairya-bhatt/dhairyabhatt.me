import { describe, it, expect } from 'vitest';
import { PriorityQueue } from '../src/algorithms/priorityQueue.js';

describe('PriorityQueue (Binary Min-Heap)', () => {
  it('initializes empty with size 0', () => {
    const pq = new PriorityQueue();
    expect(pq.isEmpty()).toBe(true);
    expect(pq.size()).toBe(0);
    expect(pq.peek()).toBeUndefined();
    expect(pq.pop()).toBeUndefined();
  });

  it('correctly orders basic numeric priorities', () => {
    const pq = new PriorityQueue();
    pq.push({ priority: 10, val: 'ten' });
    pq.push({ priority: 3, val: 'three' });
    pq.push({ priority: 7, val: 'seven' });
    pq.push({ priority: 1, val: 'one' });

    expect(pq.peek()).toEqual({ priority: 1, val: 'one' });
    expect(pq.pop()).toEqual({ priority: 1, val: 'one' });
    expect(pq.pop()).toEqual({ priority: 3, val: 'three' });
    expect(pq.pop()).toEqual({ priority: 7, val: 'seven' });
    expect(pq.pop()).toEqual({ priority: 10, val: 'ten' });
    expect(pq.isEmpty()).toBe(true);
  });

  it('handles duplicate priorities reliably', () => {
    const pq = new PriorityQueue();
    pq.push({ priority: 5, id: 1 });
    pq.push({ priority: 5, id: 2 });
    pq.push({ priority: 2, id: 3 });

    expect(pq.pop().priority).toBe(2);
    expect(pq.pop().priority).toBe(5);
    expect(pq.pop().priority).toBe(5);
    expect(pq.isEmpty()).toBe(true);
  });

  it('pops in strictly non-decreasing sorted order over random inputs', () => {
    const pq = new PriorityQueue((a, b) => a - b);
    const n = 500;
    const randomNumbers = [];

    // Seeded/pseudo-random numbers
    let seed = 42;
    for (let i = 0; i < n; i++) {
      seed = (seed * 9301 + 49297) % 233280;
      const val = seed % 1000;
      randomNumbers.push(val);
      pq.push(val);
    }

    expect(pq.size()).toBe(n);

    let prev = -Infinity;
    const extracted = [];
    while (!pq.isEmpty()) {
      const curr = pq.pop();
      expect(curr).toBeGreaterThanOrEqual(prev);
      prev = curr;
      extracted.push(curr);
    }

    expect(extracted.length).toBe(n);
    const nativeSorted = [...randomNumbers].sort((a, b) => a - b);
    expect(extracted).toEqual(nativeSorted);
  });
});
