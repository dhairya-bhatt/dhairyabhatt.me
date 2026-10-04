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
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-white/[0.08]">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-medium block mb-2">
              03 / SELECTED WORKS
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
              Featured Projects
            </h2>
          </div>

          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-ink-muted hover:text-white transition-colors py-2"
          >
            <span>VIEW ALL PROJECTS</span>
            <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1.5 transition-transform" />
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
