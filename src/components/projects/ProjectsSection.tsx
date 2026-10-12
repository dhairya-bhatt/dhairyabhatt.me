"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { projectsData } from "@/content/projects";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";

export function ProjectsSection() {
  // Sort by featuredOrder to guarantee: 1. The Graticule, 2. QUB GeoGuessr, 3. Book
  const featuredProjects = projectsData
    .filter((p) => p.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));

  return (
    <section
      id="projects"
      className="relative w-full min-h-[170vh] pt-16 md:pt-24 pb-48 border-t border-white/[0.08]"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-20">
        {/* Signature Centered Overlapping Section Header */}
        <SectionHeader
          strokedTitle="selected"
          solidTitle="work"
          tag="SELECTED WORK"
          actionHref="/projects"
          actionText="view all projects"
        />

        {/* Editorial Project Showcases */}
        <div className="space-y-36 md:space-y-48 mt-16 md:mt-24">
          {featuredProjects.map((project, idx) => {
            const isReversed = idx % 2 === 1;
            const displayTitle = project.title || project.headingFallback || "My book";

            // Show live project link if liveUrl exists
            const canShowLiveLink = Boolean(project.liveUrl);

            return (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 70 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-14 items-center"
              >
                {/* Visual Image Preview Column */}
                <div
                  className={`lg:col-span-7 ${
                    isReversed ? "lg:order-2" : "lg:order-1"
                  }`}
                >
                  <div
                    data-cursor="read-me"
                    className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 bg-[#161618] shadow-2xl group cursor-pointer"
                  >
                    {project.previewImage && (
                      <Image
                        src={project.previewImage}
                        alt={displayTitle}
                        fill
                        unoptimized={project.previewImage.endsWith('.gif')}
                        sizes="(max-width: 1024px) 100vw, 680px"
                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161618] via-transparent to-transparent opacity-60" />

                    {/* Status Badge & Label */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      {project.label && (
                        <span className="font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md bg-white/10 text-white/90 border-white/20">
                          {project.label}
                        </span>
                      )}
                      <span
                        className={`font-mono text-[10px] uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md ${
                          project.status.toLowerCase() === "live"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : project.status.toLowerCase() === "published"
                            ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        }`}
                      >
                        {project.status.toLowerCase() === "live"
                          ? "● LIVE"
                          : project.status.toLowerCase() === "published"
                          ? "● PUBLISHED"
                          : `◐ ${project.status.toUpperCase()}`}
                      </span>
                    </div>

                    {/* Inset Border */}
                    <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-white/20 transition-all rounded-2xl pointer-events-none" />
                  </div>
                </div>

                {/* Project Metadata & Story Column */}
                <div
                  className={`lg:col-span-5 space-y-5 ${
                    isReversed ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-ink-muted">
                    <span>{project.role || project.group}</span>
                    <span>FEATURED 0{idx + 1}</span>
                  </div>

                  <h3 className="font-funnel font-medium text-2xl sm:text-3xl text-white tracking-tight">
                    {displayTitle}
                  </h3>

                  <p className="font-funnel text-sm sm:text-base text-ink-secondary leading-relaxed font-light">
                    {project.summary}
                  </p>

                  {/* Stats chips (Never rendered if empty or null) */}
                  {project.stats && project.stats.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {project.stats.map((stat) => (
                        <span
                          key={stat}
                          className="font-mono text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md bg-white/5 text-white/80 border border-white/10"
                        >
                          {stat}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tech Stack Chips (Only if stack has items) */}
                  {project.stack && project.stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/[0.06]">
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          className="font-mono text-[9px] uppercase tracking-wider text-ink-muted"
                        >
                          #{tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Links */}
                  <div className="flex flex-wrap items-center gap-4 pt-3 font-funnel text-sm">
                    {/* Live link or external link */}
                    {Boolean(project.liveUrl) && (
                      <a
                        href={project.liveUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-white hover:text-white/80 transition-colors font-medium underline underline-offset-4 decoration-white/40 hover:decoration-white"
                      >
                        <span>{project.linkLabel || "launch project"}</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}

                    {/* GitHub Source Code link */}
                    {Boolean(project.repoUrl) && (
                      <a
                        href={project.repoUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-ink-secondary hover:text-white transition-colors font-medium underline underline-offset-4 decoration-white/20 hover:decoration-white text-xs"
                      >
                        <span>source code</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Projects Button */}
        <div className="mt-28 text-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs px-6 py-3 rounded-full bg-white/[0.04] text-white hover:bg-white/[0.1] border border-white/10 hover:border-white/25 transition-all uppercase tracking-widest"
          >
            <span>VIEW ALL PROJECTS ({projectsData.length})</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
