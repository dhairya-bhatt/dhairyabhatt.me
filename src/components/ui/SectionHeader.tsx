"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  strokedTitle: string; // e.g. "selected", "things", "about"
  solidTitle: string;   // e.g. "work", "i do for hobbies", "me"
  tag?: string;         // e.g. "2024 — 2026", "hobbies & pursuits"
  actionHref?: string;
  actionText?: string;
  className?: string;
  isLight?: boolean;    // For light-mode scroll sections
}

export function SectionHeader({
  strokedTitle,
  solidTitle,
  tag,
  actionHref,
  actionText,
  className = "",
  isLight = false,
}: SectionHeaderProps) {
  return (
    <div className={cn("relative mb-12 md:mb-16 select-none", className)}>
      {/* Top Meta Tag Line */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-current/10 transition-colors duration-500">
        <span
          className={`font-mono text-[10px] sm:text-xs uppercase tracking-widest ${
            isLight ? "text-black/60" : "text-ink-muted"
          }`}
        >
          {tag || "ARCHIVE & PORTFOLIO"}
        </span>

        {actionHref && actionText && (
          <Link
            href={actionHref}
            className={`group inline-flex items-center gap-1.5 font-funnel text-xs sm:text-sm lowercase transition-colors py-1 ${
              isLight
                ? "text-black/70 hover:text-black"
                : "text-ink-muted hover:text-white"
            }`}
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>

      {/* Centered Layered Typography: Giant Outline Serif with Solid Text Inside Center */}
      <div className="relative flex items-center justify-center my-2 py-4">
        {/* Giant Hollow Outline (Rose Gard Font) */}
        <h2
          className="font-rosegard italic text-6xl sm:text-7xl md:text-8xl lg:text-[112px] xl:text-[124px] leading-none tracking-normal lowercase select-none pointer-events-none text-center transition-all duration-500"
          style={{
            WebkitTextStroke: isLight
              ? "1.5px rgba(18, 18, 20, 0.4)"
              : "1.5px rgba(255, 255, 255, 0.3)",
            color: "transparent",
          }}
        >
          {strokedTitle}
        </h2>

        {/* Overlaid Solid Typography Perfectly Centered Inside the Outline Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-4">
          <span
            className={`font-rosegard font-normal text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-normal lowercase text-center transition-colors duration-500 ${
              isLight ? "text-[#111113]" : "text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)]"
            }`}
          >
            {solidTitle}
          </span>
        </div>
      </div>
    </div>
  );
}
