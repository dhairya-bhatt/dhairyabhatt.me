"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { GalleryPhoto } from "@/content/photos";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, MapPin } from "lucide-react";

interface PhotoLightboxProps {
  photos: GalleryPhoto[];
  currentIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function PhotoLightbox({
  photos,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}: PhotoLightboxProps) {
  const isOpen = currentIndex !== null;
  const currentPhoto = isOpen ? photos[currentIndex] : null;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    },
    [isOpen, onClose, onNext, onPrev]
  );

  useEffect(() => {
    if (!isOpen) return;
    const origOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = origOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !currentPhoto) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Image Lightbox"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 md:p-8"
      >
        {/* Top Control Bar */}
        <div
          className="relative z-10 flex items-center justify-between text-ink-muted font-mono text-xs max-w-6xl mx-auto w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold">
              {(currentIndex ?? 0) + 1} / {photos.length}
            </span>
            <span className="text-white/20">|</span>
            {currentPhoto.location && (
              <span className="flex items-center gap-1 text-ink-secondary">
                <MapPin className="w-3 h-3 text-accent" />
                {currentPhoto.location}
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            aria-label="Close lightbox"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-accent hover:text-white flex items-center justify-center transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Center Image Display with Navigation Chevrons */}
        <div
          className="relative flex-1 flex items-center justify-center my-4 max-w-5xl mx-auto w-full"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Previous Button */}
          <button
            onClick={onPrev}
            aria-label="Previous photo"
            className="absolute left-2 md:-left-12 z-20 w-11 h-11 rounded-full bg-black/60 border border-white/20 hover:border-accent hover:text-accent flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Active Image */}
          <motion.div
            key={currentPhoto.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-[65vh] max-h-[750px] flex items-center justify-center"
          >
            <Image
              src={currentPhoto.src}
              alt={currentPhoto.alt}
              fill
              priority
              sizes="(max-width: 1200px) 90vw, 1000px"
              className="object-contain rounded-lg"
            />
          </motion.div>

          {/* Next Button */}
          <button
            onClick={onNext}
            aria-label="Next photo"
            className="absolute right-2 md:-right-12 z-20 w-11 h-11 rounded-full bg-black/60 border border-white/20 hover:border-accent hover:text-accent flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Bottom Caption Bar */}
        <div
          className="relative z-10 max-w-3xl mx-auto w-full text-center pb-2"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="font-serif italic text-base md:text-xl text-white">
            &ldquo;{currentPhoto.caption}&rdquo;
          </p>
          <span className="block mt-1 font-mono text-[10px] text-ink-muted uppercase tracking-widest">
            USE ARROW KEYS OR SWIPE TO NAVIGATE · ESC TO CLOSE
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
