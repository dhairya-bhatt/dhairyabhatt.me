"use client";

import React, { useState } from "react";
import { photosData } from "@/content/photos";
import { PhotoCard } from "./PhotoCard";
import { PhotoLightbox } from "./PhotoLightbox";

export function ScatteredGallery() {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  const handleNext = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => (prev! + 1) % photosData.length);
  };

  const handlePrev = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => (prev! - 1 + photosData.length) % photosData.length);
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto mt-16 md:mt-24">
      {/* Editorial Section Label */}
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/[0.08] font-mono text-xs text-ink-muted">
        <span className="uppercase tracking-widest text-[11px] text-ink-secondary">
          [ ARCHIVE · 14 SCATTERED PHOTOGRAPHS ]
        </span>
        <span className="hidden sm:inline text-ink-muted/60">
          HOVER FOR EFFECT · CLICK TO EXPAND
        </span>
      </div>

      {/* Scattered Organic Cloud Layout (matching Figma prototype) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8 items-center justify-items-center py-6">
        {photosData.map((photo, index) => {
          // Add rhythmic vertical stagger and margin offsets to recreate the Figma scattered aesthetic
          const verticalOffset =
            index % 3 === 0
              ? "md:-translate-y-4"
              : index % 3 === 1
              ? "md:translate-y-6"
              : "md:translate-y-1";

          return (
            <div
              key={photo.id}
              className={`w-full max-w-[190px] sm:max-w-[210px] ${verticalOffset}`}
            >
              <PhotoCard
                photo={photo}
                onClick={() => setActivePhotoIndex(index)}
              />
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <PhotoLightbox
        photos={photosData}
        currentIndex={activePhotoIndex}
        onClose={() => setActivePhotoIndex(null)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
