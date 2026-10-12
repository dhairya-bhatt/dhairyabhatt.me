/**
 * @fileoverview Deterministic Maze Generation Algorithms.
 *
 * Implements:
 * 1. Iterative Recursive Backtracker (explicit stack, avoids call stack overflow)
 * 2. Randomized Prim's Algorithm (frontier wall list)
 *
 * Both operate on odd-dimensioned grids (2*r + 1 x 2*c + 1) where passages occupy
 * odd coordinates and intermediate cells represent walls.
 * Returns { grid, carveOrder } so the carving process can be animated step by step.
 */

import { CELL_TYPES, createCell } from './gridUtils.js';

/**
 * Linear Congruential Generator (LCG) for deterministic, reproducible pseudo-random numbers.
 * @param {number} [seed=42]
 * @returns {() => number} Returns float in [0, 1)
 */
export function createRNG(seed = 42) {
  let s = Math.floor(Math.abs(seed)) || 1;
  return function next() {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return (s >>> 0) / 4294967296;
  };
}

/**
 * 2-step cardinal directions for jumping between passage cells.
 */
const MAZE_DIRECTIONS = [
  [-2,  0], // UP
  [ 2,  0], // DOWN
  [ 0, -2], // LEFT
  [ 0,  1 * 2], // RIGHT
];

/**
 * Initializes a grid filled entirely with walls.
 * Enforces odd dimensions if even values are supplied.
 * @param {number} rows
 * @param {number} cols
 * @returns {{ grid: import('./gridUtils.js').Grid, actualRows: number, actualCols: number }}
 */
function createWalledGrid(rows, cols) {
  // Mazes require odd dimensions so that passages and separating walls align symmetrically
  const actualRows = rows % 2 === 0 ? rows + 1 : rows;
  const actualCols = cols % 2 === 0 ? cols + 1 : cols;

  const grid = [];
  for (let r = 0; r < actualRows; r++) {
    const row = [];
    for (let c = 0; c < actualCols; c++) {
      row.push(createCell(CELL_TYPES.WALL));
    }
    grid.push(row);
  }

  return { grid, actualRows, actualCols };
}

/**
 * Shuffles an array in place using the provided RNG (Fisher-Yates shuffle).
 * @template T
 * @param {T[]} array
 * @param {() => number} rng
 * @returns {T[]}
 */
function shuffle(array, rng) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

/**
 * Generates a perfect maze using an iterative Recursive Backtracker.
 * Uses an explicit stack rather than recursive calls to prevent call stack overflow.
 *
 * @param {number} rows - Target row count (adjusted to odd)
 * @param {number} cols - Target col count (adjusted to odd)
 * @param {number} [seed] - Optional seed for deterministic generation
 * @returns {{ grid: import('./gridUtils.js').Grid, carveOrder: [number, number][] }}
 */
export function generateRecursiveBacktracker(rows, cols, seed = Math.random() * 1000000) {
  const rng = createRNG(seed);
  const { grid, actualRows, actualCols } = createWalledGrid(rows, cols);
  const carveOrder = [];

  // Start carving from passage coordinate (1, 1)
  const start = [1, 1];
  grid[start[0]][start[1]].type = CELL_TYPES.EMPTY;
  carveOrder.push(start);

  // Explicit stack stores current path branch
  const stack = [start];
  const visited = new Set();
  visited.add(`1,1`);

  while (stack.length > 0) {
    const current = stack[stack.length - 1]; // Peek
    const [cr, cc] = current;

    // Find all unvisited 2-step neighbours
    const unvisitedNeighbours = [];
    for (let i = 0; i < MAZE_DIRECTIONS.length; i++) {
      const [dr, dc] = MAZE_DIRECTIONS[i];
      const nr = cr + dr;
      const nc = cc + dc;

      if (nr > 0 && nr < actualRows - 1 && nc > 0 && nc < actualCols - 1) {
        if (!visited.has(`${nr},${nc}`)) {
          unvisitedNeighbours.push({
            coord: [nr, nc],
            wall: [cr + dr / 2, cc + dc / 2],
          });
        }
      }
    }

    if (unvisitedNeighbours.length > 0) {
      // Pick random unvisited neighbour
      const nextChoice = unvisitedNeighbours[Math.floor(rng() * unvisitedNeighbours.length)];
      const [nr, nc] = nextChoice.coord;
      const [wr, wc] = nextChoice.wall;

      // Carve intermediate wall
      grid[wr][wc].type = CELL_TYPES.EMPTY;
      carveOrder.push([wr, wc]);

      // Carve destination cell
      grid[nr][nc].type = CELL_TYPES.EMPTY;
      carveOrder.push([nr, nc]);

      visited.add(`${nr},${nc}`);
      stack.push([nr, nc]);
    } else {
      // Dead end: backtrack
      stack.pop();
    }
  }

  return { grid, carveOrder };
}

/**
 * Generates a maze using Randomized Prim's Algorithm.
 * Creates a distinct branching texture compared to recursive backtracking (shorter cul-de-sacs).
 *
 * @param {number} rows
 * @param {number} cols
 * @param {number} [seed]
 * @returns {{ grid: import('./gridUtils.js').Grid, carveOrder: [number, number][] }}
 */
export function generatePrims(rows, cols, seed = Math.random() * 1000000) {
  const rng = createRNG(seed);
  const { grid, actualRows, actualCols } = createWalledGrid(rows, cols);
  const carveOrder = [];

  // Start cell
  grid[1][1].type = CELL_TYPES.EMPTY;
  carveOrder.push([1, 1]);

  const inMaze = new Set();
  inMaze.add('1,1');

  // Frontier walls: array of { wall: [wr, wc], target: [tr, tc], source: [sr, sc] }
  const walls = [];

  function addFrontierWalls(r, c) {
    for (let i = 0; i < MAZE_DIRECTIONS.length; i++) {
      const [dr, dc] = MAZE_DIRECTIONS[i];
      const tr = r + dr;
      const tc = c + dc;

      if (tr > 0 && tr < actualRows - 1 && tc > 0 && tc < actualCols - 1) {
        if (!inMaze.has(`${tr},${tc}`)) {
          walls.push({
            wall: [r + dr / 2, c + dc / 2],
            target: [tr, tc],
          });
        }
      }
    }
  }

  addFrontierWalls(1, 1);

  while (walls.length > 0) {
    // Pick a random wall from the frontier list
    const index = Math.floor(rng() * walls.length);
    const { wall, target } = walls[index];

    // Swap with last element and pop for O(1) removal
    walls[index] = walls[walls.length - 1];
    walls.pop();

    const [tr, tc] = target;
    const [wr, wc] = wall;
    const targetKey = `${tr},${tc}`;

    if (!inMaze.has(targetKey)) {
      // Connect target cell to the maze
      inMaze.add(targetKey);

      // Carve wall and target
      grid[wr][wc].type = CELL_TYPES.EMPTY;
      carveOrder.push([wr, wc]);

      grid[tr][tc].type = CELL_TYPES.EMPTY;
      carveOrder.push([tr, tc]);

      // Add new frontier walls
      addFrontierWalls(tr, tc);
    }
  }

  return { grid, carveOrder };
}
