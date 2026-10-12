"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TARGET_KEYWORD = "bankai";

export function KonamiListener() {
  const [typedBuffer, setTypedBuffer] = useState("");
  const [isBankaiActive, setIsBankaiActive] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input, textarea, or contentEditable
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Only track alphabetic keys
      if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
        setTypedBuffer((prev) => {
          const next = (prev + e.key.toLowerCase()).slice(-TARGET_KEYWORD.length);

          if (next === TARGET_KEYWORD) {
            setIsBankaiActive(true);

            // High-contrast monochromatic flash
            document.documentElement.style.transition = "filter 0.15s ease-out";
            document.documentElement.style.filter = "invert(1) contrast(150%)";

            setTimeout(() => {
              document.documentElement.style.filter = "none";
              setTimeout(() => {
                document.documentElement.style.transition = "";
              }, 300);
            }, 380);

            setTimeout(() => {
              setIsBankaiActive(false);
            }, 2500);

            return "";
          }

          return next;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <AnimatePresence>
      {isBankaiActive && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[120] pointer-events-none flex items-center justify-center bg-black/85 backdrop-blur-md"
        >
          <div className="text-center space-y-3 p-8 border border-white/20 bg-black/95 rounded-2xl shadow-2xl max-w-md">
            <span className="font-mono text-[11px] uppercase tracking-widest text-white/70 font-semibold block">
              SECRET REVEALED · BLEACH
            </span>
            <h2 className="font-century text-5xl md:text-6xl text-white tracking-widest uppercase font-normal">
              卍解 · BANKAI
            </h2>
            <p className="font-funnel italic text-sm text-ink-muted">
              &ldquo;All things in the universe, turn to ashes.&rdquo;
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
