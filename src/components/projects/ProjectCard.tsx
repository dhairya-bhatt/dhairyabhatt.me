"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Project } from "@/content/projects";
import { ArrowUpRight } from "lucide-react";

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

  const displayTitle = project.title || project.headingFallback || "Author of All About Maths";

  // Check link validity: show whenever a liveUrl exists
  const hasValidLink = Boolean(project.liveUrl);

  const linkText = project.linkLabel || "live";

  return (
    <div
      id={project.slug}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor="read-me"
      className="relative rounded-2xl border border-white/[0.08] bg-[#171719] overflow-hidden group transition-all duration-300 hover:border-white/20 hover:shadow-2xl flex flex-col justify-between"
    >
      {/* Dynamic Cursor Spotlight Radial Gradient */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: mousePos.isHovered
            ? `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.06), transparent 70%)`
            : "none",
        }}
      />

      {/* Top Image Preview Banner */}
      {project.previewImage && (
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-black/60 border-b border-white/[0.06]">
          <Image
            src={project.previewImage}
            alt={displayTitle}
            fill
            unoptimized={project.previewImage.endsWith('.gif')}
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#171719] via-transparent to-transparent" />

          {/* Status Badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            {project.label && (
              <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border backdrop-blur-md bg-white/10 text-white/90 border-white/20">
                {project.label}
              </span>
            )}
            <span
              className={`font-mono text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full border backdrop-blur-md ${
                project.status === "Live"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : project.status === "Published"
                  ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
                  : project.status === "Completed"
                  ? "bg-blue-500/10 text-blue-300 border-blue-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}
            >
              {project.status === "Live"
                ? "● LIVE"
                : project.status === "Published"
                ? "● PUBLISHED"
                : project.status === "Completed"
                ? "● COMPLETED"
                : `◐ ${project.status.toUpperCase()}`}
            </span>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5 relative z-10">
        <div>
          {/* Group / Role */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="font-funnel text-xs text-ink-muted">
              {project.role || project.group}
            </span>
          </div>

          <h3 className="font-funnel font-medium text-xl sm:text-2xl text-white group-hover:text-white transition-colors tracking-tight">
            {displayTitle}
          </h3>

          <p className="font-funnel text-sm text-ink-muted mt-2 leading-relaxed font-light">
            {project.summary}
          </p>

          {/* Stats Badges / Metrics (Never render empty chips) */}
          {project.stats && project.stats.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {project.stats.map((stat) => (
                <span
                  key={stat}
                  className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.04] text-white/70 border border-white/[0.06]"
                >
                  {stat}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Tech Stack & Links (Only render if there are items) */}
        <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {project.stack && project.stack.length > 0 ? (
              project.stack.map((tech) => (
                <span
                  key={tech}
                  className="font-funnel text-[11px] text-ink-secondary bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]"
                >
                  {tech}
                </span>
              ))
            ) : (
              <span className="font-funnel text-[11px] text-ink-muted">
                {project.group}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 font-funnel text-xs">
            {hasValidLink && project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/90 hover:text-white inline-flex items-center gap-1 transition-colors underline-offset-4 hover:underline"
              >
                <span>{linkText}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}

            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-secondary hover:text-white inline-flex items-center gap-1 transition-colors underline-offset-4 hover:underline text-[11px]"
              >
                <span>code</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
