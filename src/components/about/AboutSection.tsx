"use client";

import React from "react";
import Image from "next/image";
import { MarqueeStrip } from "./MarqueeStrip";
import { ScatteredGallery } from "./ScatteredGallery";
import { portraitPhoto } from "@/content/photos";

export function AboutSection() {
  return (
    <section id="about" className="relative w-full pt-12 pb-24 overflow-hidden">
      {/* 1. Big Marquee Strip matching Figma */}
      <div className="w-full mb-16 md:mb-24">
        <MarqueeStrip text="ABOUT ME · ABOUT ME · ABOUT ME · ABOUT ME · " />
      </div>

      {/* 2. Main Bio & Portrait Row matching Figma */}
      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
          {/* Left Column: Bio Text */}
          <div className="md:col-span-7 space-y-6">
            <p className="font-sans text-base sm:text-lg md:text-xl text-ink-secondary leading-relaxed font-light">
              Hello! I&apos;m Dhairya Bhatt and currently studying Mathematics and Computer Science at Queen&apos;s University Belfast. My journey has been shaped by a deep-seated passion for both computers and mathematics. These interests have not only influenced my academic pursuits but have also led me to explore various innovative projects and initiatives.
            </p>
            <p className="font-sans text-sm sm:text-base text-ink-muted leading-relaxed">
              My technical interests revolve around quantitative analysis, high-performance systems, and full-stack software engineering. I enjoy designing rigorous algorithms, dissecting financial market mechanics, and engineering intuitive digital tools.
            </p>

            {/* Academic Highlights */}
            <div className="pt-2 flex flex-wrap gap-2 font-mono text-xs text-ink-muted">
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
                Queen&apos;s University Belfast
              </span>
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
                BSc Maths &amp; CS
              </span>
              <span className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08]">
                Class of &apos;28
              </span>
            </div>
          </div>

          {/* Right Column: Rounded-Square Portrait matching Figma */}
          <div className="md:col-span-5 flex justify-center md:justify-end">
            <div className="relative w-60 sm:w-72 md:w-80 aspect-[4/5] rounded-[28px] overflow-hidden border border-white/10 shadow-2xl bg-[#161618] group">
              <Image
                src={portraitPhoto.src}
                alt={portraitPhoto.alt}
                fill
                priority
                sizes="(max-width: 768px) 280px, 340px"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[28px] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* 3. Scattered Personal Photo Gallery with Per-Photo Effects */}
        <ScatteredGallery />

        {/* 4. Understated Vinland Saga Quote */}
        <div className="mt-20 pt-8 border-t border-white/[0.06] text-center">
          <p className="font-serif italic text-base md:text-lg text-ink-muted/60 hover:text-ink-secondary transition-colors inline-block cursor-default">
            &ldquo;I have no enemies.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
