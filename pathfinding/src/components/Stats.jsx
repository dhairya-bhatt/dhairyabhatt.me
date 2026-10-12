import React from 'react';

/**
 * Stats and Board Comparison Table Component.
 * Displays pure algorithm execution metrics (excluding rendering/animation time)
 * and tracks side-by-side performance of different algorithms on the exact same board configuration.
 */
export function Stats({ currentStats, comparisonHistory, selectedAlgoName }) {
  const hasHistory = Object.keys(comparisonHistory).length > 0;

  return (
    <div className="stats-container">
      {/* Visual Legend */}
      <div className="legend-bar">
        <div className="legend-item">
          <div className="legend-box legend-start">S</div>
          <span>Start Node</span>
        </div>
        <div className="legend-item">
          <div className="legend-box legend-end">E</div>
          <span>Target Node</span>
        </div>
        <div className="legend-item">
          <div className="legend-box legend-wall" />
          <span>Wall (Impassable)</span>
        </div>
        <div className="legend-item">
          <div className="legend-box legend-terrain">5</div>
          <span>Mud Terrain (Weight 5)</span>
        </div>
        <div className="legend-item">
          <div className="legend-box legend-visited" />
          <span>Visited / Frontier</span>
        </div>
        <div className="legend-item">
          <div className="legend-box legend-path" />
          <span>Final Path</span>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="metrics-row">
        <div className="metric-card">
          <span className="metric-label">Nodes Visited</span>
          <span className="metric-value">
            {currentStats ? currentStats.nodesVisited.toLocaleString() : '—'}
          </span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Path Length</span>
          <span className="metric-value">
            {currentStats
              ? currentStats.pathLength > 0
                ? `${currentStats.pathLength} cells`
                : 'No path'
              : '—'}
          </span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Total Path Cost</span>
          <span className="metric-value">
            {currentStats
              ? currentStats.pathLength > 0
                ? currentStats.pathCost
                : '—'
              : '—'}
          </span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Compute Time</span>
          <span className="metric-value">
            {currentStats ? `${currentStats.computeTimeMs.toFixed(2)} ms` : '—'}
          </span>
          <span className="metric-subtext">Pure algorithm time (excl. animation)</span>
        </div>
      </div>

      {/* Comparative Analysis Table for Current Board */}
      <div className="comparison-section">
        <div className="comparison-header">
          <h3 className="comparison-title">Current Board Comparison Table</h3>
          <span className="comparison-hint">
            Directly compare algorithms on this exact board. Clears automatically when walls or nodes move.
          </span>
        </div>

        {hasHistory ? (
          <div className="table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Algorithm</th>
                  <th>Path Found</th>
                  <th>Nodes Visited</th>
                  <th>Path Length</th>
                  <th>Total Cost</th>
                  <th>Compute Time</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(comparisonHistory).map(([key, item]) => (
                  <tr key={key} className={key === selectedAlgoName ? 'highlight-row' : ''}>
                    <td className="algo-cell-name">{item.name}</td>
                    <td>
                      <span className={`status-pill ${item.found ? 'found' : 'not-found'}`}>
                        {item.found ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td>{item.stats.nodesVisited.toLocaleString()}</td>
                    <td>{item.stats.pathLength > 0 ? `${item.stats.pathLength} cells` : '—'}</td>
                    <td>{item.stats.pathLength > 0 ? item.stats.pathCost : '—'}</td>
                    <td>{item.stats.computeTimeMs.toFixed(2)} ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-history-notice">
            Run an algorithm on this board to record comparison metrics.
          </div>
        )}
      </div>
    </div>
  );
}
