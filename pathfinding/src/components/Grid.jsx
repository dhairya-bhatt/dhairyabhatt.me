import React, { useRef, useCallback } from 'react';
import { Cell } from './Cell.jsx';
import { CELL_TYPES, TERRAIN_WEIGHT, DEFAULT_WEIGHT } from '../algorithms/gridUtils.js';

/**
 * Grid Component.
 * Supports smooth desktop and mobile touch dragging using unified Pointer Events
 * and document.elementFromPoint() coordinate resolution.
 */
export function Grid({
  grid,
  startNode,
  endNode,
  setGrid,
  setStartNode,
  setEndNode,
  cellRefs,
  isLocked,
  brushMode,
  onBoardMutated,
}) {
  const isDraggingRef = useRef(false);
  const dragModeRef = useRef(null); // 'move_start' | 'move_end' | 'draw_wall' | 'erase_wall' | 'draw_terrain'

  /**
   * Helper to parse row and col from DOM element data attributes.
   */
  const getCellFromElement = (element) => {
    if (!element) return null;
    const cellEl = element.closest('.grid-cell');
    if (!cellEl) return null;

    const row = Number(cellEl.getAttribute('data-row'));
    const col = Number(cellEl.getAttribute('data-col'));
    if (isNaN(row) || isNaN(col)) return null;

    return [row, col];
  };

  /**
   * Applies the active drag interaction to the target cell coordinate.
   */
  const applyInteraction = useCallback(
    (row, col) => {
      const mode = dragModeRef.current;
      if (!mode) return;

      const [sr, sc] = startNode;
      const [er, ec] = endNode;

      // Handle moving Start node
      if (mode === 'move_start') {
        if (row === er && col === ec) return; // Cannot overlap with end
        if (row !== sr || col !== sc) {
          setStartNode([row, col]);
          // Clear wall at destination if moving start onto a wall
          if (grid[row][col].type === CELL_TYPES.WALL) {
            setGrid((prev) => {
              const next = prev.map((r) => [...r]);
              next[row][col] = { ...next[row][col], type: CELL_TYPES.EMPTY };
              return next;
            });
          }
          onBoardMutated?.();
        }
        return;
      }

      // Handle moving End node
      if (mode === 'move_end') {
        if (row === sr && col === sc) return; // Cannot overlap with start
        if (row !== er || col !== ec) {
          setEndNode([row, col]);
          if (grid[row][col].type === CELL_TYPES.WALL) {
            setGrid((prev) => {
              const next = prev.map((r) => [...r]);
              next[row][col] = { ...next[row][col], type: CELL_TYPES.EMPTY };
              return next;
            });
          }
          onBoardMutated?.();
        }
        return;
      }

      // Prevent overwriting Start or End node with walls or terrain
      if ((row === sr && col === sc) || (row === er && col === ec)) {
        return;
      }

      const currentCell = grid[row][col];

      if (mode === 'draw_wall') {
        if (currentCell.type !== CELL_TYPES.WALL) {
          setGrid((prev) => {
            const next = prev.map((r) => [...r]);
            next[row][col] = { ...next[row][col], type: CELL_TYPES.WALL, weight: DEFAULT_WEIGHT };
            return next;
          });
          onBoardMutated?.();
        }
      } else if (mode === 'erase_wall') {
        if (currentCell.type === CELL_TYPES.WALL || currentCell.weight > DEFAULT_WEIGHT) {
          setGrid((prev) => {
            const next = prev.map((r) => [...r]);
            next[row][col] = { ...next[row][col], type: CELL_TYPES.EMPTY, weight: DEFAULT_WEIGHT };
            return next;
          });
          onBoardMutated?.();
        }
      } else if (mode === 'draw_terrain') {
        if (currentCell.type !== CELL_TYPES.WALL && currentCell.weight !== TERRAIN_WEIGHT) {
          setGrid((prev) => {
            const next = prev.map((r) => [...r]);
            next[row][col] = { ...next[row][col], weight: TERRAIN_WEIGHT };
            return next;
          });
          onBoardMutated?.();
        }
      }
    },
    [startNode, endNode, grid, setGrid, setStartNode, setEndNode, onBoardMutated]
  );

  const handlePointerDown = (e) => {
    if (isLocked) return;

    // Capture pointer events on container for smooth cross-cell dragging
    e.currentTarget.setPointerCapture?.(e.pointerId);

    const coords = getCellFromElement(e.target);
    if (!coords) return;

    const [r, c] = coords;
    const [sr, sc] = startNode;
    const [er, ec] = endNode;

    isDraggingRef.current = true;

    if (r === sr && c === sc) {
      dragModeRef.current = 'move_start';
    } else if (r === er && c === ec) {
      dragModeRef.current = 'move_end';
    } else if (grid[r][c].type === CELL_TYPES.WALL) {
      // Starting drag on an existing wall erases walls
      dragModeRef.current = 'erase_wall';
      applyInteraction(r, c);
    } else if (brushMode === 'terrain') {
      dragModeRef.current = 'draw_terrain';
      applyInteraction(r, c);
    } else if (brushMode === 'erase') {
      dragModeRef.current = 'erase_wall';
      applyInteraction(r, c);
    } else {
      dragModeRef.current = 'draw_wall';
      applyInteraction(r, c);
    }
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || isLocked) return;

    // Use document.elementFromPoint to resolve coordinate during continuous touch drag
    const targetElement = document.elementFromPoint(e.clientX, e.clientY);
    const coords = getCellFromElement(targetElement);
    if (coords) {
      applyInteraction(coords[0], coords[1]);
    }
  };

  const handlePointerUp = (e) => {
    isDraggingRef.current = false;
    dragModeRef.current = null;
    try {
      e.currentTarget.releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignored if pointer capture was already released
    }
  };

  const rows = grid.length;
  const cols = grid[0]?.length || 0;

  return (
    <div
      className="grid-container"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      }}
    >
      {grid.map((rowCells, r) =>
        rowCells.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            row={r}
            col={c}
            type={cell.type}
            weight={cell.weight}
            isStart={r === startNode[0] && c === startNode[1]}
            isEnd={r === endNode[0] && c === endNode[1]}
            cellRef={(el) => {
              if (cellRefs.current[r]) {
                cellRefs.current[r][c] = el;
              }
            }}
          />
        ))
      )}
    </div>
  );
}
