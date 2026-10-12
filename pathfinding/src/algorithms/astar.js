/**
 * @fileoverview A* Pathfinding Algorithm with Manhattan Heuristic.
 *
 * Combines cumulative path cost g(n) with heuristic estimate h(n):
 *   f(n) = g(n) + h(n)
 *
 * -----------------------------------------------------------------------------
 * MATHEMATICAL PROOF: Admissibility, Consistency, and Guaranteed Optimality
 * -----------------------------------------------------------------------------
 * Let G = (V, E) be a 4-connected grid graph where movement is restricted to
 * orthogonal steps (Up, Down, Left, Right).
 *
 * 1. Admissibility:
 *    A heuristic h(n) is admissible if it never overestimates the true cost to reach
 *    the goal h*(n):
 *      h(n) <= h*(n)  for all n in V.
 *    On a 4-directional grid, moving between (r1, c1) and (r2, c2) requires at least
 *    |r1 - r2| + |c1 - c2| orthogonal steps. Since all grid cells have weight w >= 1,
 *    the minimum possible cost of any valid path is at least:
 *      min_cost >= (|r1 - r2| + |c1 - c2|) * 1 = Manhattan(n, goal).
 *    Therefore, h(n) <= h*(n), proving admissibility.
 *
 * 2. Consistency (Monotonicity):
 *    A heuristic h(n) is consistent if for every node n and every neighbour n' of n:
 *      h(n) <= c(n, n') + h(n')
 *    By the triangle inequality in L1 metric space (Manhattan distance):
 *      |r - r_goal| + |c - c_goal| <= 1 + |r' - r_goal| + |c' - c_goal|
 *    Since every edge cost c(n, n') = w(n') >= 1, we have:
 *      h(n) <= 1 + h(n') <= c(n, n') + h(n').
 *    Hence, the Manhattan heuristic is strictly consistent.
 *
 * 3. Guaranteed Optimality:
 *    Because h(n) is consistent, the sequence of f-values along any optimal path is
 *    monotonically non-decreasing, and when A* expands a node, the discovered path
 *    to that node is guaranteed to be optimal. No closed node ever needs to be re-opened.
 *
 * -----------------------------------------------------------------------------
 * TIE-BREAKING STRATEGY
 * -----------------------------------------------------------------------------
 * When two nodes have identical f-values (f_a == f_b), we break ties by favoring
 * the node with the smaller h-value (closer to target). This dramatically reduces
 * symmetrical frontier expansions along equal-f contours and focuses the search cone.
 */

import { PriorityQueue } from './priorityQueue.js';
import { getNeighbours, toKey } from './gridUtils.js';

/**
 * Computes L1 Manhattan distance between two coordinates.
 * @param {[number, number]} a
 * @param {[number, number]} b
 * @returns {number}
 */
export function manhattanDistance([r1, c1], [r2, c2]) {
  return Math.abs(r1 - r2) + Math.abs(c1 - c2);
}

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
 * Executes A* Search on the grid.
 *
 * @param {import('./gridUtils.js').Grid} grid
 * @param {[number, number]} start
 * @param {[number, number]} end
 * @returns {import('./gridUtils.js').PathfindingResult}
 */
export function astar(grid, start, end) {
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

  // Compare on f; tie-break on lower h to point towards target
  const pq = new PriorityQueue((a, b) => {
    if (a.f !== b.f) {
      return a.f - b.f;
    }
    return a.h - b.h;
  });

  const gScoreMap = new Map();
  const parentMap = new Map();
  const visitedSet = new Set();
  const visitedOrder = [];

  const startKey = toKey(startR, startC);
  gScoreMap.set(startKey, 0);

  const initialH = manhattanDistance(start, end);
  pq.push({
    coord: start,
    g: 0,
    h: initialH,
    f: initialH,
  });

  let found = false;

  while (!pq.isEmpty()) {
    const { coord, g, h, f } = pq.pop();
    const [currR, currC] = coord;
    const currKey = toKey(currR, currC);

    // Stale entry check (lazy deletion)
    if (g > gScoreMap.get(currKey)) {
      continue;
    }

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

      const edgeWeight = grid[nr][nc].weight;
      const tentativeG = g + edgeWeight;
      const recordedG = gScoreMap.has(nKey) ? gScoreMap.get(nKey) : Infinity;

      if (tentativeG < recordedG) {
        gScoreMap.set(nKey, tentativeG);
        parentMap.set(nKey, coord);

        const nextH = manhattanDistance(neighbour, end);
        const nextF = tentativeG + nextH;

        pq.push({
          coord: neighbour,
          g: tentativeG,
          h: nextH,
          f: nextF,
        });
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
