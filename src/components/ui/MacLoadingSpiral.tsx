"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MacLoadingSpiralProps {
  onComplete?: () => void;
}

export function MacLoadingSpiral({ onComplete }: MacLoadingSpiralProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentPathD, setCurrentPathD] = useState<string>("");
  const [rectsOpacity, setRectsOpacity] = useState<number>(0);

  const animRef = useRef<number | null>(null);
  const hasTriggeredComplete = useRef(false);

  // Original Macintosh cursive "hello" vector stroke
  const macHelloRaw =
    "M 0 74.325 C 18.167 62.158 43.5 45.44 51.5 23.39 C 58.492 4.119 50.501 -5.108 42.5 2.873 C 31 14.344 32.5 56.886 29 84.825 C 30.167 70.194 35.5 46.045 54.5 46.825 C 71.5 47.523 51.613 80.809 65 84.825 C 91.667 92.825 117 45.325 98.5 45.325 C 84.5 45.325 69.5 80.959 98.5 84.825 C 132.25 89.325 157 8.325 139 8.325 C 124 8.325 109 81.325 136.5 83.325 C 173.618 86.025 194.5 11.325 177 9.325 C 159.5 7.325 147 83.5 173.5 83.5 C 194.155 83.5 192 63.386 212.5 48.386 C 204 51.386 184.012 77.95 209.5 85 C 234.425 88.012 239.5 45.325 219.5 46.825 C 207.025 47.761 221 72.825 257 49.325";

  // Full-screen Golden Spiral path (viewBox 0 0 1600 988.85)
  const fullGoldenSpiralD =
    "M 0 988.85 A 988.85 988.85 0 0 1 988.85 0.00 A 611.15 611.15 0 0 1 1600.00 611.15 A 377.71 377.71 0 0 1 1222.29 988.85 A 233.44 233.44 0 0 1 988.85 755.42 A 144.27 144.27 0 0 1 1133.13 611.15 A 89.16 89.16 0 0 1 1222.29 700.31 A 55.11 55.11 0 0 1 1167.18 755.42 A 34.06 34.06 0 0 1 1133.13 721.36 A 21.05 21.05 0 0 1 1154.18 700.31";

  // Fibonacci rectangles in 1600 x 988.85
  const rectangles = [
    { x: 0, y: 0, w: 988.85, h: 988.85 },
    { x: 988.85, y: 0, w: 611.15, h: 611.15 },
    { x: 1222.29, y: 611.15, w: 377.71, h: 377.71 },
    { x: 988.85, y: 755.42, w: 233.44, h: 233.44 },
    { x: 988.85, y: 611.15, w: 144.27, h: 144.27 },
    { x: 1133.13, y: 611.15, w: 89.16, h: 89.16 },
    { x: 1167.18, y: 700.31, w: 55.11, h: 55.11 },
    { x: 1133.13, y: 721.36, w: 34.06, h: 34.06 },
    { x: 1133.13, y: 700.31, w: 21.05, h: 21.05 },
  ];

  const triggerComplete = () => {
    if (!hasTriggeredComplete.current) {
      hasTriggeredComplete.current = true;
      onComplete?.();
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Create offscreen SVG elements to sample points from both paths
    const svgNS = "http://www.w3.org/2000/svg";
    const pathHello = document.createElementNS(svgNS, "path");
    pathHello.setAttribute("d", macHelloRaw);

    const pathSpiral = document.createElementNS(svgNS, "path");
    pathSpiral.setAttribute("d", fullGoldenSpiralD);

    const lenHello = pathHello.getTotalLength();
    const lenSpiral = pathSpiral.getTotalLength();

    const N = 260; // Samples along the paths

    const scale = 2.4;
    const tx = (1600 - 257 * scale) / 2; // ~491.6
    const ty = (988.85 - 90 * scale) / 2; // ~386.4

    const ptsHello: { x: number; y: number }[] = [];
    const ptsSpiral: { x: number; y: number }[] = [];

    for (let i = 0; i < N; i++) {
      const pHello = pathHello.getPointAtLength((i / (N - 1)) * lenHello);
      ptsHello.push({
        x: tx + pHello.x * scale,
        y: ty + pHello.y * scale,
      });

      const pSpiral = pathSpiral.getPointAtLength((i / (N - 1)) * lenSpiral);
      ptsSpiral.push({
        x: pSpiral.x,
        y: pSpiral.y,
      });
    }

    const pointsToPath = (pts: { x: number; y: number }[], count: number) => {
      if (count <= 1) return "";
      let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
      for (let i = 1; i < count; i++) {
        d += ` L ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
      }
      return d;
    };

    const easeInOutCubic = (x: number): number => {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    };

    const startTime = performance.now();
    const DRAW_DURATION = 1300; // 0 to 1.3s: Write "hello"
    const PAUSE_DURATION = 250;  // 1.3s to 1.55s: Hold "hello"
    const MORPH_DURATION = 1500; // 1.55s to 3.05s: Line transforms directly into Golden Spiral
    const MORPH_END = DRAW_DURATION + PAUSE_DURATION + MORPH_DURATION; // 3050ms
    const FADE_START = MORPH_END + 150; // 3200ms

    const frame = (now: number) => {
      const elapsed = now - startTime;

      if (elapsed < DRAW_DURATION) {
        // Phase 1: Draw cursive "hello"
        const progress = Math.min(1, elapsed / DRAW_DURATION);
        const count = Math.max(2, Math.floor(progress * N));
        setCurrentPathD(pointsToPath(ptsHello, count));
      } else if (elapsed < DRAW_DURATION + PAUSE_DURATION) {
        // Phase 2: Fully drawn "hello"
        setCurrentPathD(pointsToPath(ptsHello, N));
      } else if (elapsed < MORPH_END) {
        // Phase 3: The "hello" stroke transforms into the Golden Spiral line!
        const morphTime = elapsed - (DRAW_DURATION + PAUSE_DURATION);
        const rawProgress = Math.min(1, morphTime / MORPH_DURATION);
        const eased = easeInOutCubic(rawProgress);

        if (eased > 0.4) {
          setRectsOpacity((eased - 0.4) / 0.6);
        }

        const morphedPoints = ptsHello.map((p0, i) => {
          const p1 = ptsSpiral[i];
          return {
            x: p0.x + (p1.x - p0.x) * eased,
            y: p0.y + (p1.y - p0.y) * eased,
          };
        });

        setCurrentPathD(pointsToPath(morphedPoints, N));
      } else {
        // Phase 4: Golden Spiral achieved -> Hand off to landing page!
        setCurrentPathD(fullGoldenSpiralD);
        setRectsOpacity(1);

        // Notify parent that landing page text and Pokeball throw can now initiate!
        triggerComplete();

        if (elapsed > FADE_START) {
          setIsVisible(false);
          return;
        }
      }

      animRef.current = requestAnimationFrame(frame);
    };

    animRef.current = requestAnimationFrame(frame);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerComplete();
        setIsVisible(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSkip = () => {
    triggerComplete();
    setIsVisible(false);
  };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="mac-intro-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          onClick={handleSkip}
          className="fixed inset-0 z-[99998] bg-[#111111] flex items-center justify-center cursor-pointer select-none overflow-hidden"
        >
          <svg
            viewBox="0 0 1600 988.85"
            preserveAspectRatio="xMidYMid slice"
            className="w-full h-full overflow-visible drop-shadow-[0_0_35px_rgba(235,195,85,0.08)]"
            fill="none"
          >
            <defs>
              <linearGradient id="morphGoldenGrad" x1="0%" y1="100%" x2="71.5%" y2="72%">
                <stop offset="0%" stopColor="#ECE8DF" stopOpacity="0.28" />
                <stop offset="35%" stopColor="#E5C158" stopOpacity="0.58" />
                <stop offset="75%" stopColor="#F5D77F" stopOpacity="0.88" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
              </linearGradient>

              <radialGradient id="morphCenterGlow" cx="71.5%" cy="71.9%" r="22%">
                <stop offset="0%" stopColor="#F5D77F" stopOpacity="0.22" />
                <stop offset="55%" stopColor="#E5C158" stopOpacity="0.05" />
                <stop offset="100%" stopColor="#E5C158" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ambient Center Glow */}
            <circle
              cx="1143.65"
              cy="710.84"
              r="220"
              fill="url(#morphCenterGlow)"
              opacity={rectsOpacity}
            />

            {/* Fibonacci Rectangles fading in behind the uncoiling spiral */}
            <g
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="0.75"
              strokeDasharray="3 3"
              opacity={rectsOpacity}
            >
              {rectangles.map((rect, idx) => (
                <rect
                  key={idx}
                  x={rect.x}
                  y={rect.y}
                  width={rect.w}
                  height={rect.h}
                />
              ))}
            </g>

            {/* Outer Bounding Golden Rectangle */}
            <rect
              x="0"
              y="0"
              width="1600"
              height="988.85"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
              opacity={rectsOpacity}
            />

            {/* The Stroke: Starts as "hello", transforms directly into the Golden Spiral line! */}
            {currentPathD && (
              <path
                d={currentPathD}
                stroke="url(#morphGoldenGrad)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Focal Golden Eye Center */}
            {rectsOpacity > 0.3 && (
              <g opacity={rectsOpacity}>
                <circle cx="1143.65" cy="710.84" r="3.5" fill="#FFFFFF" />
                <circle
                  cx="1143.65"
                  cy="710.84"
                  r="9"
                  stroke="#F5D77F"
                  strokeWidth="0.75"
                  className="animate-ping origin-center"
                  style={{ transformOrigin: "1143.65px 710.84px" }}
                />
              </g>
            )}
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
