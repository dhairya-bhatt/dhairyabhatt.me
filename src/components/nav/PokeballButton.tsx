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
      className={`relative group w-12 h-12 rounded-full flex items-center justify-center focus:outline-none transition-transform duration-300 hover:scale-105 cursor-pointer ${className}`}
    >
      {/* Subtle outer glow on hover */}
      <span className="absolute inset-0 rounded-full bg-white/10 scale-90 group-hover:scale-125 transition-transform duration-300 opacity-0 group-hover:opacity-100 blur-sm pointer-events-none" />

      {isOpen ? (
        // Close 'X' Button
        <motion.div
          key="close-icon"
          initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-11 h-11 rounded-full bg-[#18181A] border border-white/20 flex items-center justify-center shadow-2xl hover:border-white transition-colors"
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
        // Pokéball Icon matching the Figma prototype image exactly
        // Outer white stroke, dark top hemisphere, crisp white bottom hemisphere, center button
        <motion.div
          key="pokeball-icon"
          className="relative w-11 h-11 select-none"
          whileHover={{ scale: 1.08 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer White Rim */}
            <circle cx="50" cy="50" r="46" stroke="#FFFFFF" strokeWidth="3" fill="#111111" />

            {/* Bottom White Hemisphere */}
            <path
              d="M 5 50 A 45 45 0 0 0 95 50 Z"
              fill="#FFFFFF"
            />

            {/* Top Dark Hemisphere */}
            <path
              d="M 5 50 A 45 45 0 0 1 95 50 Z"
              fill="#111111"
            />

            {/* Center Dividing Belt */}
            <line x1="4" y1="50" x2="96" y2="50" stroke="#111111" strokeWidth="5" />

            {/* Center Button Outer Dark Ring */}
            <circle cx="50" cy="50" r="14" fill="#111111" stroke="#FFFFFF" strokeWidth="2.5" />

            {/* Center Button Inner Circle */}
            <circle
              cx="50"
              cy="50"
              r="7"
              fill="#FFFFFF"
              className="group-hover:fill-accent transition-colors duration-300"
            />
          </svg>
        </motion.div>
      )}
    </button>
  );
}
