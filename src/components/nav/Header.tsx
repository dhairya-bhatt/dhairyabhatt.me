"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PokeballButton } from "./PokeballButton";
import { MenuOverlay } from "./MenuOverlay";

interface HeaderProps {
  isIntroComplete?: boolean;
}

export function Header({ isIntroComplete = true }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 px-8 sm:px-14 md:px-20 lg:px-28 flex items-center justify-between transition-all duration-500 ease-out pointer-events-none ${
          isScrolled
            ? "py-3.5 md:py-4 bg-[#111111]/75 backdrop-blur-md border-b border-white/[0.08] shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "py-7 md:py-9 bg-transparent border-b border-transparent"
        }`}
      >
        {/* Left: Understated geometric monogram logo */}
        <motion.div
          initial={{ opacity: 0, y: -25 }}
          animate={isIntroComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: -25 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto"
        >
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            aria-label="Back to top"
            className="group flex items-center gap-2.5 opacity-80 hover:opacity-100 transition-opacity duration-300"
          >
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:scale-105">
              <img
                src="/logo-transparent.png"
                alt="Dhairya Bhatt Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </a>
        </motion.div>

        {/* Right: Interactive Pokéball Menu Button Jumping in from Top-Right */}
        <div className="pointer-events-auto">
          <PokeballButton
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
            isReady={isIntroComplete}
          />
        </div>
      </header>

      {/* Full-Screen Overlay Navigation */}
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
