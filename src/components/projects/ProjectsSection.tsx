"use client";

import React from "react";
import Link from "next/link";
import { projectsData } from "@/content/projects";
import { ProjectCard } from "./ProjectCard";
import { ArrowRight } from "lucide-react";

export function ProjectsSection() {
  const featuredProjects = projectsData.filter((p) => p.featured);

  return (
    <section id="projects" className="relative w-full py-24 px-6 md:px-16 lg:px-20 border-t border-white/[0.08]">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-baseline justify-between mb-12 pb-4 border-b border-white/[0.08]">
          <h2 className="font-funnel text-3xl sm:text-4xl md:text-5xl text-white font-normal lowercase tracking-tight">
            selected work
          </h2>

          <Link
            href="/projects"
            className="group inline-flex items-center gap-1.5 font-funnel text-xs sm:text-sm lowercase text-ink-muted hover:text-white transition-colors py-2"
          >
            <span>view all projects</span>
            <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
