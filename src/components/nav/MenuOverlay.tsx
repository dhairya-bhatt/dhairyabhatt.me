"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/content/site";
import { formatTimeInBelfast } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface MenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  {
    number: "01",
    label: "home",
    href: "/",
  },
  {
    number: "02",
    label: "about",
    href: "/#about",
  },
  {
    number: "03",
    label: "work",
    href: "/projects",
  },
  {
    number: "04",
    label: "contact",
    href: "/contact",
  },
];

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [belfastTime, setBelfastTime] = useState("");
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBelfastTime(formatTimeInBelfast());
    const timer = setInterval(() => {
      setBelfastTime(formatTimeInBelfast());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
            clipPath: "circle(0% at calc(100% - 3.5rem) 3.5rem)",
            opacity: 0,
          }}
          animate={{
            clipPath: "circle(150% at calc(100% - 3.5rem) 3.5rem)",
            opacity: 1,
          }}
          exit={{
            clipPath: "circle(0% at calc(100% - 3.5rem) 3.5rem)",
            opacity: 0,
          }}
          transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
          className="fixed inset-0 z-50 bg-[#0F0F11] flex flex-col justify-between px-8 sm:px-14 md:px-20 lg:px-28 py-8 md:py-12 text-ink-primary font-funnel select-none"
        >
          {/* Top Bar with Minimal Header & Close Button */}
          <div className="relative z-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6">
                <img
                  src="/logo-transparent.png"
                  alt="Dhairya Bhatt Logo"
                  className="w-full h-full object-contain opacity-80"
                />
              </div>
              <span className="text-xs uppercase tracking-wider text-ink-muted/80 font-mono">
                menu
              </span>
            </div>

            {/* Circular Close Button */}
            <button
              onClick={onClose}
              aria-label="Close navigation"
              className="w-12 h-12 rounded-full border border-white/20 bg-white/[0.04] flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-200 cursor-pointer group focus:outline-none"
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:scale-110"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links with Sleek Professional Hover Transition */}
          <div className="relative z-10 my-auto py-8">
            <nav aria-label="Main Navigation">
              <ul className="space-y-4 md:space-y-6">
                {NAV_ITEMS.map((item, idx) => {
                  const isHovered = hoveredIndex === idx;
                  const isAnyHovered = hoveredIndex !== null;
                  const isDimmed = isAnyHovered && !isHovered;

                  return (
                    <li
                      key={item.label}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`inline-flex items-baseline gap-4 md:gap-8 transition-all duration-300 transform focus:outline-none cursor-pointer active:scale-[0.97] ${
                          isHovered
                            ? "translate-x-3 text-white"
                            : isDimmed
                            ? "opacity-35 text-ink-muted"
                            : "text-ink-secondary"
                        }`}
                      >
                        <span className="font-mono text-xs md:text-sm text-ink-muted font-normal">
                          {item.number}
                        </span>

                        <span className="font-century text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none lowercase">
                          {item.label}
                        </span>

                        <ArrowUpRight
                          className={`w-6 h-6 md:w-8 md:h-8 text-white transition-all duration-300 ${
                            isHovered
                              ? "opacity-100 translate-x-1 -translate-y-1"
                              : "opacity-0 -translate-x-2 translate-y-2 pointer-events-none"
                          }`}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Bottom Info Bar */}
          <div className="relative z-10 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-ink-muted">
            <div className="flex items-center gap-6">
              <a
                href={siteConfig.cvUrl}
                download="Dhairya_Bhatt_CV.pdf"
                className="text-white hover:text-white/70 transition-colors font-mono"
              >
                [ resume.pdf ]
              </a>
              <a
                href={siteConfig.socials.find((s) => s.name === "GitHub")?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors font-mono"
              >
                github
              </a>
              <a
                href={siteConfig.socials.find((s) => s.name === "LinkedIn")?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors font-mono"
              >
                linkedin
              </a>
            </div>

            <div className="font-mono">
              Belfast, UK {belfastTime ? `· ${belfastTime}` : ""}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
