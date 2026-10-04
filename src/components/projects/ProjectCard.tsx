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
      <div className="p-6 md:p-8 flex-1 flex flex-col justify-between space-y-5 relative z-10">
        <div>
          {/* Category & Title */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="font-mono text-[11px] text-accent uppercase tracking-wider">
              {project.category}
            </span>
          </div>

          <h3 className="font-serif text-2xl md:text-3xl text-white group-hover:text-accent transition-colors">
            {project.title}
          </h3>

          <p className="font-sans text-sm text-ink-muted mt-2 line-clamp-3 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Tech Stack Chips */}
        <div>
          <div className="flex flex-wrap gap-1.5 pt-2">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[11px] text-ink-secondary bg-white/[0.04] px-2.5 py-1 rounded border border-white/[0.06]"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Metrics if present */}
          {project.metrics && (
            <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-2 gap-2 font-mono text-[11px] text-ink-muted">
              {project.metrics.map((m, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-accent" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action Links */}
          <div className="mt-6 flex items-center gap-4 font-mono text-xs">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-accent flex items-center gap-1.5 transition-colors group/link"
              >
                <span>VISIT DEMO</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-muted hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>SOURCE</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
