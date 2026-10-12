"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface GoldenRatioSpiralProps {
  className?: string;
  isAnimated?: boolean;
  isIntroComplete?: boolean;
}

export function GoldenRatioSpiral({
  className = "",
  isAnimated = false,
  isIntroComplete = true,
}: GoldenRatioSpiralProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Subtle interactive parallax tilt on mouse move (only after intro finishes)
  useEffect(() => {
    if (!isIntroComplete) {
      setMouseOffset({ x: 0, y: 0 });
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) / (window.innerWidth / 2);
      const dy = (e.clientY - centerY) / (window.innerHeight / 2);
      setMouseOffset({ x: dx * 8, y: dy * 8 });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isIntroComplete]);

  // Fibonacci rectangles spanning the 1600 x 988.85 full-screen ratio
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

  // Exact continuous logarithmic Golden Spiral path
  const spiralArcPath =
    "M 0 988.85 A 988.85 988.85 0 0 1 988.85 0.00 A 611.15 611.15 0 0 1 1600.00 611.15 A 377.71 377.71 0 0 1 1222.29 988.85 A 233.44 233.44 0 0 1 988.85 755.42 A 144.27 144.27 0 0 1 1133.13 611.15 A 89.16 89.16 0 0 1 1222.29 700.31 A 55.11 55.11 0 0 1 1167.18 755.42 A 34.06 34.06 0 0 1 1133.13 721.36 A 21.05 21.05 0 0 1 1154.18 700.31";

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 w-full h-full select-none pointer-events-none transition-transform duration-700 ease-out ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${-mouseOffset.y}deg) rotateY(${mouseOffset.x}deg)`,
      }}
    >
      <svg
        viewBox="0 0 1600 988.85"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full overflow-visible drop-shadow-[0_0_35px_rgba(235,195,85,0.08)]"
        fill="none"
      >
        <defs>
          {/* Subtle Golden Luminous Gradient */}
          <linearGradient id="fullGoldenSpiralGrad" x1="0%" y1="100%" x2="71.5%" y2="72%">
            <stop offset="0%" stopColor="#ECE8DF" stopOpacity="0.28" />
            <stop offset="35%" stopColor="#E5C158" stopOpacity="0.58" />
            <stop offset="75%" stopColor="#F5D77F" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
          </linearGradient>

          {/* Radial glow around the convergence center in bottom-right */}
          <radialGradient id="fullCenterGlow" cx="71.5%" cy="71.9%" r="22%">
            <stop offset="0%" stopColor="#F5D77F" stopOpacity="0.22" />
            <stop offset="55%" stopColor="#E5C158" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#E5C158" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Center Glow in Bottom-Right Space */}
        <circle cx="1143.65" cy="710.84" r="220" fill="url(#fullCenterGlow)" />

        {/* 1. Fibonacci Golden Rectangles (Subtle Hairline Grid) */}
        <g stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.75" strokeDasharray="3 3">
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
        />

        {/* 2. Golden Ratio Spiral Core Curve Spanning Whole Page */}
        <motion.path
          d={spiralArcPath}
          stroke="url(#fullGoldenSpiralGrad)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={isAnimated ? { pathLength: 0, opacity: 0 } : { pathLength: 1, opacity: 1 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            duration: 2.4,
            ease: [0.16, 1, 0.3, 1],
          }}
        />

        {/* 3. Spiral Convergence Eye / Center Focus Beacon */}
        <g>
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
      </svg>
    </div>
  );
}
