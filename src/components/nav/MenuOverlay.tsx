"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/content/site";
import { formatTimeInBelfast } from "@/lib/utils";
import { ArrowUpRight, Github, Linkedin, Code2, Mail } from "lucide-react";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  {
    number: "01",
    label: "HOME",
    href: "/",
    pokemonCallout: "HOME GROUND!",
    silhouetteName: "Pikachu",
    description: "Landing, introduction & identity",
  },
  {
    number: "02",
    label: "ABOUT ME",
    href: "/#about",
    pokemonCallout: "ABOUT ME!",
    silhouetteName: "Mewtwo",
    description: "Background, QUB studies & photo gallery",
  },
  {
    number: "03",
    label: "PROJECTS",
    href: "/projects",
    pokemonCallout: "PROJECTS!",
    silhouetteName: "Charizard",
    description: "GeoGuessr, pathfinding & quant systems",
  },
  {
    number: "04",
    label: "CONTACT",
    href: "/contact",
    pokemonCallout: "CONTACT!",
    silhouetteName: "Gengar",
    description: "Direct lines, socials & placement inquiries",
  },
];

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const [hoveredItem, setHoveredItem] = useState<typeof NAV_ITEMS[0] | null>(null);
  const [belfastTime, setBelfastTime] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  // Update live clock
  useEffect(() => {
    setBelfastTime(formatTimeInBelfast());
    const timer = setInterval(() => {
      setBelfastTime(formatTimeInBelfast());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Trap focus and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && overlayRef.current) {
        const focusableElements = overlayRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site Navigation"
          initial={{
            clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)",
            opacity: 0,
          }}
          animate={{
            clipPath: "circle(150% at calc(100% - 2.5rem) 2.5rem)",
            opacity: 1,
          }}
          exit={{
            clipPath: "circle(0% at calc(100% - 2.5rem) 2.5rem)",
            opacity: 0,
          }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-[#121212] flex flex-col justify-between overflow-y-auto px-6 py-8 md:px-16 md:py-12 text-ink-primary"
        >
          {/* Background Quarter-Circle Graphic (Referencing Figma Menu Frame) */}
          <div
            className="pointer-events-none absolute top-0 left-0 w-[280px] h-[280px] md:w-[480px] md:h-[480px] rounded-br-[100%] border-r border-b border-white/[0.08] bg-white/[0.02]"
            aria-hidden="true"
          />

          {/* Top Bar Header with 'Who's That Pokémon?' pun header and prominent Close Button */}
          <div className="relative z-20 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="font-mono text-xs tracking-wider uppercase text-accent font-semibold">
                  WHO&apos;S THAT POKÉMON?
                </span>
              </div>
              <motion.p
                key={hoveredItem ? hoveredItem.label : "default"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="font-serif italic text-lg md:text-xl text-ink-secondary"
              >
                {hoveredItem ? `It's… ${hoveredItem.pokemonCallout}` : "It's… EXPLORATION TIME!"}
              </motion.p>
            </div>

            {/* Prominent Figma-styled Close Button */}
            <button
              onClick={onClose}
              aria-label="Close navigation menu"
              className="w-12 h-12 rounded-full bg-[#1F1F23] border border-white/20 flex items-center justify-center text-white hover:bg-accent hover:border-accent transition-all duration-200 shadow-xl focus:outline-none cursor-pointer"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Center Navigation Links */}
          <div className="relative z-10 my-auto py-10 max-w-4xl">
            <nav aria-label="Main Navigation">
              <ul className="space-y-4 md:space-y-6">
                {NAV_ITEMS.map((item) => {
                  const isHovered = hoveredItem?.label === item.label;
                  return (
                    <li
                      key={item.label}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="group"
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 group focus:outline-none"
                      >
                        <span className="font-mono text-xs md:text-sm text-ink-muted group-hover:text-accent transition-colors">
                          {item.number}
                        </span>

                        <div className="flex items-center gap-4">
                          <span
                            className={`font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight transition-all duration-300 ${
                              isHovered
                                ? "text-white translate-x-3 italic"
                                : "text-ink-secondary group-hover:text-white"
                            }`}
                          >
                            {item.label}
                          </span>
                          <ArrowUpRight
                            className={`w-6 h-6 md:w-8 md:h-8 text-accent transition-all duration-300 opacity-0 -translate-x-2 ${
                              isHovered ? "opacity-100 translate-x-0" : ""
                            }`}
                          />
                        </div>

                        <span className="font-sans text-xs md:text-sm text-ink-muted/80 hidden lg:block opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.description}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Bottom Footer Info inside Menu */}
          <div className="relative z-10 pt-6 border-t border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 font-mono text-xs text-ink-muted">
            {/* Social Links */}
            <div className="flex flex-wrap items-center gap-6">
              <a
                href={siteConfig.socials.find((s) => s.name === "GitHub")?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Github className="w-3.5 h-3.5 text-accent" />
                <span>GITHUB</span>
              </a>
              <a
                href={siteConfig.socials.find((s) => s.name === "LinkedIn")?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Linkedin className="w-3.5 h-3.5 text-accent" />
                <span>LINKEDIN</span>
              </a>
              <a
                href={siteConfig.socials.find((s) => s.name === "LeetCode")?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5 text-accent" />
                <span>LEETCODE</span>
              </a>
              <a
                href={siteConfig.cvUrl}
                download
                className="text-white hover:text-accent transition-colors flex items-center gap-1.5"
              >
                <span>[ RESUME / CV.PDF ]</span>
              </a>
            </div>

            {/* Belfast Local Time & Understated Quote */}
            <div className="flex items-center gap-4">
              <span>BELFAST, UK: {belfastTime || "--:--:--"}</span>
              <span className="text-white/20">|</span>
              <span className="text-ink-muted/60 hidden sm:inline">
                &ldquo;I have no enemies.&rdquo;
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
