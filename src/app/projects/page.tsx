"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/nav/Header";
import { projectsData } from "@/content/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { StatsStrip } from "@/components/stats/StatsStrip";
import { ArrowLeft } from "lucide-react";

const CATEGORIES = ["All", "Full Stack", "Algorithms", "Quantitative", "Systems"] as const;

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const filteredProjects =
    activeCategory === "All"
      ? projectsData
      : projectsData.filter((p) => p.category === activeCategory);

  return (
    <div className="relative min-h-screen bg-canvas text-ink-primary">
      <Header />

      <main className="max-w-6xl mx-auto px-6 md:px-16 lg:px-20 pt-32 pb-24">
        {/* Navigation Back */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-ink-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-accent" />
            <span>RETURN HOME</span>
          </Link>
        </div>

        {/* Page Title */}
        <div className="space-y-3 mb-12">
          <span className="font-mono text-xs uppercase tracking-widest text-accent font-medium">
            INDEX // CODE &amp; ARCHITECTURE
          </span>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-white tracking-tight">
            Projects &amp; Systems
          </h1>
          <p className="font-sans text-base md:text-lg text-ink-secondary/90 max-w-2xl font-light">
            An index of algorithmic visualizers, real-time campus mapping games, and low-latency market infrastructure simulations built at Queen&apos;s University Belfast.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-12 pb-4 border-b border-white/[0.08]">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`font-mono text-xs px-4 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                activeCategory === cat
                  ? "bg-white text-black border-white font-medium"
                  : "bg-white/[0.03] text-ink-muted border-white/[0.08] hover:text-white hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        {/* Fun Facts / Stats Telemetry Strip */}
        <div className="mt-24 pt-12 border-t border-white/[0.08]">
          <StatsStrip />
        </div>
      </main>
    </div>
  );
}
