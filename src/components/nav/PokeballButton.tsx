"use client";

import React from "react";
import { motion } from "framer-motion";

interface PokeballButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export function PokeballButton({ isOpen, onClick, className = "" }: PokeballButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={isOpen}
      className={`relative group w-12 h-12 rounded-full flex items-center justify-center focus:outline-none transition-transform duration-300 hover:scale-105 ${className}`}
    >
      {/* Subtle outer ambient aura on hover */}
      <span className="absolute inset-0 rounded-full bg-accent/20 scale-90 group-hover:scale-125 transition-transform duration-400 opacity-0 group-hover:opacity-100 blur-md pointer-events-none" />

      {isOpen ? (
        // Close 'X' Button matching the Figma Menu frame
        <motion.div
          key="close-icon"
          initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-11 h-11 rounded-full bg-[#18181B] border border-white/20 flex items-center justify-center shadow-2xl hover:border-accent hover:bg-accent/10 transition-colors"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.div>
      ) : (
        // Pokéball Icon with silky mechanical micro-split & glow
        <motion.div
          key="pokeball-icon"
          className="relative w-10 h-10 select-none cursor-pointer"
          whileHover="hover"
          initial="idle"
        >
          {/* Subtle Outer Housing */}
          <div className="w-10 h-10 rounded-full bg-[#121214] shadow-xl overflow-hidden relative border border-white/25 group-hover:border-white/50 transition-colors duration-300">
            {/* Luminous Inner Core (reveals when split opens) */}
            <div className="absolute inset-0 bg-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Top Shell (Clean White with smooth vertical release) */}
            <motion.div
              variants={{
                idle: { y: 0 },
                hover: { y: -1.5 },
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute top-0 left-0 right-0 h-[20px] bg-white border-b border-black/40 z-10"
            />

            {/* Bottom Shell (Deep Obsidian with smooth downward release) */}
            <motion.div
              variants={{
                idle: { y: 0 },
                hover: { y: 1.5 },
              }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="absolute bottom-0 left-0 right-0 h-[20px] bg-[#161618] border-t border-black/40 z-10"
            />

            {/* Central Dividing Band */}
            <div className="absolute top-[18px] left-0 right-0 h-[4px] bg-[#0A0A0C] z-20" />

            {/* Center Button Housing */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[18px] h-[18px] rounded-full bg-[#0A0A0C] flex items-center justify-center border border-black z-30 shadow-md">
              {/* Center Ring with Precision Accent Glow */}
              <motion.div
                variants={{
                  idle: { scale: 1 },
                  hover: { scale: 1.15 },
                }}
                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                className="w-2.5 h-2.5 rounded-full bg-white transition-all duration-300 group-hover:bg-accent group-hover:shadow-[0_0_10px_rgba(255,70,50,0.9)]"
              />
            </div>
          </div>
        </motion.div>
      )}
    </button>
  );
}
