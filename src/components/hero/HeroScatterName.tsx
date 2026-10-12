"use client";

import React, { useEffect, useRef } from "react";

interface HeroScatterNameProps {
  text?: string;
  className?: string;
  fontVariant?: "rosegard" | "funnel" | "century" | "mono";
  align?: "center" | "left";
}

export function HeroScatterName({
  text = "Dhairya Bhatt",
  className = "",
  fontVariant = "rosegard",
  align = "center",
}: HeroScatterNameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Offscreen canvas for rendering the clean base text
    const textCanvas = document.createElement("canvas");
    const textCtx = textCanvas.getContext("2d");
    if (!textCtx) return;

    interface Slice {
      x: number;
      w: number;
      currentY: number;
      targetY: number;
      currentX: number;
      targetX: number;
      vy: number;
      vx: number;
      hashY: number;
      hashX: number;
    }

    let slices: Slice[] = [];
    const SLICE_WIDTH = 3; // 3px stripe width

    // Mouse coordinates relative to canvas
    let mouse = { x: -1000, y: -1000, active: false };

    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      width = rect.width;
      // Scaled up canvas height to support tall ascenders/descenders in Rose Gard without clipping
      height = Math.max(140, Math.min(width * 0.35, 200));

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      textCanvas.width = width * dpr;
      textCanvas.height = height * dpr;

      // Draw base text onto offscreen canvas with selected font family
      textCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      textCtx.clearRect(0, 0, width, height);

      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;
      // Font size tailored for Rose Gard and screen widths
      const fontSize = isMobile ? Math.min(width / 5.8, 68) : isTablet ? Math.min(width / 6.2, 102) : Math.min(width / 6.8, 140);

      if (fontVariant === "century") {
        textCtx.font = `italic 700 ${fontSize}px "Century Offline", Century, Georgia, serif`;
      } else if (fontVariant === "mono") {
        textCtx.font = `700 ${fontSize * 0.9}px var(--font-geist-mono), monospace`;
      } else if (fontVariant === "funnel") {
        textCtx.font = `700 ${fontSize}px "Funnel Sans", -apple-system, sans-serif`;
      } else {
        // Default: Rose Gard
        textCtx.font = `700 ${fontSize}px "Rose Gard", 'Funnel Sans', serif, sans-serif`;
      }

      textCtx.fillStyle = "#ECE8DF";
      textCtx.textBaseline = "middle";
      textCtx.textAlign = align === "center" ? "center" : "left";

      const textMetrics = textCtx.measureText(text);
      const textWidth = textMetrics.width;
      const textX = align === "center" ? width / 2 : 0;
      const textY = height / 2;
      textCtx.fillText(text, textX, textY);

      // Determine starting offset for vertical slices
      const startX = align === "center" ? Math.max(0, (width - textWidth) / 2) : 0;
      const totalSlices = Math.ceil((textWidth + 4) / SLICE_WIDTH);

      slices = [];
      for (let i = 0; i < totalSlices; i++) {
        const sx = startX + i * SLICE_WIDTH;
        slices.push({
          x: sx,
          w: SLICE_WIDTH,
          currentY: 0,
          targetY: 0,
          currentX: 0,
          targetX: 0,
          vy: 0,
          vx: 0,
          hashY: (pseudoRandom(i + 1) * 2 - 1),
          hashX: (pseudoRandom(i * 3 + 7) * 2 - 1),
        });
      }
    };

    if (document.fonts) {
      document.fonts.ready.then(() => {
        setup();
      });
    } else {
      setup();
    }

    const onResize = () => {
      setup();
    };
    window.addEventListener("resize", onResize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;

      mouse.x = nx;
      mouse.y = ny;
      mouse.active = nx >= -40 && nx <= width + 40 && ny >= -40 && ny <= height + 40;
    };

    const onMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    let time = 0;
    const animate = () => {
      time += 0.04;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const interactionRadius = width < 640 ? 120 : 180;

      for (let i = 0; i < slices.length; i++) {
        const slice = slices[i];
        const sliceCenterX = slice.x + slice.w / 2;

        let influence = 0;
        if (mouse.active) {
          const dx = Math.abs(sliceCenterX - mouse.x);
          if (dx < interactionRadius) {
            const norm = dx / interactionRadius;
            influence = 0.5 * (1 + Math.cos(Math.PI * norm));
          }
        }

        // Target scatter displacements
        if (influence > 0.01) {
          const scatterMagnitude = 38 * Math.pow(influence, 1.3);
          const wobble = Math.sin(time * 3 + i * 0.45);
          slice.targetY = slice.hashY * scatterMagnitude * (0.75 + 0.25 * wobble);
          slice.targetX = slice.hashX * 10 * influence;
        } else {
          slice.targetY = 0;
          slice.targetX = 0;
        }

        // Spring physics
        const springK = 0.17;
        const damping = 0.75;

        slice.vy += (slice.targetY - slice.currentY) * springK;
        slice.vy *= damping;
        slice.currentY += slice.vy;

        slice.vx += (slice.targetX - slice.currentX) * springK;
        slice.vx *= damping;
        slice.currentX += slice.vx;

        // On hover/scatter, slice line width separates slightly into distinct vertical lines
        const gap = influence > 0.02 ? 0.75 : 0;
        const destW = Math.max(1, slice.w - gap);

        const sourceX = slice.x * dpr;
        const sourceY = 0;
        const sourceW = slice.w * dpr;
        const sourceH = height * dpr;

        const destX = slice.x + slice.currentX;
        const destY = slice.currentY;
        const destH = height;

        // Draw ONLY the clean text slice itself
        ctx.drawImage(
          textCanvas,
          sourceX,
          sourceY,
          sourceW,
          sourceH,
          destX,
          destY,
          destW,
          destH
        );
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [text, fontVariant, align]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full cursor-pointer select-none ${className}`}
    >
      <h1 className="sr-only">{text}</h1>
      <canvas
        ref={canvasRef}
        className="block w-full pointer-events-none"
      />
    </div>
  );
}
