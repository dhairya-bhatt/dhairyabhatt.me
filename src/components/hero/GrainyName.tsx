"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { siteConfig } from "@/content/site";

interface GrainParticle {
  ox: number; // Origin X (clean text position)
  oy: number; // Origin Y
  x: number;  // Current X
  y: number;  // Current Y
  sx: number; // Scatter target X (dust cloud)
  sy: number; // Scatter target Y
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export function GrainyName() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClean, setIsClean] = useState(false);
  const particlesRef = useRef<GrainParticle[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const isCleanRef = useRef(false);

  isCleanRef.current = isClean;

  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const width = container.clientWidth;
    // Calculate font size responsive to width
    const fontSize = Math.min(Math.max(width * 0.12, 42), 116);
    const height = Math.round(fontSize * 1.35);

    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // Render offscreen text to sample pixels
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#FFFFFF";
    // Use the Instrument Serif or Georgia serif font
    ctx.font = `400 ${fontSize}px var(--font-instrument-serif), Georgia, serif`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText(siteConfig.name, 4, height / 2);

    const imgData = ctx.getImageData(0, 0, width * dpr, height * dpr);
    const data = imgData.data;
    const newParticles: GrainParticle[] = [];

    // Sample step for grain density
    const step = Math.max(Math.round(2 * dpr), 2);

    for (let py = 0; py < height * dpr; py += step) {
      for (let px = 0; px < width * dpr; px += step) {
        const index = (py * (width * dpr) + px) * 4;
        const alpha = data[index + 3];

        if (alpha > 70) {
          const originX = px / dpr;
          const originY = py / dpr;

          // Scatter radius for fine grain cloud (pieces of grains floating outward)
          const angle = Math.random() * Math.PI * 2;
          const dist = 6 + Math.random() * 24;
          const scatterX = originX + Math.cos(angle) * dist + (Math.random() - 0.5) * 10;
          const scatterY = originY + Math.sin(angle) * dist + (Math.random() - 0.5) * 10;

          newParticles.push({
            ox: originX,
            oy: originY,
            x: scatterX,
            y: scatterY,
            sx: scatterX,
            sy: scatterY,
            vx: 0,
            vy: 0,
            size: 0.9 + Math.random() * 1.3,
            alpha: 0.5 + Math.random() * 0.5,
          });
        }
      }
    }

    particlesRef.current = newParticles;
    ctx.clearRect(0, 0, width, height);
  }, []);

  useEffect(() => {
    initParticles();

    const handleResize = () => {
      initParticles();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initParticles]);

  // Main animation loop: grains assemble when clean, scatter into dusty grains when idle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const clean = isCleanRef.current;
      const particles = particlesRef.current;
      const len = particles.length;

      // When clean: pull swiftly into exact solid letter shapes
      // When idle: float gently in the grainy scattered state
      const ease = clean ? 0.18 : 0.08;

      for (let i = 0; i < len; i++) {
        const p = particles[i];
        const targetX = clean ? p.ox : p.sx;
        const targetY = clean ? p.oy : p.sy;

        p.x += (targetX - p.x) * ease;
        p.y += (targetY - p.y) * ease;

        // Subtle ambient grain shimmer when scattered
        if (!clean && i % 3 === 0) {
          p.x += (Math.random() - 0.5) * 0.4;
          p.y += (Math.random() - 0.5) * 0.4;
        }

        ctx.fillStyle = clean
          ? "#FFFFFF"
          : `rgba(240, 240, 245, ${p.alpha * 0.85})`;

        ctx.fillRect(p.x, p.y, p.size, p.size);
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full cursor-pointer select-none py-1"
      onMouseEnter={() => setIsClean(true)}
      onMouseLeave={() => setIsClean(false)}
      onTouchStart={() => setIsClean((prev) => !prev)}
      title="Dhairya Bhatt (Hover or tap: grains assemble)"
    >
      {/* Real accessible HTML heading for SEO & Screen Readers */}
      <h1 className="sr-only">{siteConfig.name}</h1>

      {/* Interactive Grain Particles Canvas */}
      <canvas
        ref={canvasRef}
        className="block pointer-events-auto transition-transform duration-300"
        aria-hidden="true"
      />
    </div>
  );
}
