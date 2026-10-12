"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/nav/Header";
import { projectsData } from "@/content/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { StatsStrip } from "@/components/stats/StatsStrip";
import { ArrowLeft } from "lucide-react";

export default function ProjectsPage() {
  // Split projects into the two required groups, ordered strongest first
  const codeProjects = projectsData.filter((p) => p.group === "Code");
  const beyondCodeProjects = projectsData.filter((p) => p.group === "Beyond the code");

  return (
    <div className="relative min-h-screen bg-canvas text-ink-primary">
      <Header />

      <main className="max-w-6xl mx-auto px-6 md:px-16 lg:px-20 pt-32 pb-24">
        {/* Navigation Back */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-funnel text-xs text-ink-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-white/70" />
            <span>back to home</span>
          </Link>
        </div>

        {/* Page Title */}
        <div className="space-y-2 mb-16">
          <h1 className="font-rosegard text-5xl sm:text-6xl md:text-7xl text-white tracking-normal lowercase">
            projects
          </h1>
          <p className="font-funnel text-sm sm:text-base text-ink-muted max-w-xl font-light">
            Software, algorithms, and initiatives.
          </p>
        </div>

        {/* Group 1: Code */}
        <section className="mb-20">
          <div className="flex items-center justify-between pb-3 mb-8 border-b border-white/[0.08] font-mono text-xs text-ink-muted">
            <span className="uppercase tracking-widest text-[11px] text-white">
              [ CODE ]
            </span>
            <span>{codeProjects.length} PROJECTS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {codeProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>

        {/* Group 2: Beyond the code */}
        <section className="mb-20">
          <div className="flex items-center justify-between pb-3 mb-8 border-b border-white/[0.08] font-mono text-xs text-ink-muted">
            <span className="uppercase tracking-widest text-[11px] text-white">
              [ BEYOND THE CODE ]
            </span>
            <span>{beyondCodeProjects.length} PROJECTS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beyondCodeProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </section>

        {/* Fun Facts / Stats Telemetry Strip */}
        <div className="mt-24 pt-12 border-t border-white/[0.08]">
          <StatsStrip />
        </div>
      </main>
    </div>
  );
}
