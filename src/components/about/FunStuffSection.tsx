"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles } from "lucide-react";
import { InteractiveMusicPlayer } from "./InteractiveMusicPlayer";
import { PhotoCollage } from "./PhotoCollage";
import { SocietiesCard } from "./SocietiesCard";

export function FunStuffSection() {
  const containerRef = useRef<HTMLElement>(null);

  // Extended runway height (620vh) for intentional, relaxed, and smooth scroll choreography
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. THE ORGANIC EXPANDING BLOB (sahor.work style):
  // The blob starts as a tangible 280px-320px parchment disc visible in the center of the screen.
  // As the user scrolls, the circle scales up (1 -> 14), physically expanding outward to swallow the viewport!
  const blobScale = useTransform(
    scrollYProgress,
    [0.05, 0.22, 0.84, 0.96],
    [1, 14, 14, 1]
  );

  // Initial teaser badge inside the blob (visible when blob is at rest, fades as it expands)
  const blobTeaserOpacity = useTransform(
    scrollYProgress,
    [0.05, 0.12, 0.88, 0.95],
    [1, 0, 0, 1]
  );

  // Full-screen parchment backdrop fades in right as the circle engulfs the viewport
  const parchmentBackdropOpacity = useTransform(
    scrollYProgress,
    [0.18, 0.24, 0.83, 0.89],
    [0, 1, 1, 0]
  );

  // Grand center title appears once the parchment world is unlocked
  const titleOpacity = useTransform(
    scrollYProgress,
    [0.18, 0.25, 0.82, 0.88],
    [0, 1, 1, 0]
  );
  const titleScale = useTransform(
    scrollYProgress,
    [0.18, 0.25, 0.82, 0.88],
    [0.85, 1, 1, 0.85]
  );

  // 2. ALTERNATING CHOREOGRAPHED CARDS: LEFT -> RIGHT -> LEFT
  // Each card has an intentional entry, generous resting stage, and clean departure.

  // CARD 1: Music & Live Vinyl Card (LEFT on desktop, CENTER on mobile)
  const yCard1 = useTransform(
    scrollYProgress,
    [0.25, 0.32, 0.40, 0.46],
    ["110vh", "0vh", "0vh", "-110vh"]
  );
  const opacityCard1 = useTransform(
    scrollYProgress,
    [0.25, 0.30, 0.41, 0.46],
    [0, 1, 1, 0]
  );

  // CARD 2: Photo Gallery Card (RIGHT on desktop, CENTER on mobile)
  const yCard2 = useTransform(
    scrollYProgress,
    [0.44, 0.51, 0.59, 0.65],
    ["110vh", "0vh", "0vh", "-110vh"]
  );
  const opacityCard2 = useTransform(
    scrollYProgress,
    [0.44, 0.49, 0.60, 0.65],
    [0, 1, 1, 0]
  );

  // CARD 3: Campus Societies Card (LEFT on desktop, CENTER on mobile)
  const yCard3 = useTransform(
    scrollYProgress,
    [0.63, 0.70, 0.78, 0.84],
    ["110vh", "0vh", "0vh", "-110vh"]
  );
  const opacityCard3 = useTransform(
    scrollYProgress,
    [0.63, 0.68, 0.79, 0.84],
    [0, 1, 1, 0]
  );

  return (
    <section
      ref={containerRef}
      id="fun-stuff"
      className="relative w-full h-[620vh] bg-[#111111] border-t border-white/[0.08]"
    >
      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex items-center justify-center bg-[#111111]">
        {/* Full parchment backdrop that covers 100% of any screen width/aspect ratio once blob expands */}
        <motion.div
          style={{ opacity: parchmentBackdropOpacity }}
          className="absolute inset-0 bg-[#EFECE6] z-0 pointer-events-none will-change-[opacity]"
        />

        {/* 1. PHYSICAL EXPANDING CIRCLE / BLOB (sahor.work effect)
            Starts as a visible 280-320px circular disk in view.
            As you scroll, it scales up smoothly, engulfing the viewport! */}
        <motion.div
          style={{ scale: blobScale }}
          className="absolute w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] rounded-full bg-[#EFECE6] border border-black/10 shadow-[0_20px_70px_rgba(0,0,0,0.6),0_0_80px_rgba(239,236,230,0.15)] flex items-center justify-center will-change-transform z-10 pointer-events-none overflow-hidden"
        />

        {/* Initial Teaser Badge visible inside the blob before expansion */}
        <motion.div
          style={{ opacity: blobTeaserOpacity }}
          className="absolute z-20 flex flex-col items-center justify-center text-center p-6 pointer-events-none select-none max-w-[280px]"
        >
          <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-black/50 mb-1.5">
            <Sparkles className="w-3 h-3 text-black/40" />
            <span>DIGITAL ARCHIVE</span>
          </div>

          <h3 className="font-rosegard italic text-2xl sm:text-3xl text-[#141416] leading-tight mb-2">
            hobbies &amp; pursuits
          </h3>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 border border-black/10 font-mono text-[9px] text-black/70 tracking-wider uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>scroll to explore</span>
          </div>
        </motion.div>

        {/* 2. GRAND PARCHMENT WORLD CONTENT (Revealed once blob has expanded) */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          {/* CENTER TITLE:
              Desktop: Anchors center at z-10.
              Mobile: Sits at z-0 so cards at z-20 overlap directly over it. */}
          <motion.div
            style={{ opacity: titleOpacity, scale: titleScale }}
            className="absolute inset-0 flex items-center justify-center z-0 md:z-10 pointer-events-none select-none px-4 will-change-transform"
          >
            <div className="text-center flex flex-col items-center justify-center">
              {/* Meta tag */}
              <div className="font-mono text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest text-black/60 mb-1 sm:mb-2">
                DIGITAL ARCHIVE · HOBBIES &amp; PURSUITS
              </div>

              {/* Signature Layered Centered Typography (Mobile & Desktop) */}
              <div className="relative flex items-center justify-center my-0.5 sm:my-1">
                {/* Giant Hollow Outline (Rose Gard): 'things' */}
                <h2
                  className="font-rosegard italic text-6xl sm:text-7xl md:text-[120px] lg:text-[150px] leading-none tracking-normal lowercase select-none text-center"
                  style={{
                    WebkitTextStroke: "1.5px rgba(18, 18, 20, 0.45)",
                    color: "transparent",
                  }}
                >
                  things
                </h2>

                {/* Overlaid Solid Text: 'i do for hobbies' Centered in Front (Rose Gard) */}
                <div className="absolute inset-0 flex items-center justify-center px-2">
                  <span className="font-rosegard font-normal text-sm sm:text-lg md:text-3xl lg:text-4xl tracking-normal lowercase text-[#111113] bg-[#EFECE6]/90 px-3.5 py-1 sm:px-5 sm:py-1.5 md:px-6 md:py-2 rounded-full backdrop-blur-md shadow-sm border border-black/5 whitespace-nowrap">
                    i do for hobbies
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CARD 1: Music & Live Vinyl Card
              Mobile: Perfect dead-center (overlaps main title).
              Desktop: Left side (md:justify-start with md:px-8 lg:px-14 xl:px-24). */}
          <div className="absolute inset-0 flex items-center justify-center md:justify-start pointer-events-none z-20 md:px-8 lg:px-14 xl:px-24">
            <motion.div
              style={{ y: yCard1, opacity: opacityCard1 }}
              className="pointer-events-auto w-[90vw] max-w-[320px] sm:max-w-[350px] md:max-w-[380px] lg:max-w-[400px] will-change-transform shadow-2xl"
            >
              <InteractiveMusicPlayer />
            </motion.div>
          </div>

          {/* CARD 2: Photo Gallery Card
              Mobile: Perfect dead-center (overlaps main title).
              Desktop: Right side (md:justify-end with md:px-8 lg:px-14 xl:px-24). */}
          <div className="absolute inset-0 flex items-center justify-center md:justify-end pointer-events-none z-20 md:px-8 lg:px-14 xl:px-24">
            <motion.div
              style={{ y: yCard2, opacity: opacityCard2 }}
              className="pointer-events-auto w-[90vw] max-w-[320px] sm:max-w-[350px] md:max-w-[380px] lg:max-w-[400px] will-change-transform shadow-2xl"
            >
              <PhotoCollage />
            </motion.div>
          </div>

          {/* CARD 3: Campus Societies Card
              Mobile: Perfect dead-center (overlaps main title).
              Desktop: Left side (md:justify-start with md:px-8 lg:px-14 xl:px-24). */}
          <div className="absolute inset-0 flex items-center justify-center md:justify-start pointer-events-none z-20 md:px-8 lg:px-14 xl:px-24">
            <motion.div
              style={{ y: yCard3, opacity: opacityCard3 }}
              className="pointer-events-auto w-[90vw] max-w-[320px] sm:max-w-[350px] md:max-w-[380px] lg:max-w-[400px] will-change-transform shadow-2xl"
            >
              <SocietiesCard />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
