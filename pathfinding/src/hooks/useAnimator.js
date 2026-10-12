/**
 * @fileoverview High-performance RAF Animator Hook.
 *
 * Uses requestAnimationFrame and direct DOM class mutations to maintain 60 FPS
 * on large grids (e.g. 50x30 = 1500 cells) without triggering React component re-renders.
 *
 * Supports:
 * - Speed scaling from 1 to 500+ cells/sec, plus zero-delay "instant" mode.
 * - Play, Pause, Resume, Reset, and "Skip to End".
 * - Two distinct animation phases: visited frontier expansion followed by final path trace.
 * - Dynamic color gradient variable injection (--visit-ratio) for outward pulse wave.
 */

import { useState, useRef, useCallback, useEffect } from 'react';

export const ANIMATION_STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  PAUSED: 'paused',
  FINISHED: 'finished',
};

/**
 * @param {React.MutableRefObject<(HTMLDivElement | null)[][]>} cellRefs
 * @param {() => void} [onComplete]
 */
export function useAnimator(cellRefs, onComplete) {
  const [status, setStatus] = useState(ANIMATION_STATUS.IDLE);
  const [speed, setSpeed] = useState(250); // cells per second, or 'instant'

  // Ref storage for animation execution state across RAF frames
  const animStateRef = useRef({
    visitedOrder: [],
    path: [],
    visitedIndex: 0,
    pathIndex: 0,
    phase: 'visited', // 'visited' | 'path'
    touchedCells: [], // Track touched cells for fast O(k) cleanup
    lastTimestamp: 0,
    accumulatedSteps: 0,
    rafId: null,
  });

  const speedRef = useRef(speed);
  speedRef.current = speed;

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  /**
   * Resets all modified DOM cell elements to their base CSS state.
   */
  const clearDOMAnimations = useCallback(() => {
    const { touchedCells } = animStateRef.current;
    const grid = cellRefs.current;
    if (!grid) return;

    for (let i = 0; i < touchedCells.length; i++) {
      const [r, c] = touchedCells[i];
      const el = grid[r]?.[c];
      if (el) {
        el.classList.remove('cell-visited', 'cell-path', 'cell-carving');
        el.style.removeProperty('--visit-ratio');
      }
    }
    animStateRef.current.touchedCells = [];
  }, [cellRefs]);

  /**
   * Immediately paints the entire visited frontier and final path without animation delay.
   */
  const skipToEnd = useCallback(() => {
    const state = animStateRef.current;
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }

    const grid = cellRefs.current;
    if (!grid) return;

    const totalVisited = state.visitedOrder.length || 1;

    // Apply remaining visited cells
    while (state.visitedIndex < state.visitedOrder.length) {
      const [r, c] = state.visitedOrder[state.visitedIndex];
      const el = grid[r]?.[c];
      if (el) {
        el.classList.add('cell-visited');
        el.style.setProperty('--visit-ratio', (state.visitedIndex / totalVisited).toFixed(3));
        state.touchedCells.push([r, c]);
      }
      state.visitedIndex++;
    }

    // Apply remaining path cells
    while (state.pathIndex < state.path.length) {
      const [r, c] = state.path[state.pathIndex];
      const el = grid[r]?.[c];
      if (el) {
        el.classList.add('cell-path');
        state.touchedCells.push([r, c]);
      }
      state.pathIndex++;
    }

    state.phase = 'finished';
    setStatus(ANIMATION_STATUS.FINISHED);
    if (onCompleteRef.current) {
      onCompleteRef.current();
    }
  }, [cellRefs]);

  /**
   * Core RAF animation loop.
   */
  const tick = useCallback((timestamp) => {
    const state = animStateRef.current;
    const grid = cellRefs.current;

    if (!state.lastTimestamp) {
      state.lastTimestamp = timestamp;
    }

    const dt = (timestamp - state.lastTimestamp) / 1000;
    state.lastTimestamp = timestamp;

    const currentSpeed = speedRef.current;

    // If instant speed was selected during run, finish immediately
    if (currentSpeed === 'instant' || currentSpeed >= 1000) {
      skipToEnd();
      return;
    }

    state.accumulatedSteps += dt * currentSpeed;
    const stepsToRun = Math.floor(state.accumulatedSteps);
    state.accumulatedSteps -= stepsToRun;

    const totalVisited = state.visitedOrder.length || 1;

    for (let s = 0; s < stepsToRun; s++) {
      if (state.phase === 'visited') {
        if (state.visitedIndex < state.visitedOrder.length) {
          const [r, c] = state.visitedOrder[state.visitedIndex];
          const el = grid?.[r]?.[c];
          if (el) {
            el.classList.add('cell-visited');
            el.style.setProperty('--visit-ratio', (state.visitedIndex / totalVisited).toFixed(3));
            state.touchedCells.push([r, c]);
          }
          state.visitedIndex++;
        } else {
          // Transition from visited frontier to final path
          state.phase = 'path';
        }
      }

      if (state.phase === 'path') {
        if (state.pathIndex < state.path.length) {
          const [r, c] = state.path[state.pathIndex];
          const el = grid?.[r]?.[c];
          if (el) {
            el.classList.add('cell-path');
            state.touchedCells.push([r, c]);
          }
          state.pathIndex++;
        } else {
          // Animation completely finished
          state.phase = 'finished';
          setStatus(ANIMATION_STATUS.FINISHED);
          if (onCompleteRef.current) {
            onCompleteRef.current();
          }
          return;
        }
      }
    }

    state.rafId = requestAnimationFrame(tick);
  }, [cellRefs, skipToEnd]);

  /**
   * Starts a new pathfinding animation.
   * @param {[number, number][]} visitedOrder
   * @param {[number, number][]} path
   */
  const start = useCallback((visitedOrder, path) => {
    clearDOMAnimations();

    const state = animStateRef.current;
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
    }

    state.visitedOrder = visitedOrder;
    state.path = path;
    state.visitedIndex = 0;
    state.pathIndex = 0;
    state.phase = 'visited';
    state.lastTimestamp = 0;
    state.accumulatedSteps = 0;

    if (speedRef.current === 'instant') {
      skipToEnd();
      return;
    }

    setStatus(ANIMATION_STATUS.RUNNING);
    state.rafId = requestAnimationFrame(tick);
  }, [clearDOMAnimations, skipToEnd, tick]);

  /**
   * Pauses the active animation.
   */
  const pause = useCallback(() => {
    const state = animStateRef.current;
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
    setStatus(ANIMATION_STATUS.PAUSED);
  }, []);

  /**
   * Resumes a paused animation.
   */
  const resume = useCallback(() => {
    const state = animStateRef.current;
    if (state.phase === 'finished') return;

    state.lastTimestamp = 0; // Reset delta baseline
    setStatus(ANIMATION_STATUS.RUNNING);
    state.rafId = requestAnimationFrame(tick);
  }, [tick]);

  /**
   * Resets animation state and clears visited/path styles.
   */
  const reset = useCallback(() => {
    const state = animStateRef.current;
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
    clearDOMAnimations();
    state.visitedOrder = [];
    state.path = [];
    state.visitedIndex = 0;
    state.pathIndex = 0;
    state.phase = 'visited';
    setStatus(ANIMATION_STATUS.IDLE);
  }, [clearDOMAnimations]);

  // Clean up RAF on component unmount
  useEffect(() => {
    return () => {
      const state = animStateRef.current;
      if (state.rafId) {
        cancelAnimationFrame(state.rafId);
      }
    };
  }, []);

  return {
    status,
    speed,
    setSpeed,
    start,
    pause,
    resume,
    reset,
    skipToEnd,
    clearDOMAnimations,
  };
}
