"use client";

import React from "react";
import Image from "next/image";
import { MarqueeStrip } from "./MarqueeStrip";
import { InteractiveMusicPlayer } from "./InteractiveMusicPlayer";
import { PhotoCollage } from "./PhotoCollage";
import { portraitPhoto } from "@/content/photos";

export function AboutSection() {
  return (
    <section id="about" className="relative w-full pt-6 pb-20 overflow-hidden">
      {/* 1. Big Marquee Strip matching Figma */}
      <div className="w-full mb-14 md:mb-20">
        <MarqueeStrip text="ABOUT ME · ABOUT ME · ABOUT ME · ABOUT ME · " />
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-20">
        {/* 2. Main Bio & Portrait Row matching Figma */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-center">
          {/* Left Column: Bio Text */}
          <div className="md:col-span-7 space-y-6">
            <p className="font-funnel text-lg sm:text-xl md:text-2xl text-white font-normal leading-relaxed">
              I study Mathematics and Computer Science at Queen&apos;s University Belfast.
            </p>
            <p className="font-funnel text-base sm:text-lg text-ink-secondary leading-relaxed font-light">
              Drawn to the intersection of mathematical theory and high-performance computing—focusing on market microstructure, quantitative modeling, and low-latency systems.
            </p>
            <p className="font-funnel text-sm sm:text-base text-ink-muted leading-relaxed font-light">
              I value systems that balance mathematical rigor and engineering craftsmanship: fast, reliable, and built with purpose.
            </p>

            {/* Clean Experience / Timeline in Anushka's style */}
            <div className="pt-4 space-y-3 border-t border-white/[0.08]">
              <div className="flex items-baseline justify-between font-funnel text-xs sm:text-sm">
                <span className="text-white font-medium">Queen&apos;s University Belfast</span>
                <span className="text-ink-muted">2024 — Present</span>
              </div>
              <p className="font-funnel text-xs text-ink-muted -mt-2">
                BSc Mathematics &amp; Computer Science
              </p>

              <div className="flex items-baseline justify-between font-funnel text-xs sm:text-sm pt-2">
                <span className="text-white font-medium">Quantitative Systems &amp; Research</span>
                <span className="text-ink-muted">2025 — Present</span>
              </div>
              <p className="font-funnel text-xs text-ink-muted -mt-2">
                High-performance order matching engines &amp; algorithmic simulations
              </p>
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

        {/* 3. Curated Small Space for Fun Things (Music Player & Photo Collage) */}
        <div className="mt-16 md:mt-20 pt-10 border-t border-white/[0.08]">
          <div className="flex items-center justify-between mb-8 font-funnel text-xs sm:text-sm text-ink-muted">
            <span className="text-white font-medium lowercase">
              when i&apos;m not coding
            </span>
            <span className="text-ink-muted lowercase">
              live music &amp; archives
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Left: Interactive Turntable / Music Player */}
            <InteractiveMusicPlayer />

            {/* Right: Scattered Photo Collage */}
            <PhotoCollage />
          </div>
        </div>

        {/* 4. Understated Vinland Saga Quote */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] text-center">
          <p className="font-century italic text-base md:text-lg text-ink-muted/50 hover:text-ink-secondary transition-colors inline-block cursor-default">
            &ldquo;I have no enemies.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
