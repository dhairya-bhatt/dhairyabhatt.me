import React from 'react';
import { ANIMATION_STATUS } from '../hooks/useAnimator.js';

export const ALGORITHMS = {
  ASTAR: {
    id: 'astar',
    name: 'A* Search',
    complexity: 'O(E log V)',
    space: 'O(V)',
    isOptimal: true,
    supportsWeights: true,
    description: 'Guided heuristic search using Manhattan distance f(n) = g(n) + h(n). Explores fewest nodes while guaranteeing optimal shortest path.',
  },
  DIJKSTRA: {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    complexity: 'O(E log V)',
    space: 'O(V)',
    isOptimal: true,
    supportsWeights: true,
    description: 'Guaranteed shortest path on weighted graphs using binary min-heap with lazy deletion. Uniform radial expansion.',
  },
  BFS: {
    id: 'bfs',
    name: 'Breadth-First Search (BFS)',
    complexity: 'O(V + E)',
    space: 'O(V)',
    isOptimal: true,
    supportsWeights: false,
    description: 'Guarantees shortest path on UNWEIGHTED graphs using an O(1) pointer queue. Note: Ignores terrain weights (treats all cells as cost 1).',
  },
  DFS: {
    id: 'dfs',
    name: 'Depth-First Search (DFS)',
    complexity: 'O(V + E)',
    space: 'O(V)',
    isOptimal: false,
    supportsWeights: false,
    description: 'Explores deeply along paths using an explicit iterative stack. Does NOT guarantee shortest path and ignores terrain weights.',
  },
};

export function Controls({
  selectedAlgo,
  setSelectedAlgo,
  onRun,
  onPause,
  onResume,
  onResetPath,
  onClearBoard,
  onGenerateMaze,
  mazeType,
  setMazeType,
  animStatus,
  speed,
  setSpeed,
  brushMode,
  setBrushMode,
  onSkipToEnd,
}) {
  const isRunning = animStatus === ANIMATION_STATUS.RUNNING;
  const isPaused = animStatus === ANIMATION_STATUS.PAUSED;
  const isLocked = isRunning;

  const currentAlgoMeta = ALGORITHMS[selectedAlgo.toUpperCase()] || ALGORITHMS.ASTAR;

  return (
    <div className="controls-panel">
      {/* Primary configuration toolbar */}
      <div className="controls-toolbar">
        {/* Algorithm Select */}
        <div className="control-item">
          <label htmlFor="algo-select" className="control-label">Algorithm</label>
          <select
            id="algo-select"
            className="control-select"
            value={selectedAlgo}
            disabled={isLocked}
            onChange={(e) => setSelectedAlgo(e.target.value)}
          >
            <option value="astar">A* Search (Optimal & Heuristic)</option>
            <option value="dijkstra">Dijkstra (Optimal & Weighted)</option>
            <option value="bfs">BFS (Optimal on Unweighted)</option>
            <option value="dfs">DFS (Exploratory / Non-optimal)</option>
          </select>
        </div>

        {/* Maze Generator */}
        <div className="control-item">
          <label htmlFor="maze-select" className="control-label">Maze Generator</label>
          <div className="inline-group">
            <select
              id="maze-select"
              className="control-select"
              value={mazeType}
              disabled={isLocked}
              onChange={(e) => setMazeType(e.target.value)}
            >
              <option value="backtracker">Recursive Backtracker</option>
              <option value="prims">Randomized Prim's</option>
            </select>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={isLocked}
              onClick={() => onGenerateMaze(mazeType)}
            >
              Generate
            </button>
          </div>
        </div>

        {/* Brush Mode */}
        <div className="control-item">
          <span className="control-label">Brush Mode</span>
          <div className="brush-toggle-group">
            <button
              type="button"
              className={`btn btn-toggle ${brushMode === 'wall' ? 'active' : ''}`}
              disabled={isLocked}
              onClick={() => setBrushMode('wall')}
            >
              Wall
            </button>
            <button
              type="button"
              className={`btn btn-toggle ${brushMode === 'terrain' ? 'active' : ''}`}
              disabled={isLocked}
              onClick={() => setBrushMode('terrain')}
              title="Paint weight = 5 terrain"
            >
              Mud (w:5)
            </button>
            <button
              type="button"
              className={`btn btn-toggle ${brushMode === 'erase' ? 'active' : ''}`}
              disabled={isLocked}
              onClick={() => setBrushMode('erase')}
            >
              Eraser
            </button>
          </div>
        </div>

        {/* Speed Slider */}
        <div className="control-item speed-item">
          <label htmlFor="speed-slider" className="control-label">
            Speed: <span className="speed-value">{speed === 'instant' ? 'Instant' : `${speed} cells/s`}</span>
          </label>
          <div className="speed-slider-wrapper">
            <input
              id="speed-slider"
              type="range"
              min="10"
              max="500"
              step="10"
              value={speed === 'instant' ? 500 : speed}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSpeed(val >= 500 ? 'instant' : val);
              }}
            />
            <button
              type="button"
              className={`btn-pill ${speed === 'instant' ? 'active' : ''}`}
              onClick={() => setSpeed(speed === 'instant' ? 250 : 'instant')}
            >
              Instant
            </button>
          </div>
        </div>
      </div>

      {/* Action Row & Chips */}
      <div className="controls-actions-bar">
        <div className="playback-buttons">
          {!isRunning && !isPaused && (
            <button
              type="button"
              className="btn btn-primary btn-run"
              onClick={onRun}
            >
              Visualize {currentAlgoMeta.name.split(' ')[0]}
            </button>
          )}

          {isRunning && (
            <button
              type="button"
              className="btn btn-accent"
              onClick={onPause}
            >
              Pause
            </button>
          )}

          {isPaused && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onResume}
            >
              Resume
            </button>
          )}

          {(isRunning || isPaused) && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onSkipToEnd}
            >
              Skip to End
            </button>
          )}

          <button
            type="button"
            className="btn btn-outline"
            disabled={isLocked}
            onClick={onResetPath}
          >
            Reset Path
          </button>

          <button
            type="button"
            className="btn btn-outline"
            disabled={isLocked}
            onClick={onClearBoard}
          >
            Clear Board
          </button>
        </div>

        {/* Spec badges */}
        <div className="algo-badges-row">
          <span className="badge-name">{currentAlgoMeta.name}</span>
          <span className="badge-tag">Time: {currentAlgoMeta.complexity}</span>
          <span className="badge-tag">Space: {currentAlgoMeta.space}</span>
          <span className={`badge-tag ${currentAlgoMeta.isOptimal ? 'badge-optimal' : 'badge-suboptimal'}`}>
            {currentAlgoMeta.isOptimal ? 'Optimal Shortest Path' : 'Non-optimal (exploratory)'}
          </span>
          <span className={`badge-tag ${currentAlgoMeta.supportsWeights ? 'badge-weighted' : 'badge-unweighted'}`}>
            {currentAlgoMeta.supportsWeights ? 'Weighted' : 'Ignores Weights'}
          </span>
        </div>
      </div>
    </div>
  );
}
