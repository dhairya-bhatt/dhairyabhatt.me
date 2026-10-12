import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createGrid, cloneGrid, CELL_TYPES } from './algorithms/gridUtils.js';
import { bfs } from './algorithms/bfs.js';
import { dfs } from './algorithms/dfs.js';
import { dijkstra } from './algorithms/dijkstra.js';
import { astar } from './algorithms/astar.js';
import { generateRecursiveBacktracker, generatePrims } from './algorithms/mazeGen.js';
import { useAnimator, ANIMATION_STATUS } from './hooks/useAnimator.js';
import { Grid } from './components/Grid.jsx';
import { Controls, ALGORITHMS } from './components/Controls.jsx';
import { Stats } from './components/Stats.jsx';

// Desktop: 29 rows x 51 cols (odd dimensions for perfect maze alignment)
// Mobile: 21 rows x 25 cols
const DESKTOP_ROWS = 29;
const DESKTOP_COLS = 51;
const MOBILE_ROWS = 21;
const MOBILE_COLS = 25;

export default function App() {
  const [dimensions, setDimensions] = useState(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    return isMobile
      ? { rows: MOBILE_ROWS, cols: MOBILE_COLS }
      : { rows: DESKTOP_ROWS, cols: DESKTOP_COLS };
  });

  const [grid, setGrid] = useState(() =>
    createGrid(dimensions.rows, dimensions.cols)
  );

  const [startNode, setStartNode] = useState(() => [
    Math.floor(dimensions.rows / 2),
    Math.max(1, Math.floor(dimensions.cols * 0.15)),
  ]);

  const [endNode, setEndNode] = useState(() => [
    Math.floor(dimensions.rows / 2),
    Math.min(dimensions.cols - 2, Math.floor(dimensions.cols * 0.85)),
  ]);

  const [selectedAlgo, setSelectedAlgo] = useState('astar');
  const [mazeType, setMazeType] = useState('backtracker');
  const [brushMode, setBrushMode] = useState('wall'); // 'wall' | 'terrain' | 'erase'

  const [currentStats, setCurrentStats] = useState(null);
  const [comparisonHistory, setComparisonHistory] = useState({});

  // 2D Array of DOM references to individual cells
  const cellRefs = useRef([]);
  useEffect(() => {
    cellRefs.current = Array.from({ length: dimensions.rows }, () =>
      Array(dimensions.cols).fill(null)
    );
  }, [dimensions]);

  // Keep window resize responsive
  useEffect(() => {
    function handleResize() {
      const isMobile = window.innerWidth < 768;
      const targetRows = isMobile ? MOBILE_ROWS : DESKTOP_ROWS;
      const targetCols = isMobile ? MOBILE_COLS : DESKTOP_COLS;

      if (targetRows !== dimensions.rows || targetCols !== dimensions.cols) {
        setDimensions({ rows: targetRows, cols: targetCols });
        setGrid(createGrid(targetRows, targetCols));
        setStartNode([Math.floor(targetRows / 2), Math.max(1, Math.floor(targetCols * 0.15))]);
        setEndNode([Math.floor(targetRows / 2), Math.min(targetCols - 2, Math.floor(targetCols * 0.85))]);
        setComparisonHistory({});
        setCurrentStats(null);
      }
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dimensions]);

  const animator = useAnimator(cellRefs);

  // Invalidate comparison history when board geometry or obstacles change
  const handleBoardMutated = useCallback(() => {
    setComparisonHistory({});
    animator.clearDOMAnimations();
  }, [animator]);

  /**
   * Runs the selected pathfinding algorithm.
   */
  const handleRun = useCallback(() => {
    animator.clearDOMAnimations();

    let result;
    switch (selectedAlgo) {
      case 'bfs':
        result = bfs(grid, startNode, endNode);
        break;
      case 'dfs':
        result = dfs(grid, startNode, endNode);
        break;
      case 'dijkstra':
        result = dijkstra(grid, startNode, endNode);
        break;
      case 'astar':
      default:
        result = astar(grid, startNode, endNode);
        break;
    }

    setCurrentStats(result.stats);

    // Save to current board comparison history
    const algoMeta = ALGORITHMS[selectedAlgo.toUpperCase()] || ALGORITHMS.ASTAR;
    setComparisonHistory((prev) => ({
      ...prev,
      [selectedAlgo]: {
        name: algoMeta.name,
        found: result.found,
        stats: result.stats,
      },
    }));

    // Start playback
    animator.start(result.visitedOrder, result.path);
  }, [animator, grid, startNode, endNode, selectedAlgo]);

  /**
   * Resets visualization path without modifying walls or weights.
   */
  const handleResetPath = useCallback(() => {
    animator.reset();
  }, [animator]);

  /**
   * Clears the entire grid back to empty cells.
   */
  const handleClearBoard = useCallback(() => {
    animator.reset();
    setGrid(createGrid(dimensions.rows, dimensions.cols));
    setComparisonHistory({});
    setCurrentStats(null);
  }, [animator, dimensions]);

  /**
   * Generates a maze using the selected generator.
   */
  const handleGenerateMaze = useCallback(
    (type) => {
      animator.reset();

      const generator =
        type === 'prims' ? generatePrims : generateRecursiveBacktracker;
      const { grid: mazeGrid } = generator(dimensions.rows, dimensions.cols);

      // Ensure start and end nodes are clear passages
      const [sr, sc] = startNode;
      const [er, ec] = endNode;
      mazeGrid[sr][sc].type = CELL_TYPES.EMPTY;
      mazeGrid[er][ec].type = CELL_TYPES.EMPTY;

      setGrid(mazeGrid);
      setComparisonHistory({});
      setCurrentStats(null);
    },
    [animator, dimensions, startNode, endNode]
  );

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <h1 className="brand-title">Pathfinding Visualizer</h1>
          <p className="brand-subtitle">
            Pure JavaScript algorithms, custom binary min-heap, 60fps DOM animation & deterministic analysis.
          </p>
        </div>

        <div className="header-links">
          <a
            href="https://dhairyabhatt.me"
            className="header-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            ← Back to Portfolio
          </a>
        </div>
      </header>

      {/* Main Interactive Work Area */}
      <main className="main-content">
        <Controls
          selectedAlgo={selectedAlgo}
          setSelectedAlgo={setSelectedAlgo}
          onRun={handleRun}
          onPause={animator.pause}
          onResume={animator.resume}
          onResetPath={handleResetPath}
          onClearBoard={handleClearBoard}
          onGenerateMaze={handleGenerateMaze}
          mazeType={mazeType}
          setMazeType={setMazeType}
          animStatus={animator.status}
          speed={animator.speed}
          setSpeed={animator.setSpeed}
          brushMode={brushMode}
          setBrushMode={setBrushMode}
          onSkipToEnd={animator.skipToEnd}
        />

        <div className="grid-wrapper">
          <Grid
            grid={grid}
            startNode={startNode}
            endNode={endNode}
            setGrid={setGrid}
            setStartNode={setStartNode}
            setEndNode={setEndNode}
            cellRefs={cellRefs}
            isLocked={animator.status === ANIMATION_STATUS.RUNNING}
            brushMode={brushMode}
            onBoardMutated={handleBoardMutated}
          />
        </div>

        <Stats
          currentStats={currentStats}
          comparisonHistory={comparisonHistory}
          selectedAlgoName={selectedAlgo}
        />
      </main>

      {/* Footer with Quant / CS Interview Notes */}
      <footer className="app-footer">
        <div className="footer-content">
          <span>
            Designed & Engineered by{' '}
            <strong className="text-white">Dhairya Bhatt</strong>
          </span>
          <span className="footer-spec">
            Zero external algorithm libraries • Pure functional core
          </span>
        </div>
      </footer>
    </div>
  );
}
