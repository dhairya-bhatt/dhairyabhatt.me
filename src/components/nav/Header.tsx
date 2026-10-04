"use client";

import React, { useState } from "react";
import { PokeballButton } from "./PokeballButton";
import { MenuOverlay } from "./MenuOverlay";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-6 py-6 md:px-12 md:py-8 flex items-center justify-end pointer-events-none">
        {/* Right: Interactive Pokéball Menu Button matching Figma */}
        <div className="pointer-events-auto">
          <PokeballButton
            isOpen={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          />
        </div>
      </header>

      {/* Full-Screen Overlay Navigation */}
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
