/**
 * @fileoverview Grid utilities, constants, cell factories, and deterministic neighbour lookups.
 * Follows strict immutability and zero-dependency pure functional guidelines.
 */

/**
 * @typedef {[number, number]} Coord - [row, col]
 */

/**
 * @typedef {'empty' | 'wall' | 'start' | 'end'} CellType
 */

/**
 * @typedef {Object} CellModel
 * @property {CellType} type - Functional state of cell
 * @property {number} weight - Cost to traverse into this cell (default 1, weighted terrain 5)
 */

/**
 * @typedef {CellModel[][]} Grid
 */

/**
 * Fixed 4-directional delta vectors: UP, DOWN, LEFT, RIGHT.
 * Defining this order strictly once ensures all graph traversals are
 * deterministic, reproducible across environments, and reliably testable.
 */
export const DIRECTIONS = [
  [-1,  0], // UP
  [ 1,  0], // DOWN
  [ 0, -1], // LEFT
  [ 0,  1], // RIGHT
];

export const CELL_TYPES = {
  EMPTY: 'empty',
  WALL: 'wall',
  START: 'start',
  END: 'end',
};

export const DEFAULT_WEIGHT = 1;
export const TERRAIN_WEIGHT = 5;

/**
 * Creates a single default cell object.
 * @param {CellType} [type='empty']
 * @param {number} [weight=1]
 * @returns {CellModel}
 */
export function createCell(type = CELL_TYPES.EMPTY, weight = DEFAULT_WEIGHT) {
  return {
    type,
    weight,
  };
}

/**
 * Creates a clean 2D grid matrix initialized with empty cells.
 * Uses explicit loops rather than Array(n).fill() to prevent shared object reference bugs.
 * @param {number} rows
 * @param {number} cols
 * @returns {Grid}
 */
export function createGrid(rows, cols) {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push(createCell());
    }
    grid.push(row);
  }
  return grid;
}

/**
 * Determines whether a coordinate lies within grid boundaries.
 * @param {Grid} grid
 * @param {number} row
 * @param {number} col
 * @returns {boolean}
 */
export function isInBounds(grid, row, col) {
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
}

/**
 * Returns valid, traversable 4-directional neighbours for a given coordinate.
 * Walls are skipped because they represent non-traversable graph barriers.
 * @param {Grid} grid
 * @param {Coord} coord - [row, col]
 * @returns {Coord[]}
 */
export function getNeighbours(grid, [row, col]) {
  const neighbours = [];

  for (let i = 0; i < DIRECTIONS.length; i++) {
    const [dr, dc] = DIRECTIONS[i];
    const nr = row + dr;
    const nc = col + dc;

    if (isInBounds(grid, nr, nc)) {
      // Walls are impassable barriers in the graph representation
      if (grid[nr][nc].type !== CELL_TYPES.WALL) {
        neighbours.push([nr, nc]);
      }
    }
  }

  return neighbours;
}

/**
 * Creates an exact deep clone of the grid.
 * Vital for ensuring pathfinding algorithms remain strictly pure and free of side effects.
 * @param {Grid} grid
 * @returns {Grid}
 */
export function cloneGrid(grid) {
  return grid.map(row => row.map(cell => ({ ...cell })));
}

/**
 * Helper to encode coordinate [r, c] into a primitive string key for Map/Set lookups.
 * Using a flat string key avoid Object identity overhead.
 * @param {number} r
 * @param {number} c
 * @returns {string}
 */
export function toKey(r, c) {
  return `${r},${c}`;
}

/**
 * Helper to decode string key back into numeric [r, c] tuple.
 * @param {string} key
 * @returns {Coord}
 */
export function fromKey(key) {
  const parts = key.split(',');
  return [Number(parts[0]), Number(parts[1])];
}
