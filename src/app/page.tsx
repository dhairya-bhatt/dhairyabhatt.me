"use client";

import React, { useState } from "react";
import { Header } from "@/components/nav/Header";
import { HeroSection } from "@/components/hero/HeroSection";
import { AboutSection } from "@/components/about/AboutSection";
import { ProjectsSection } from "@/components/projects/ProjectsSection";
import { FunStuffSection } from "@/components/about/FunStuffSection";
import { Footer } from "@/components/footer/Footer";
import { MacLoadingSpiral } from "@/components/ui/MacLoadingSpiral";

export default function Home() {
  const [isIntroComplete, setIsIntroComplete] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#111111]">
      {/* Macintosh "hello" into Golden Ratio Spiral Intro Transition */}
      <MacLoadingSpiral onComplete={() => setIsIntroComplete(true)} />

      {/* Fixed Pokéball Navigation Header with Throw Entry */}
      <Header isIntroComplete={isIntroComplete} />

      {/* Main Experience */}
      <main className="relative">
        {/* 1. Static Landing Hero: Stays fixed/pinned in the background while the rest of the site scrolls over it */}
        <div className="sticky top-0 h-[100dvh] w-full z-0 overflow-hidden">
          <HeroSection isIntroComplete={isIntroComplete} />
        </div>

        {/* 2. Content Stack: Slides up and over the landing hero */}
        <div className="relative z-10 bg-[#111111] shadow-[0_-25px_60px_rgba(0,0,0,0.9)]">
          {/* About Me: Scroll-driven Marquee + Bio + Grayscale Portrait */}
          <AboutSection />

          {/* Featured Projects Showcase (Selected Work) */}
          <ProjectsSection />

          {/* Curated Fun Stuff: Live Music Player & Desktop Photo Collage */}
          <FunStuffSection />

          {/* Footer */}
          <Footer />
        </div>
      </main>
    </div>
  );
}
