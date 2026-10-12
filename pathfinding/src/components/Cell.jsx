import React, { memo } from 'react';
import { CELL_TYPES } from '../algorithms/gridUtils.js';

/**
 * Single Grid Cell.
 * Wrapped in React.memo to ensure 60fps performance during interactive dragging
 * and eliminate re-renders while pathfinding animations are in flight.
 */
export const Cell = memo(function Cell({
  row,
  col,
  type,
  weight,
  isStart,
  isEnd,
  cellRef,
}) {
  let cellClass = 'grid-cell';

  if (isStart) {
    cellClass += ' cell-start';
  } else if (isEnd) {
    cellClass += ' cell-end';
  } else if (type === CELL_TYPES.WALL) {
    cellClass += ' cell-wall';
  } else if (weight > 1) {
    cellClass += ' cell-terrain';
  }

  return (
    <div
      ref={cellRef}
      className={cellClass}
      data-row={row}
      data-col={col}
      aria-label={`Cell ${row}, ${col}`}
    >
      {isStart && <div className="node-marker start-marker">S</div>}
      {isEnd && <div className="node-marker end-marker">E</div>}
      {!isStart && !isEnd && weight > 1 && (
        <span className="terrain-weight-badge">{weight}</span>
      )}
    </div>
  );
});
