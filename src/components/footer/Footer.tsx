"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative w-full border-t border-white/[0.08] bg-[#0E0E10] pt-16 md:pt-20 pb-12 px-8 sm:px-14 md:px-20 lg:px-28 text-ink-primary font-funnel">
      <div className="max-w-5xl mx-auto">
        {/* Top CTA Row */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-6 pb-12 md:pb-16 border-b border-white/[0.08]">
          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-white font-normal lowercase tracking-tight">
              get in touch
            </h2>
            <p className="text-ink-muted text-sm sm:text-base font-light max-w-md">
              Available for Summer 2027 quantitative trading and software engineering placements.
            </p>
          </div>

          <a
            href="mailto:dhairya@dhairyabhatt.me"
            className="inline-flex items-center gap-2 text-white hover:text-accent transition-colors text-base sm:text-lg font-normal group pt-2"
          >
            <span>dhairya@dhairyabhatt.me</span>
            <ArrowUpRight className="w-4 h-4 text-ink-muted group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* 3-Column Minimal Footer Directory */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-3 gap-10 text-sm">
          {/* Column 1: Info & Availability */}
          <div className="space-y-2 text-ink-muted font-light">
            <p className="text-white font-normal">Dhairya Bhatt</p>
            <p className="text-xs text-ink-muted">Available for: Summer 2027 Placements</p>
            <p className="text-xs text-ink-muted">Based in: Belfast, Northern Ireland</p>
          </div>

          {/* Column 2: Pages */}
          <div>
            <span className="text-xs uppercase tracking-wider text-ink-muted/70 block mb-3 font-mono">
              pages
            </span>
            <ul className="space-y-2 text-ink-secondary text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  home
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-white transition-colors">
                  about
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-white transition-colors">
                  work
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Socials */}
          <div>
            <span className="text-xs uppercase tracking-wider text-ink-muted/70 block mb-3 font-mono">
              socials
            </span>
            <ul className="space-y-2 text-ink-secondary text-sm">
              <li>
                <a
                  href="https://github.com/dhairyabhatt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  <span>github</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com/in/dhairya-bhatt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  <span>linkedin</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a
                  href="https://leetcode.com/u/dhairyabhatt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1 group"
                >
                  <span>leetcode</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Subdued Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex items-center justify-between text-xs text-ink-muted/60">
          <p>&copy; {new Date().getFullYear()} Dhairya Bhatt. All rights reserved.</p>
          <p className="hidden sm:block">Belfast, UK</p>
        </div>
      </div>
    </footer>
  );
}
