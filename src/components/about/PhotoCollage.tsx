"use client";

import React, { useState } from "react";
import Image from "next/image";
import { photosData, GalleryPhoto } from "@/content/photos";
import { PhotoLightbox } from "./PhotoLightbox";
import { Maximize2 } from "lucide-react";

export function PhotoCollage() {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  // Curate a set of 6 key snapshots that assemble into the collage cluster
  const collagePhotos = photosData.slice(0, 6);

  const handleNext = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => (prev! + 1) % photosData.length);
  };

  const handlePrev = () => {
    if (activePhotoIndex === null) return;
    setActivePhotoIndex((prev) => (prev! - 1 + photosData.length) % photosData.length);
  };

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#161618] p-5 sm:p-6 shadow-2xl overflow-hidden flex flex-col justify-between group">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06] font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="uppercase tracking-widest text-[10px] text-ink-muted">
            DESK SNAPSHOTS // BELFAST &amp; BEYOND
          </span>
        </div>

        <button
          onClick={() => setActivePhotoIndex(0)}
          className="text-ink-muted hover:text-white transition-colors flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider cursor-pointer"
        >
          <span>EXPAND ALL</span>
          <Maximize2 className="w-3 h-3" />
        </button>
      </div>

      {/* Organic Overlapping Photo Collage Cluster */}
      <div className="relative h-64 sm:h-72 w-full flex items-center justify-center my-2">
        {collagePhotos.map((photo, i) => {
          // Positions and rotations to look like authentic desktop polaroids
          const positions = [
            { x: "-28%", y: "-12%", rot: "-6deg", z: 1 },
            { x: "-8%", y: "10%", rot: "4deg", z: 2 },
            { x: "18%", y: "-15%", rot: "-3deg", z: 3 },
            { x: "32%", y: "14%", rot: "7deg", z: 4 },
            { x: "-18%", y: "20%", rot: "-8deg", z: 5 },
            { x: "4%", y: "-8%", rot: "2deg", z: 6 },
          ];
          const pos = positions[i] || { x: "0%", y: "0%", rot: "0deg", z: 1 };

          return (
            <div
              key={photo.id}
              onClick={() => setActivePhotoIndex(i)}
              style={{
                transform: `translate(${pos.x}, ${pos.y}) rotate(${pos.rot})`,
                zIndex: pos.z,
              }}
              className="absolute w-28 sm:w-32 aspect-[4/5] rounded-lg p-1.5 bg-[#1C1C1F] border border-white/15 shadow-xl cursor-pointer hover:z-30 hover:scale-115 hover:rotate-0 transition-all duration-300 group/card select-none"
            >
              {/* Image Frame */}
              <div className="relative w-full h-[80%] rounded overflow-hidden bg-black/60">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="140px"
                  className="object-cover group-hover/card:scale-105 transition-transform duration-500"
                />
              </div>
              {/* Bottom Polaroid Caption Bar */}
              <div className="h-[20%] flex items-center justify-between px-1 font-mono text-[8px] text-ink-muted truncate">
                <span className="truncate">{photo.location?.split(",")[0] || "QUB"}</span>
                <span className="text-accent opacity-0 group-hover/card:opacity-100 transition-opacity">
                  VIEW
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Hint */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-ink-muted">
        <span>CASUAL SHOTS FROM LABS &amp; WALKS</span>
        <span className="text-accent font-semibold">{photosData.length} TOTAL</span>
      </div>

      {/* Lightbox for browsing all photos */}
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
