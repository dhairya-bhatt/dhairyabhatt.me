"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { motion } from "framer-motion";
import { aboutContent } from "@/content/about";
import {
  FileText,
  GraduationCap,
  Sparkles,
} from "lucide-react";

export function AboutSection() {
  const [cvExists, setCvExists] = useState<boolean>(true);

  // Check if cv.pdf actually exists at runtime or fallback
  useEffect(() => {
    if (!aboutContent.cvUrl) {
      setCvExists(false);
      return;
    }
    fetch(aboutContent.cvUrl, { method: "HEAD" })
      .then((res) => {
        if (!res.ok) setCvExists(false);
      })
      .catch(() => setCvExists(false));
  }, []);

  return (
    <section
      id="about"
      className="relative w-full min-h-[160vh] pt-16 md:pt-24 pb-48 border-t border-white/[0.08] overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-20">
        {/* 1. Signature Sticky Section Header */}
        <div className="sticky top-16 md:top-20 z-20 -mx-6 md:-mx-16 lg:-mx-20 px-6 md:px-16 lg:px-20 py-3 md:py-4 bg-[#111111]/85 backdrop-blur-md border-b border-white/[0.04]">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              strokedTitle="about"
              solidTitle="me"
              tag="BIOGRAPHY · BACKGROUND & EDUCATION"
              className="mb-0"
            />
          </div>
        </div>

        {/* 2. Progressive Content Flow */}
        <div className="space-y-32 md:space-y-40 mt-16 md:mt-24">
          {/* BEAT 1: Core Philosophy & Portrait Photo */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center"
          >
            {/* Lead Bio */}
            <div className="md:col-span-7 space-y-6">
              <span className="font-mono text-[10px] tracking-widest uppercase text-ink-muted">
                INTRO &amp; CORE FOCUS
              </span>
              <p className="font-funnel text-lg sm:text-xl md:text-2xl text-white font-normal leading-relaxed">
                {aboutContent.bio.lead}
              </p>
              {aboutContent.bio.body.map((para, i) => (
                <p
                  key={i}
                  className="font-funnel text-sm sm:text-base text-ink-secondary leading-relaxed font-light"
                >
                  {para}
                </p>
              ))}

              {/* CV Download button (strictly hidden if cvUrl is missing or invalid) */}
              {cvExists && aboutContent.cvUrl && (
                <div className="pt-2">
                  <a
                    href={aboutContent.cvUrl}
                    download="Dhairya_Bhatt_CV.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-full bg-white/[0.04] text-white hover:bg-white/[0.1] border border-white/10 hover:border-white/20 transition-all duration-200"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download CV (PDF)</span>
                  </a>
                </div>
              )}
            </div>

            {/* Portrait Photo */}
            <div className="md:col-span-5 flex justify-center md:justify-end">
              <div className="relative w-64 sm:w-72 md:w-80 aspect-[4/5] rounded-[28px] overflow-hidden border border-white/10 shadow-2xl bg-[#161618] group cursor-pointer select-none">
                {/* Default B&W Portrait */}
                <Image
                  src="/photos/portrait-black.png"
                  alt="Dhairya Bhatt Portrait"
                  fill
                  priority
                  sizes="(max-width: 768px) 280px, 340px"
                  className="object-cover"
                />

                {/* Hover State: Colourful Silhouette Portrait */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <Image
                    src="/photos/portrait-hover.png"
                    alt="Dhairya Bhatt Portrait in Colour"
                    fill
                    priority
                    sizes="(max-width: 768px) 280px, 340px"
                    className="object-cover"
                  />
                </div>

                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-white/25 transition-all duration-500 rounded-[28px] pointer-events-none" />
              </div>
            </div>
          </motion.div>

          {/* BEAT 2: Education Cards (Queen's University Belfast & Silver Bells Public School) */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="pt-16 border-t border-white/[0.06]"
          >
            <div className="flex items-center justify-between pb-3 mb-8 border-b border-white/[0.06] font-mono text-[10px] tracking-widest uppercase text-ink-muted">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-white/70" />
                <span>EDUCATION</span>
              </div>
              <span>ACADEMIC BACKGROUND</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aboutContent.educations.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-6 md:p-8 rounded-2xl border border-white/10 bg-[#161618] shadow-xl flex flex-col justify-between"
                >
                  <div className="pb-4 border-b border-white/[0.06]">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-funnel font-medium text-xl sm:text-2xl text-white tracking-tight">
                          {edu.degree}
                        </h3>
                        <p className="font-funnel text-sm text-ink-secondary mt-1">
                          {edu.institution}
                        </p>
                      </div>
                      <span className="font-mono text-xs px-3 py-1 rounded-full bg-white/[0.04] text-white/80 border border-white/10 shrink-0">
                        {edu.year}
                      </span>
                    </div>
                  </div>

                  {edu.board && (
                    <div className="pt-3">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                        {edu.board}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* BEAT 3: Volunteering & Experience List */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="pt-16 border-t border-white/[0.06]"
          >
            <div className="flex items-center justify-between pb-3 mb-8 border-b border-white/[0.06] font-mono text-[10px] tracking-widest uppercase text-ink-muted">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>VOLUNTEERING &amp; EXPERIENCE</span>
              </div>
              <span>TRACK RECORD</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {aboutContent.volunteeringAndExperience.map((item, index) => {
                return (
                  <div
                    key={item.id}
                    className="p-6 rounded-2xl border border-white/10 bg-[#161618] hover:border-white/20 transition-all duration-300 shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06] font-mono text-[9px] uppercase tracking-wider text-ink-muted">
                        <span>0{index + 1} · {item.role}</span>
                        {item.dates ? (
                          <span className="text-white/60">{item.dates}</span>
                        ) : null}
                      </div>

                      <h4 className="font-funnel font-medium text-lg text-white mb-2">
                        {item.role}, {item.organisation}
                      </h4>

                      <p className="font-funnel text-xs sm:text-sm text-ink-secondary leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
