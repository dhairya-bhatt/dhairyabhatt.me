import { describe, it, expect } from 'vitest';
import { createGrid, cloneGrid, CELL_TYPES, TERRAIN_WEIGHT } from '../src/algorithms/gridUtils.js';
import { bfs } from '../src/algorithms/bfs.js';
import { dfs } from '../src/algorithms/dfs.js';
import { dijkstra } from '../src/algorithms/dijkstra.js';
import { astar } from '../src/algorithms/astar.js';

describe('Pathfinding Algorithms Test Suite', () => {
  // Helper to verify that a reconstructed path is continuous and valid
  function assertValidPath(path, start, end, grid) {
    expect(path.length).toBeGreaterThan(0);
    expect(path[0]).toEqual(start);
    expect(path[path.length - 1]).toEqual(end);

    for (let i = 0; i < path.length; i++) {
      const [r, c] = path[i];
      // Path must never traverse walls
      expect(grid[r][c].type).not.toBe(CELL_TYPES.WALL);

      if (i > 0) {
        const [pr, pc] = path[i - 1];
        const dist = Math.abs(r - pr) + Math.abs(c - pc);
        // Every step must be 4-directionally adjacent
        expect(dist).toBe(1);
      }
    }
  }

  it('BFS, Dijkstra, and A* return exact same path length on a grid with known shortest path', () => {
    // 7x7 grid with a central obstacle
    const grid = createGrid(7, 7);
    for (let r = 1; r <= 5; r++) {
      grid[r][3].type = CELL_TYPES.WALL;
    }
    // Leave a gap at row 0 and row 6, creating two symmetrical shortest paths of length 9
    const start = [3, 1];
    const end = [3, 5];

    const bfsRes = bfs(grid, start, end);
    const dijkstraRes = dijkstra(grid, start, end);
    const astarRes = astar(grid, start, end);

    expect(bfsRes.found).toBe(true);
    expect(dijkstraRes.found).toBe(true);
    expect(astarRes.found).toBe(true);

    // Assert LENGTH equality only, not exact coordinates, since multiple equal-length shortest paths exist
    expect(bfsRes.path.length).toBe(dijkstraRes.path.length);
    expect(astarRes.path.length).toBe(dijkstraRes.path.length);

    assertValidPath(bfsRes.path, start, end, grid);
    assertValidPath(dijkstraRes.path, start, end, grid);
    assertValidPath(astarRes.path, start, end, grid);
  });

  it('Dijkstra and A* return the same minimum cost on a weighted grid, while BFS differs', () => {
    // 5x5 grid where the direct geometric path is heavily weighted (e.g. mud terrain),
    // and an indirect detour path is unweighted (cost 1 each).
    //
    // [S] [5] [5] [5] [E]   Direct route cost: 4 steps of weight 5 = 20
    // [1] [1] [1] [1] [1]   Detour route cost: down, 4 rights, up = 6 steps of weight 1 = 6
    const grid = createGrid(3, 5);
    const start = [0, 0];
    const end = [0, 4];

    // Heavy weight along row 0
    grid[0][1].weight = TERRAIN_WEIGHT;
    grid[0][2].weight = TERRAIN_WEIGHT;
    grid[0][3].weight = TERRAIN_WEIGHT;
    grid[0][4].weight = TERRAIN_WEIGHT;

    const bfsRes = bfs(grid, start, end);
    const dijkstraRes = dijkstra(grid, start, end);
    const astarRes = astar(grid, start, end);

    expect(dijkstraRes.found).toBe(true);
    expect(astarRes.found).toBe(true);
    expect(bfsRes.found).toBe(true);

    // Dijkstra and A* both find the true minimum cost path through the detour:
    // Detour enters: [1,0](1) + [1,1](1) + [1,2](1) + [1,3](1) + [1,4](1) + [0,4](5) = 10
    expect(dijkstraRes.stats.pathCost).toBe(astarRes.stats.pathCost);
    expect(dijkstraRes.stats.pathCost).toBe(10);

    // BFS blindly minimizes step count rather than edge weights, so it takes
    // the 4-step direct path through the heavy mud (cost = 4 * 5 = 20).
    // This explicitly proves BFS does NOT guarantee minimum cost on weighted graphs.
    expect(bfsRes.stats.pathCost).toBe(20);
    expect(bfsRes.stats.pathCost).toBeGreaterThan(dijkstraRes.stats.pathCost);
  });

  it('DFS returns a valid continuous path without guaranteeing shortest path', () => {
    const grid = createGrid(6, 6);
    const start = [0, 0];
    const end = [5, 5];

    const dfsRes = dfs(grid, start, end);
    const bfsRes = bfs(grid, start, end);

    expect(dfsRes.found).toBe(true);
    assertValidPath(dfsRes.path, start, end, grid);

    // DFS takes deep excursions; its path is typically longer than the optimal BFS path
    expect(dfsRes.path.length).toBeGreaterThanOrEqual(bfsRes.path.length);
  });

  it('All four algorithms report found=false and path=[] on a fully walled-off grid', () => {
    const grid = createGrid(5, 5);
    const start = [0, 0];
    const end = [4, 4];

    // Enclose start with walls
    grid[0][1].type = CELL_TYPES.WALL;
    grid[1][0].type = CELL_TYPES.WALL;
    grid[1][1].type = CELL_TYPES.WALL;

    const algos = [bfs, dfs, dijkstra, astar];
    for (const algo of algos) {
      const res = algo(grid, start, end);
      expect(res.found).toBe(false);
      expect(res.path).toEqual([]);
      expect(res.stats.pathLength).toBe(0);
      expect(res.stats.pathCost).toBe(0);
      expect(res.stats.nodesVisited).toBeGreaterThan(0);
    }
  });

  it('Correctly handles edge cases: start adjacent to end, start == end, 1x1, 1xN', () => {
    const algos = [bfs, dfs, dijkstra, astar];

    // 1. Start == End
    const grid1 = createGrid(3, 3);
    for (const algo of algos) {
      const res = algo(grid1, [1, 1], [1, 1]);
      expect(res.found).toBe(true);
      expect(res.path).toEqual([[1, 1]]);
      expect(res.stats.pathLength).toBe(1);
      expect(res.stats.pathCost).toBe(0);
    }

    // 2. Start adjacent to End
    const shortestPathAlgos = [bfs, dijkstra, astar];
    for (const algo of shortestPathAlgos) {
      const res = algo(grid1, [0, 0], [0, 1]);
      expect(res.found).toBe(true);
      expect(res.path).toEqual([[0, 0], [0, 1]]);
      expect(res.stats.pathLength).toBe(2);
      expect(res.stats.pathCost).toBe(1);
    }
    // DFS is valid but does not guarantee length 2
    const dfsAdjacent = dfs(grid1, [0, 0], [0, 1]);
    expect(dfsAdjacent.found).toBe(true);
    assertValidPath(dfsAdjacent.path, [0, 0], [0, 1], grid1);

    // 3. 1x1 grid
    const grid1x1 = createGrid(1, 1);
    for (const algo of algos) {
      const res = algo(grid1x1, [0, 0], [0, 0]);
      expect(res.found).toBe(true);
      expect(res.path).toEqual([[0, 0]]);
      expect(res.stats.pathLength).toBe(1);
    }

    // 4. 1xN corridor grid
    const grid1x5 = createGrid(1, 5);
    for (const algo of algos) {
      const res = algo(grid1x5, [0, 0], [0, 4]);
      expect(res.found).toBe(true);
      expect(res.path.length).toBe(5);
      expect(res.path[0]).toEqual([0, 0]);
      expect(res.path[4]).toEqual([0, 4]);
    }
  });

  it('A* visits <= nodes than Dijkstra on an open grid (property test over seeded grids)', () => {
    const seeds = [17, 42, 99, 1337, 2027];
    const rows = 21;
    const cols = 21;

    for (const seed of seeds) {
      const grid = createGrid(rows, cols);
      // Place random sparse obstacles with seeded generator
      let state = seed;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          state = (state * 1664525 + 1013904223) % 4294967296;
          if (state / 4294967296 < 0.15) {
            grid[r][c].type = CELL_TYPES.WALL;
          }
        }
      }

      const start = [0, 0];
      const end = [rows - 1, cols - 1];
      grid[start[0]][start[1]].type = CELL_TYPES.EMPTY;
      grid[end[0]][end[1]].type = CELL_TYPES.EMPTY;

      const astarRes = astar(grid, start, end);
      const dijkstraRes = dijkstra(grid, start, end);

      if (astarRes.found && dijkstraRes.found) {
        // Because of the goal-directed Manhattan heuristic, A* must prune search
        // and visit fewer or equal nodes compared to Dijkstra's unguided uniform flood
        expect(astarRes.stats.nodesVisited).toBeLessThanOrEqual(dijkstraRes.stats.nodesVisited);
        expect(astarRes.stats.pathCost).toBe(dijkstraRes.stats.pathCost);
      }
    }
  });

  it('Algorithms must not mutate the input grid (immutability check)', () => {
    const grid = createGrid(10, 10);
    grid[2][2].type = CELL_TYPES.WALL;
    grid[3][3].weight = TERRAIN_WEIGHT;

    const originalSnapshot = cloneGrid(grid);
    const algos = [bfs, dfs, dijkstra, astar];

    for (const algo of algos) {
      algo(grid, [0, 0], [9, 9]);
      // Compare grid against pristine original snapshot
      expect(grid).toEqual(originalSnapshot);
    }
  });
});
