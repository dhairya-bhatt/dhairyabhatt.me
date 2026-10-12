"use client";

import React, { useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { GalleryPhoto } from "@/content/photos";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Grid, Image as ImageIcon } from "lucide-react";

interface PhotoLightboxProps {
  photos: GalleryPhoto[];
  currentIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  onSelectIndex?: (index: number) => void;
}

export function PhotoLightbox({
  photos,
  currentIndex,
  onClose,
  onNext,
  onPrev,
  onSelectIndex,
}: PhotoLightboxProps) {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"detail" | "grid">("detail");

  useEffect(() => {
    setMounted(true);
  }, []);

  const isOpen = currentIndex !== null;
  const currentPhoto = isOpen && currentIndex !== null ? photos[currentIndex] : null;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (viewMode === "detail") {
        if (e.key === "ArrowRight") onNext();
        if (e.key === "ArrowLeft") onPrev();
      }
    },
    [isOpen, viewMode, onClose, onNext, onPrev]
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

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && currentPhoto && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Photo Gallery Expanded View"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none"
        >
          {/* Top Bar: Title, Count, Grid/Detail Switcher, Close Button */}
          <div
            className="relative z-10 flex items-center justify-between text-ink-muted font-mono text-xs max-w-6xl mx-auto w-full border-b border-white/[0.08] pb-3 sm:pb-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <span className="text-white font-semibold tracking-wider text-xs sm:text-sm">
                SNAPSHOTS ARCHIVE
              </span>
              <span className="hidden sm:inline-block text-white/40">·</span>
              <span className="text-emerald-400 font-medium">
                {(currentIndex ?? 0) + 1} / {photos.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Grid / Single toggle */}
              <button
                onClick={() => setViewMode((prev) => (prev === "grid" ? "detail" : "grid"))}
                aria-label="Toggle grid overview"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-[11px] font-mono uppercase tracking-wider cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-black border-white font-medium"
                    : "bg-white/5 text-ink-muted hover:text-white border-white/10 hover:border-white/25"
                }`}
              >
                {viewMode === "grid" ? (
                  <>
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Single</span>
                  </>
                ) : (
                  <>
                    <Grid className="w-3.5 h-3.5" />
                    <span>All ({photos.length})</span>
                  </>
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label="Close photo gallery"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-105 cursor-pointer ml-1"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>

          {/* VIEW MODE 1: SINGLE DETAIL VIEW WITH THUMBNAIL STRIP */}
          {viewMode === "detail" ? (
            <div
              className="relative flex-1 flex flex-col items-center justify-center my-3 max-w-6xl mx-auto w-full min-h-0"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Central Main Stage */}
              <div className="relative flex-1 w-full flex items-center justify-center min-h-0">
                {/* Previous Button */}
                <button
                  onClick={onPrev}
                  aria-label="Previous photo"
                  className="absolute left-2 sm:left-4 z-20 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 hover:border-white text-white flex items-center justify-center transition-all hover:scale-110 shadow-2xl cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Active Image */}
                <motion.div
                  key={currentPhoto.id}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full h-[52vh] sm:h-[58vh] md:h-[62vh] max-h-[680px] flex items-center justify-center p-2"
                >
                  <Image
                    src={currentPhoto.src}
                    alt={currentPhoto.alt}
                    fill
                    priority
                    sizes="(max-width: 1200px) 90vw, 1000px"
                    className="object-contain rounded-xl drop-shadow-2xl"
                  />
                </motion.div>

                {/* Next Button */}
                <button
                  onClick={onNext}
                  aria-label="Next photo"
                  className="absolute right-2 sm:right-4 z-20 w-11 h-11 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 hover:border-white text-white flex items-center justify-center transition-all hover:scale-110 shadow-2xl cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Bottom Thumbnail Filmstrip */}
              <div className="w-full max-w-4xl pt-3 pb-1 overflow-x-auto flex items-center justify-center gap-2 sm:gap-2.5 scrollbar-none px-2">
                {photos.map((photo, idx) => {
                  const isSelected = idx === currentIndex;
                  return (
                    <button
                      key={photo.id}
                      onClick={() => onSelectIndex ? onSelectIndex(idx) : null}
                      aria-label={`Jump to photo ${idx + 1}`}
                      className={`relative shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        isSelected
                          ? "border-white scale-110 shadow-lg ring-2 ring-white/30"
                          : "border-white/10 opacity-50 hover:opacity-90 hover:border-white/30"
                      }`}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="60px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* VIEW MODE 2: FULL GRID OVERVIEW */
            <div
              className="relative flex-1 w-full max-w-6xl mx-auto overflow-y-auto py-4 px-2 min-h-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {photos.map((photo, idx) => {
                  const isSelected = idx === currentIndex;
                  return (
                    <button
                      key={photo.id}
                      onClick={() => {
                        if (onSelectIndex) onSelectIndex(idx);
                        setViewMode("detail");
                      }}
                      className={`group relative aspect-[4/5] rounded-xl overflow-hidden border transition-all cursor-pointer bg-[#18181A] ${
                        isSelected
                          ? "border-emerald-400 ring-2 ring-emerald-400/40 scale-102"
                          : "border-white/10 hover:border-white/40 hover:scale-103"
                      }`}
                    >
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(max-width: 640px) 45vw, 220px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                        <span className="font-mono text-[10px] text-white">
                          #{String(idx + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Bar: Instructions */}
          <div
            className="relative z-10 max-w-3xl mx-auto w-full text-center pt-2 sm:pt-3 border-t border-white/[0.06]"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="block font-mono text-[9px] sm:text-[10px] text-ink-muted uppercase tracking-widest">
              ARROW KEYS TO NAVIGATE · CLICK THUMBNAILS TO JUMP · ESC TO CLOSE
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
