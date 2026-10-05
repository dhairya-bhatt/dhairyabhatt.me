"use client";

import React from "react";
import { GrainyName } from "./GrainyName";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-28 md:pt-36 pb-16 md:pb-24"
    >
      <div className="max-w-5xl">
        {/* "THE PORTFOLIO OF" Editorial Serif Overline matching Figma */}
        <div className="space-y-0.5 mb-2 md:mb-3">
          <span className="block font-serif text-2xl sm:text-3xl md:text-4xl text-ink-primary font-normal tracking-wide">
            THE
          </span>
          <span className="block font-serif text-2xl sm:text-3xl md:text-4xl text-ink-primary font-normal tracking-wide">
            PORTFOLIO OF
          </span>
        </div>

        {/* Grain Particle Name Assembly */}
        <div className="mb-3 md:mb-4 max-w-4xl">
          <GrainyName />
        </div>

        {/* Subtitle in clean, understated grey sans matching Figma */}
        <div className="max-w-xl">
          <p className="font-sans text-sm sm:text-base md:text-lg text-ink-muted font-normal">
            Mathematics &amp; Computer Science Undergrad
          </p>
        </div>
      </div>
    </section>
  );
}
