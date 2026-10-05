"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Project } from "@/content/projects";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, isHovered: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setMousePos((prev) => ({ ...prev, isHovered: false }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-2xl border border-white/[0.08] bg-[#171719] overflow-hidden group transition-all duration-300 hover:border-white/20 hover:shadow-2xl flex flex-col justify-between"
    >
      {/* Dynamic Cursor Spotlight Radial Gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: mousePos.isHovered
            ? `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 70, 50, 0.08), transparent 70%)`
            : "none",
        }}
      />

      {/* Top Image Preview Banner */}
      {project.previewImage && (
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-black/60 border-b border-white/[0.06]">
          <Image
            src={project.previewImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171719] via-transparent to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`font-mono text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-md ${
                project.status === "Live"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}
            >
              {project.status === "Live" ? "● LIVE" : "◐ IN PROGRESS"}
            </span>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5 relative z-10">
        <div>
          {/* Category & Year */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="font-funnel text-xs text-ink-muted lowercase">
              {project.category.toLowerCase()}
            </span>
            <span className="font-funnel text-xs text-ink-muted/70">
              2025
            </span>
          </div>

          <h3 className="font-funnel font-medium text-xl sm:text-2xl text-white group-hover:text-accent transition-colors tracking-tight">
            {project.title}
          </h3>

          <p className="font-funnel text-sm text-ink-muted mt-2 leading-relaxed line-clamp-2 font-light">
            {project.tagline}
          </p>
        </div>

        {/* Tech Stack & Links */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="font-funnel text-[11px] text-ink-secondary bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 font-funnel text-xs">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent inline-flex items-center gap-1 transition-colors"
              >
                <span>live</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ) : project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-muted hover:text-white inline-flex items-center gap-1 transition-colors"
              >
                <span>source</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
