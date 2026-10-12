/**
 * @fileoverview Iterative Depth-First Search (DFS).
 *
 * NOTE: DFS DOES NOT guarantee the shortest path.
 * It dives deeply along branch paths before backtracking.
 *
 * Implemented iteratively using an explicit stack rather than recursion to avoid
 * Call Stack Overflow limits on large grids (e.g. 50x30 = 1500 cells, or maze corridors).
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

  path.reverse();

  let pathCost = 0;
  for (let i = 1; i < path.length; i++) {
    const [r, c] = path[i];
    pathCost += grid[r][c].weight;
  }

  return { path, pathCost };
}

/**
 * Executes iterative Depth-First Search on the grid.
 *
 * @param {import('./gridUtils.js').Grid} grid
 * @param {[number, number]} start
 * @param {[number, number]} end
 * @returns {import('./gridUtils.js').PathfindingResult}
 */
export function dfs(grid, start, end) {
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

  const stack = [start];
  const visitedSet = new Set();
  const parentMap = new Map();
  const visitedOrder = [];

  let found = false;

  while (stack.length > 0) {
    const current = stack.pop();
    const [currR, currC] = current;
    const currKey = toKey(currR, currC);

    if (visitedSet.has(currKey)) {
      continue;
    }

    visitedSet.add(currKey);
    visitedOrder.push(current);

    if (currR === endR && currC === endC) {
      found = true;
      break;
    }

    // Get 4-directional neighbours
    const neighbours = getNeighbours(grid, current);

    // Iterating in reverse pushes neighbours onto the stack so that
    // the first neighbour defined in DIRECTIONS is popped and visited first
    for (let i = neighbours.length - 1; i >= 0; i--) {
      const neighbour = neighbours[i];
      const nKey = toKey(neighbour[0], neighbour[1]);

      if (!visitedSet.has(nKey)) {
        parentMap.set(nKey, current);
        stack.push(neighbour);
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
