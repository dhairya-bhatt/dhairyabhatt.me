"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { GalleryPhoto } from "@/content/photos";
import { motion } from "framer-motion";

interface PhotoCardProps {
  photo: GalleryPhoto;
  onClick: () => void;
  className?: string;
}

export function PhotoCard({ photo, onClick, className = "" }: PhotoCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glareX: 50, glareY: 50 });
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (photo.effect === "tilt-3d") {
      const rx = ((y - rect.height / 2) / (rect.height / 2)) * -14;
      const ry = ((x - rect.width / 2) / (rect.width / 2)) * 14;
      setTilt({
        rx,
        ry,
        glareX: (x / rect.width) * 100,
        glareY: (y / rect.height) * 100,
      });
    }

    if (photo.effect === "magnetic") {
      const mx = ((x - rect.width / 2) / rect.width) * 20;
      const my = ((y - rect.height / 2) / rect.height) * 20;
      setMagneticOffset({ x: mx, y: my });
    }
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, glareX: 50, glareY: 50 });
    setMagneticOffset({ x: 0, y: 0 });
    if (photo.effect === "polaroid-flip") {
      setIsFlipped(false);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (photo.effect === "polaroid-flip") {
      setIsFlipped((prev) => !prev);
    } else {
      onClick();
    }
  };

  // Render content based on effect
  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform:
          photo.effect === "magnetic"
            ? `translate(${magneticOffset.x}px, ${magneticOffset.y}px) rotate(${photo.rotation}deg)`
            : `rotate(${photo.rotation}deg)`,
      }}
      className={`relative cursor-pointer transition-transform duration-300 group select-none ${className}`}
    >
      {/* 1. Polaroid Flip Effect */}
      {photo.effect === "polaroid-flip" ? (
        <div className="w-full h-full [perspective:1000px]">
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
            className="relative w-full h-full [transform-style:preserve-3d] shadow-xl"
          >
            {/* Front of Polaroid */}
            <div className="relative w-full h-full bg-[#18181A] p-2 pb-6 rounded-md border border-white/10 [backface-visibility:hidden]">
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded bg-black/40">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 768px) 150px, 220px"
                  className="object-cover"
                />
              </div>
              <span className="block mt-2 font-mono text-[9px] text-ink-muted text-center tracking-wider truncate">
                [TAP / HOVER TO FLIP]
              </span>
            </div>

            {/* Back of Polaroid with Caption */}
            <div className="absolute inset-0 bg-[#222225] p-4 rounded-md border border-white/20 [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-between">
              <div>
                <span className="font-mono text-[10px] text-white/70 uppercase tracking-widest block mb-2">
                  PHOTO ARCHIVE
                </span>
                {photo.caption && (
                  <p className="font-funnel italic text-sm text-ink-primary leading-snug">
                    &ldquo;{photo.caption}&rdquo;
                  </p>
                )}
              </div>
              <div className="border-t border-white/10 pt-2 flex items-center justify-between font-mono text-[9px] text-ink-muted">
                <span>{photo.location || ""}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                  }}
                  className="text-white/80 underline hover:text-white"
                >
                  EXPAND
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      ) : photo.effect === "tilt-3d" ? (
        /* 2. 3D Tilt with Specular Glare */
        <div
          style={{
            transform: `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
            transition: "transform 0.1s ease-out",
          }}
          className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black"
        >
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 150px, 220px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Specular Glare Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-40 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.7) 0%, transparent 60%)`,
            }}
          />
        </div>
      ) : photo.effect === "frosted-glass" ? (
        /* 3. Frosted Glass Blur that clears on hover */
        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-white/10 shadow-xl bg-black">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 150px, 220px"
            className="object-cover blur-[5px] group-hover:blur-0 scale-105 group-hover:scale-100 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500" />
        </div>
      ) : photo.effect === "grayscale-color" ? (
        /* 4. Greyscale to Vivid Color */
        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-white/10 shadow-xl bg-black">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 150px, 220px"
            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
          />
        </div>
      ) : photo.effect === "lift-reset" ? (
        /* 5. Lift and Enlarge with Rotation Reset */
        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-white/10 shadow-xl bg-black group-hover:scale-110 group-hover:rotate-0 transition-transform duration-500">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 150px, 220px"
            className="object-cover"
          />
        </div>
      ) : photo.effect === "rgb-glitch" ? (
        /* 6. RGB Split / Glitch */
        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-white/10 shadow-xl bg-black">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 150px, 220px"
            className="object-cover group-hover:[filter:drop-shadow(3px_0px_0px_rgba(255,70,50,0.8))_drop-shadow(-3px_0px_0px_rgba(0,180,255,0.8))] transition-all duration-300"
          />
        </div>
      ) : (
        /* Default / Duotone */
        <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden border border-white/10 shadow-xl bg-black group-hover:scale-105 transition-transform duration-500">
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 768px) 150px, 220px"
            className="object-cover sepia-[0.3] group-hover:sepia-0 transition-all duration-500"
          />
        </div>
      )}

      {/* Subtle Caption Tag on hover for non-flip cards */}
      {photo.effect !== "polaroid-flip" && photo.location && (
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-30">
          <span className="font-mono text-[10px] text-white/90 bg-black/80 px-2 py-0.5 rounded border border-white/10 shadow-lg">
            {photo.location}
          </span>
        </div>
      )}
    </div>
  );
}
