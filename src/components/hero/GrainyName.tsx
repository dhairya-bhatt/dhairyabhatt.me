"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { siteConfig } from "@/content/site";

interface Grain {
  ox: number; // Exact solid target coordinate X
  oy: number; // Exact solid target coordinate Y
  sx: number; // Dispersed / scattered coordinate X
  sy: number; // Dispersed / scattered coordinate Y
  x: number;  // Current X
  y: number;  // Current Y
  vx: number; // Velocity X
  vy: number; // Velocity Y
  size: number;
  alpha: number;
  noiseOffset: number;
}

export function GrainyName() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const grainsRef = useRef<Grain[]>([]);
  const animRef = useRef<number | null>(null);
  const isHoveredRef = useRef(false);
  isHoveredRef.current = isHovered;

  const factorRef = useRef(0); // 0 = fully scattered grains, 1 = fully assembled text
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });

  const sampleGlyphs = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || (typeof window !== "undefined" ? Math.min(window.innerWidth - 64, 850) : 750);
    // Responsive font size tuned to match reference
    const fontSize = Math.min(Math.max(width * 0.115, 44), 98);
    const height = Math.round(fontSize * 1.35);

    const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    // Create offscreen buffer to rasterize the text
    const offscreen = document.createElement("canvas");
    offscreen.width = Math.round(width * dpr);
    offscreen.height = Math.round(height * dpr);
    const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
    if (!offCtx) return;

    offCtx.scale(dpr, dpr);
    offCtx.fillStyle = "#FFFFFF";
    offCtx.font = `700 ${fontSize}px Century, "Century Schoolbook", "TeX Gyre Schola", Georgia, serif`;
    offCtx.textBaseline = "middle";
    offCtx.textAlign = "left";
    offCtx.fillText(siteConfig.name, 4, height / 2);

    offscreenCanvasRef.current = offscreen;

    // Sample pixels from offscreen canvas
    const imgData = offCtx.getImageData(0, 0, Math.round(width * dpr), Math.round(height * dpr));
    const data = imgData.data;
    const totalW = Math.round(width * dpr);
    const totalH = Math.round(height * dpr);

    const grains: Grain[] = [];
    // Fine-grained sampling step for dense, tactile sand look
    const step = Math.max(Math.round(1.8 * dpr), 2);

    for (let py = 0; py < totalH; py += step) {
      for (let px = 0; px < totalW; px += step) {
        const idx = (py * totalW + px) * 4;
        const alpha = data[idx + 3];

        if (alpha > 70) {
          const ox = px / dpr;
          const oy = py / dpr;

          // Dispersed position: scattered outward like fine grains of sand
          const angle = Math.random() * Math.PI * 2;
          const radius = 6 + Math.random() * 24;
          const sx = ox + Math.cos(angle) * radius + (Math.random() - 0.5) * 6;
          const sy = oy + Math.sin(angle) * radius + (Math.random() - 0.5) * 6;

          grains.push({
            ox,
            oy,
            sx,
            sy,
            x: sx,
            y: sy,
            vx: 0,
            vy: 0,
            size: 1.1 + Math.random() * 1.3,
            alpha: 0.55 + Math.random() * 0.45,
            noiseOffset: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    grainsRef.current = grains;
    setIsReady(true);
  }, []);

  // Initialize and observe container resizing
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        sampleGlyphs();
      });
    } else {
      sampleGlyphs();
    }

    const ro = new ResizeObserver(() => {
      sampleGlyphs();
    });
    ro.observe(container);

    return () => ro.disconnect();
  }, [sampleGlyphs]);

  // Main 60fps physics & render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let startTime = performance.now();

    const render = (time: number) => {
      const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const isHoveredNow = isHoveredRef.current;
      const targetFactor = isHoveredNow ? 1.0 : 0.0;
      // Smooth spring interpolation for assembly factor
      factorRef.current += (targetFactor - factorRef.current) * (isHoveredNow ? 0.16 : 0.09);
      const factor = factorRef.current;

      const grains = grainsRef.current;
      const len = grains.length;
      const mouse = mousePosRef.current;
      const elapsed = (time - startTime) * 0.001;

      for (let i = 0; i < len; i++) {
        const g = grains[i];

        // Position blends smoothly between scattered (sx, sy) and solid letter (ox, oy)
        let tx = g.sx + (g.ox - g.sx) * factor;
        let ty = g.sy + (g.oy - g.sy) * factor;

        // When scattered, add subtle organic floating shimmer
        if (factor < 0.98) {
          const driftStrength = (1 - factor) * 2.5;
          tx += Math.cos(g.noiseOffset + elapsed * 1.8) * driftStrength;
          ty += Math.sin(g.noiseOffset + elapsed * 1.8) * driftStrength;
        }

        // Magnetic cursor pull when hovering near the text
        if (mouse.active && isHoveredNow) {
          const dx = mouse.x - g.ox;
          const dy = mouse.y - g.oy;
          const distSq = dx * dx + dy * dy;
          if (distSq < 14400 && distSq > 4) { // within 120px
            const dist = Math.sqrt(distSq);
            const pull = (1 - dist / 120) * 0.45;
            tx = tx + (g.ox - tx) * pull;
            ty = ty + (g.oy - ty) * pull;
          }
        }

        // Spring acceleration towards target position
        const springK = 0.18 + factor * 0.12;
        const ax = (tx - g.x) * springK;
        const ay = (ty - g.y) * springK;

        g.vx = (g.vx + ax) * 0.76;
        g.vy = (g.vy + ay) * 0.76;
        g.x += g.vx;
        g.y += g.vy;

        // Dynamic grain size & alpha based on assembly state
        const currentSize = g.size * (1 + factor * 0.35);
        const currentAlpha = Math.min(1, g.alpha * (0.65 + factor * 0.35));

        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        ctx.fillRect(g.x, g.y, currentSize, currentSize);
      }

      // Seamlessly blend solid raster text as grains snap into position
      if (factor > 0.15 && offscreenCanvasRef.current) {
        ctx.save();
        // Smoothly fade in solid raster layer as grains reach origin
        const solidAlpha = Math.min(1, Math.max(0, (factor - 0.25) / 0.75));
        ctx.globalAlpha = solidAlpha;
        ctx.drawImage(offscreenCanvasRef.current, 0, 0, width, height);
        ctx.restore();
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

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    mousePosRef.current.active = false;
    setIsHovered(false);
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsHovered((prev) => !prev)}
      onTouchStart={() => setIsHovered((prev) => !prev)}
      className="relative w-full cursor-pointer select-none py-1 group"
      title="Dhairya Bhatt — Hover to assemble grains into solid text"
    >
      {/* Semantic accessible headline for SEO and screen readers */}
      <h1 className="sr-only">{siteConfig.name}</h1>

      {/* Interactive grain particle canvas */}
      <canvas
        ref={canvasRef}
        className={`block transition-opacity duration-300 ${
          isReady ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
    </div>
  );
}
