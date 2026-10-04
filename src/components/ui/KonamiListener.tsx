"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function KonamiListener() {
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [isBankaiActive, setIsBankaiActive] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      setInputSequence((prev) => {
        const next = [...prev, key].slice(-KONAMI_CODE.length);

        // Check if matches Konami code
        const isMatch = KONAMI_CODE.every(
          (val, index) => val.toLowerCase() === (next[index] || "").toLowerCase()
        );

        if (isMatch) {
          setIsBankaiActive(true);
          // Apply black/white inversion flash to body
          document.documentElement.style.filter = "invert(1) hue-rotate(180deg)";
          setTimeout(() => {
            document.documentElement.style.filter = "none";
          }, 350);

          setTimeout(() => {
            setIsBankaiActive(false);
          }, 2400);

          return [];
        }

        return next;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {isBankaiActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[120] pointer-events-none flex items-center justify-center bg-black/80 backdrop-blur-md"
        >
          <div className="text-center space-y-3 p-8 border border-white/30 bg-black/90 rounded-2xl shadow-2xl max-w-md">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block">
              EASTER EGG UNLOCKED // BLEACH
            </span>
            <h2 className="font-serif text-5xl md:text-6xl text-white tracking-widest uppercase">
              卍解 · BANKAI
            </h2>
            <p className="font-mono text-xs text-ink-muted">
              &ldquo;All things in the universe, turn to ashes.&rdquo;
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
