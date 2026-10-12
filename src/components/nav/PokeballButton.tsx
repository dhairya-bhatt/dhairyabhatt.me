"use client";

import React from "react";
import { motion } from "framer-motion";

interface PokeballButtonProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
  isReady?: boolean;
}

export function PokeballButton({
  isOpen,
  onClick,
  className = "",
  isReady = true,
}: PokeballButtonProps) {
  return (
    <motion.div
      initial={{
        x: 110,
        y: -110,
        rotate: -720,
        scale: 0.1,
        opacity: 0,
      }}
      animate={
        isReady
          ? {
              x: [110, -14, 6, -2, 0],
              y: [-110, 16, -6, 2, 0],
              rotate: [-720, 24, -10, 4, 0],
              scale: [0.1, 1.28, 0.95, 1.04, 1],
              opacity: [0, 1, 1, 1, 1],
            }
          : {
              x: 110,
              y: -110,
              rotate: -720,
              scale: 0.1,
              opacity: 0,
            }
      }
      transition={{
        duration: 0.85,
        ease: [0.17, 0.89, 0.32, 1.18],
      }}
      className="inline-block"
    >
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
          // Authentic Pokémon struggle wiggle animation with flashing center catch light on hover
          <motion.div
            key="pokeball-icon"
            className="relative w-11 h-11 select-none origin-bottom"
            whileHover={{
              rotate: [0, -22, 18, -14, 10, -5, 0],
              x: [0, -3, 3, -2, 2, 0],
              transition: {
                duration: 1.1,
                repeat: Infinity,
                repeatType: "loop",
                ease: "easeInOut",
              },
            }}
          >
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-md overflow-visible"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer Outer Housing Border */}
              <circle cx="50" cy="50" r="48" fill="#18181B" stroke="#2D2D32" strokeWidth="2" />

              {/* Upper Semi-Circle: Matte Deep Black */}
              <path
                d="M 5 50 A 45 45 0 0 1 95 50 Z"
                fill="#18181B"
                className="group-hover:brightness-125 transition-all duration-300"
              />

              {/* Lower Semi-Circle: Pure Crisp White */}
              <path
                d="M 5 50 A 45 45 0 0 0 95 50 Z"
                fill="#FFFFFF"
                className="group-hover:brightness-95 transition-all duration-300"
              />

              {/* Central Dividing Band */}
              <rect x="5" y="47" width="90" height="6" fill="#0E0E10" />

              {/* Center Catch Button Outer Rim */}
              <circle cx="50" cy="50" r="15" fill="#0E0E10" />

              {/* Center Catch Button Middle Ring */}
              <circle cx="50" cy="50" r="10" fill="#FFFFFF" stroke="#222225" strokeWidth="1.5" />

              {/* Center Inner Catch Light - Pulses luminous white on hover (monochrome struggle state) */}
              <circle
                cx="50"
                cy="50"
                r="5"
                fill="#FFFFFF"
                className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.95)] group-hover:animate-ping transition-colors duration-200"
              />
              <circle
                cx="50"
                cy="50"
                r="4.5"
                className="fill-white transition-colors duration-200"
              />
            </svg>
          </motion.div>
        )}
      </button>
    </motion.div>
  );
}
