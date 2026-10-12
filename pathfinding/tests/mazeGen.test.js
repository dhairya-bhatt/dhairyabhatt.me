import { describe, it, expect } from 'vitest';
import { generateRecursiveBacktracker, generatePrims } from '../src/algorithms/mazeGen.js';
import { CELL_TYPES, getNeighbours, toKey } from '../src/algorithms/gridUtils.js';

describe('Maze Generation Test Suite', () => {
  const generators = [
    { name: 'Iterative Recursive Backtracker', fn: generateRecursiveBacktracker },
    { name: "Randomized Prim's", fn: generatePrims },
  ];

  generators.forEach(({ name, fn }) => {
    describe(name, () => {
      it('enforces odd dimensions for symmetrical wall/passage alignment', () => {
        // Even dimensions passed in
        const { grid: g1 } = fn(20, 30, 42);
        expect(g1.length % 2).toBe(1);
        expect(g1[0].length % 2).toBe(1);

        // Odd dimensions passed in
        const { grid: g2 } = fn(21, 31, 42);
        expect(g2.length).toBe(21);
        expect(g2[0].length).toBe(31);
      });

      it('is strictly deterministic with a fixed seed', () => {
        const runA = fn(15, 15, 98765);
        const runB = fn(15, 15, 98765);

        expect(runA.grid).toEqual(runB.grid);
        expect(runA.carveOrder).toEqual(runB.carveOrder);
      });

      it('produces a perfect maze / spanning tree (every open cell is reachable from every other)', () => {
        const rows = 19;
        const cols = 25;
        const { grid, carveOrder } = fn(rows, cols, 12345);

        // Count total open (empty) cells in grid
        let openCellCount = 0;
        let firstOpen = null;

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            if (grid[r][c].type === CELL_TYPES.EMPTY) {
              openCellCount++;
              if (!firstOpen) {
                firstOpen = [r, c];
              }
            }
          }
        }

        expect(firstOpen).not.toBeNull();
        expect(openCellCount).toBeGreaterThan(0);

        // Flood-fill / BFS from the first open cell across traversable passages
        const visited = new Set();
        const queue = [firstOpen];
        visited.add(toKey(firstOpen[0], firstOpen[1]));

        let head = 0;
        while (head < queue.length) {
          const curr = queue[head++];
          const neighbours = getNeighbours(grid, curr);

          for (const nb of neighbours) {
            const key = toKey(nb[0], nb[1]);
            if (!visited.has(key)) {
              visited.add(key);
              queue.push(nb);
            }
          }
        }

        // In a perfect maze (spanning tree), flood-fill from ANY open cell must reach
        // 100% of the open cells in the maze (no disconnected pockets)
        expect(visited.size).toBe(openCellCount);

        // Carve order must contain every open cell
        expect(carveOrder.length).toBe(openCellCount);
      });
    });
  });
});
