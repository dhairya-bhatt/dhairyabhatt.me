/**
 * @fileoverview Dijkstra's Algorithm for Shortest Path on Weighted Graphs.
 *
 * Traverses the graph in order of accumulated path distance from the start node.
 * Strictly respects cell weights (edge cost = weight of the cell being entered).
 * Guarantees optimal shortest path on graphs with non-negative edge weights.
 *
 * -----------------------------------------------------------------------------
 * DESIGN DECISION: Lazy Deletion vs. Decrease-Key
 * -----------------------------------------------------------------------------
 * We use Lazy Deletion with a standard Binary Min-Heap:
 * When a shorter path to a neighbour is found, we push a new `{ priority: newDist, coord }`
 * entry into the heap. When popping from the heap, if `poppedDist > distMap.get(coord)`,
 * the entry is stale and immediately discarded.
 *
 * Why Lazy Deletion is preferred for 2D Grid Pathfinding:
 * 1. Decrease-Key requires maintaining a secondary hash map of `coord -> heapIndex`
 *    and continuously updating it on every heap swap operation, adding substantial
 *    constant-factor CPU overhead.
 * 2. On a 4-regular planar grid, every node has degree at most 4. Thus at most 4
 *    entries per node can ever be inserted into the heap.
 * 3. Total entries in the heap are bounded by O(|V|), so heap operations remain
 *    O(log |V|). Asymptotic complexity is O(|E| log |V|), achieving equal worst-case
 *    performance with significantly cleaner, faster, and cache-friendly code.
 */

import { PriorityQueue } from './priorityQueue.js';
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

  path.reverse();

  let pathCost = 0;
  for (let i = 1; i < path.length; i++) {
    const [r, c] = path[i];
    pathCost += grid[r][c].weight;
  }

  return { path, pathCost };
}

/**
 * Executes Dijkstra's algorithm.
 *
 * @param {import('./gridUtils.js').Grid} grid
 * @param {[number, number]} start
 * @param {[number, number]} end
 * @returns {import('./gridUtils.js').PathfindingResult}
 */
export function dijkstra(grid, start, end) {
  const startTime = performance.now();

  const [startR, startC] = start;
  const [endR, endC] = end;

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

  // Min-heap prioritizes lowest cumulative distance
  const pq = new PriorityQueue((a, b) => a.dist - b.dist);

  const distMap = new Map();
  const parentMap = new Map();
  const visitedSet = new Set();
  const visitedOrder = [];

  const startKey = toKey(startR, startC);
  distMap.set(startKey, 0);

  pq.push({ dist: 0, coord: start });

  let found = false;

  while (!pq.isEmpty()) {
    const { dist, coord } = pq.pop();
    const [currR, currC] = coord;
    const currKey = toKey(currR, currC);

    // Lazy deletion: discard stale entries that were superseded by shorter paths
    if (dist > distMap.get(currKey)) {
      continue;
    }

    // Skip if already settled/closed
    if (visitedSet.has(currKey)) {
      continue;
    }
    visitedSet.add(currKey);
    visitedOrder.push(coord);

    if (currR === endR && currC === endC) {
      found = true;
      break;
    }

    const neighbours = getNeighbours(grid, coord);
    for (let i = 0; i < neighbours.length; i++) {
      const neighbour = neighbours[i];
      const [nr, nc] = neighbour;
      const nKey = toKey(nr, nc);

      if (visitedSet.has(nKey)) {
        continue;
      }

      // Edge cost is the weight of the cell being entered
      const edgeWeight = grid[nr][nc].weight;
      const tentativeDist = dist + edgeWeight;
      const recordedDist = distMap.has(nKey) ? distMap.get(nKey) : Infinity;

      if (tentativeDist < recordedDist) {
        distMap.set(nKey, tentativeDist);
        parentMap.set(nKey, coord);
        pq.push({ dist: tentativeDist, coord: neighbour });
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
