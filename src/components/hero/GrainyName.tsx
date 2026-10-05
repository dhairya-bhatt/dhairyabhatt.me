"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { siteConfig } from "@/content/site";

interface Grain {
  ox: number; // Clean target X
  oy: number; // Clean target Y
  x: number;  // Current X
  y: number;  // Current Y
  sx: number; // Dispersed/scattered X
  sy: number; // Dispersed/scattered Y
  size: number;
  alpha: number;
  driftAngle: number;
  driftSpeed: number;
}

export function GrainyName() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isClean, setIsClean] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const grainsRef = useRef<Grain[]>([]);
  const animRef = useRef<number | null>(null);
  const isCleanRef = useRef(false);
  isCleanRef.current = isClean;

  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  const sampleGlyphs = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 700;
    // Calculate responsive font size matching the reference screenshot
    const fontSize = Math.min(Math.max(width * 0.12, 42), 104);
    const height = Math.round(fontSize * 1.3);

    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    // Render using Century bold font matching user's spec
    ctx.fillStyle = "#FFFFFF";
    ctx.font = `700 ${fontSize}px Century, "Century Schoolbook", "TeX Gyre Schola", Georgia, serif`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText(siteConfig.name, 2, height / 2);

    const imgData = ctx.getImageData(0, 0, width * dpr, height * dpr);
    const data = imgData.data;
    const grains: Grain[] = [];

    // Fine stippled sampling
    const step = Math.max(Math.round(2 * dpr), 2);

    for (let py = 0; py < height * dpr; py += step) {
      for (let px = 0; px < width * dpr; px += step) {
        const idx = (py * (width * dpr) + px) * 4;
        const alpha = data[idx + 3];

        if (alpha > 60) {
          const originX = px / dpr;
          const originY = py / dpr;

          // Dispersal cloud: fine sand grains sprayed around each letter
          const angle = Math.random() * Math.PI * 2;
          const radius = 5 + Math.random() * 22;
          const scatterX = originX + Math.cos(angle) * radius + (Math.random() - 0.5) * 6;
          const scatterY = originY + Math.sin(angle) * radius + (Math.random() - 0.5) * 6;

          grains.push({
            ox: originX,
            oy: originY,
            x: scatterX,
            y: scatterY,
            sx: scatterX,
            sy: scatterY,
            size: 0.9 + Math.random() * 1.3,
            alpha: 0.5 + Math.random() * 0.5,
            driftAngle: Math.random() * Math.PI * 2,
            driftSpeed: 0.02 + Math.random() * 0.035,
          });
        }
      }
    }

    grainsRef.current = grains;
    ctx.clearRect(0, 0, width, height);
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        sampleGlyphs();
      });
    } else {
      sampleGlyphs();
    }

    const handleResize = () => {
      sampleGlyphs();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sampleGlyphs]);

  // Main animation render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    const render = () => {
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const clean = isCleanRef.current;
      const grains = grainsRef.current;
      const len = grains.length;
      const mouse = mousePosRef.current;

      const ease = clean ? 0.22 : 0.08;

      for (let i = 0; i < len; i++) {
        const g = grains[i];
        let targetX = clean ? g.ox : g.sx;
        let targetY = clean ? g.oy : g.sy;

        // Subtle Brownian grain drift when idle
        if (!clean) {
          g.driftAngle += g.driftSpeed;
          targetX += Math.cos(g.driftAngle) * 0.8;
          targetY += Math.sin(g.driftAngle) * 0.8;
        }

        // Mouse kinetic deflection
        if (mouse.active) {
          const dx = g.x - mouse.x;
          const dy = g.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 3600 && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / 60) * 10;
            g.x += (dx / dist) * force;
            g.y += (dy / dist) * force;
          }
        }

        g.x += (targetX - g.x) * ease;
        g.y += (targetY - g.y) * ease;

        ctx.fillStyle = clean
          ? "#FFFFFF"
          : `rgba(245, 245, 250, ${g.alpha * 0.9})`;

        ctx.fillRect(g.x, g.y, g.size, g.size);
      }

      ctx.restore();
      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mousePosRef.current.active = false;
    setIsClean(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsClean(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={() => setIsClean((prev) => !prev)}
      className="relative w-full cursor-pointer select-none py-1 group"
      title="Dhairya Bhatt — Hover to assemble grains into solid Century text"
    >
      {/* Accessible semantic heading for screen readers & SEO */}
      <h1 className="sr-only">{siteConfig.name}</h1>

      {/* Clean vector text layer in Century bold matching reference */}
      <div
        className={`absolute inset-0 pointer-events-none font-century font-bold text-5xl sm:text-7xl md:text-8xl lg:text-[96px] text-white leading-none tracking-tight transition-opacity duration-500 ${
          isClean ? "opacity-100" : "opacity-0"
        }`}
        style={{ transform: "translateY(12%)" }}
        aria-hidden="true"
      >
        {siteConfig.name}
      </div>

      {/* Active grain particles canvas */}
      <canvas
        ref={canvasRef}
        className={`block pointer-events-none transition-opacity duration-300 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
