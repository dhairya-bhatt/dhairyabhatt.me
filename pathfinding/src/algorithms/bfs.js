/**
 * @fileoverview Deterministic Breadth-First Search (BFS).
 *
 * Guarantees shortest path on unweighted graphs (where all edge costs are uniform).
 * Does not account for terrain weights (treats all traversable edges as weight 1).
 *
 * Key optimization: Uses a flat queue array with an integer head pointer rather than
 * Array.prototype.shift(). shift() is O(N) due to continuous array re-indexing, yielding
 * an O(N^2) queue; the head pointer guarantees true O(1) amortized dequeues.
 */

import { getNeighbours, toKey } from './gridUtils.js';

/**
 * Reconstructs path from start to end using the parent map.
 * @param {Map<string, [number, number]>} parentMap
 * @param {[number, number]} start
 * @param {[number, number]} end
 * @param {import('./gridUtils.js').Grid} grid
 * @returns {{ path: [number, number][], pathCost: number }}
 */
function reconstructPath(parentMap, start, end, grid) {
  const path = [];
  let curr = end;
  const startKey = toKey(start[0], start[1]);

  while (curr) {
    path.push(curr);
    const currKey = toKey(curr[0], curr[1]);
    if (currKey === startKey) {
      break;
    }
    curr = parentMap.get(currKey);
  }

  // Reverse so the order is start -> end
  path.reverse();

  // Edge cost equals the weight of each cell entered along the path
  let pathCost = 0;
  for (let i = 1; i < path.length; i++) {
    const [r, c] = path[i];
    pathCost += grid[r][c].weight;
  }

  return { path, pathCost };
}

/**
 * Executes Breadth-First Search on the grid.
 *
 * @param {import('./gridUtils.js').Grid} grid - The 2D cell grid
 * @param {[number, number]} start - [row, col]
 * @param {[number, number]} end - [row, col]
 * @returns {import('./gridUtils.js').PathfindingResult}
 */
export function bfs(grid, start, end) {
  const startTime = performance.now();

  const [startR, startC] = start;
  const [endR, endC] = end;

  // Immediate handling for start == end edge case
  if (startR === endR && startC === endC) {
    const endTime = performance.now();
    return {
      visitedOrder: [start],
      path: [start],
      found: true,
      stats: {
        nodesVisited: 1,
        pathLength: 1,
        pathCost: 0,
        computeTimeMs: Math.max(0, endTime - startTime),
      },
    };
  }

  const queue = [start];
  let head = 0; // O(1) queue head pointer

  const visitedSet = new Set();
  const parentMap = new Map();
  const visitedOrder = [];

  const startKey = toKey(startR, startC);
  visitedSet.add(startKey);

  let found = false;

  while (head < queue.length) {
    const current = queue[head++];
    visitedOrder.push(current);

    const [currR, currC] = current;
    if (currR === endR && currC === endC) {
      found = true;
      break;
    }

    const neighbours = getNeighbours(grid, current);
    for (let i = 0; i < neighbours.length; i++) {
      const neighbour = neighbours[i];
      const key = toKey(neighbour[0], neighbour[1]);

      if (!visitedSet.has(key)) {
        visitedSet.add(key);
        parentMap.set(key, current);
        queue.push(neighbour);
      }
    }
  }

  const endTime = performance.now();

  if (!found) {
    return {
      visitedOrder,
      path: [],
      found: false,
      stats: {
        nodesVisited: visitedOrder.length,
        pathLength: 0,
        pathCost: 0,
        computeTimeMs: Math.max(0, endTime - startTime),
      },
    };
  }

  const { path, pathCost } = reconstructPath(parentMap, start, end, grid);

  return {
    visitedOrder,
    path,
    found: true,
    stats: {
      nodesVisited: visitedOrder.length,
      pathLength: path.length,
      pathCost,
      computeTimeMs: Math.max(0, endTime - startTime),
    },
  };
}
