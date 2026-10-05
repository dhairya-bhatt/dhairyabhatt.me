"use client";

import React from "react";
import { GrainyName } from "./GrainyName";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex flex-col justify-center px-8 sm:px-14 md:px-20 lg:px-28 pt-32 md:pt-40 pb-20 md:pb-28"
    >
      <div className="max-w-5xl">
        {/* "THE PORTFOLIO OF" in Century font matching reference image */}
        <div className="space-y-0.5 mb-2 md:mb-3">
          <span className="block font-century text-2xl sm:text-3xl md:text-4xl text-white font-normal tracking-[0.02em] leading-tight">
            THE
          </span>
          <span className="block font-century text-2xl sm:text-3xl md:text-4xl text-white font-normal tracking-[0.02em] leading-tight">
            PORTFOLIO OF
          </span>
        </div>

        {/* Name in Century bold with interactive grain assembly */}
        <div className="mb-3 md:mb-4 max-w-4xl">
          <GrainyName />
        </div>

        {/* Subtitle in Helvetica medium-grey matching reference image */}
        <div className="max-w-xl mt-3 md:mt-4">
          <p className="font-helvetica text-lg sm:text-xl md:text-2xl text-[#828288] font-normal leading-relaxed">
            Mathematics &amp; Computer Science Undergrad
          </p>
        </div>
      </div>
    </section>
  );
}
