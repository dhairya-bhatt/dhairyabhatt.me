"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/content/site";
import { formatTimeInBelfast } from "@/lib/utils";
import { Github, Linkedin, Code2, Mail, ArrowUpRight } from "lucide-react";

export function Footer() {
  const [belfastTime, setBelfastTime] = useState("");

  useEffect(() => {
    setBelfastTime(formatTimeInBelfast());
    const interval = setInterval(() => {
      setBelfastTime(formatTimeInBelfast());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative w-full border-t border-white/[0.08] bg-[#111113] pt-20 pb-12 px-6 md:px-16 lg:px-20 text-ink-primary">
      <div className="max-w-6xl mx-auto">
        {/* Top CTA Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-white/[0.08] items-start">
          <div className="md:col-span-7 space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-accent font-medium">
              04 / GET IN TOUCH
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white tracking-tight">
              Let&apos;s build something exceptional.
            </h2>
            <p className="font-sans text-base text-ink-muted max-w-lg font-light">
              Interested in quantitative analysis, algorithmic challenges, or full-stack software development. Open for Summer 2027 placement and internship discussions.
            </p>
          </div>

          <div className="md:col-span-5 flex flex-col md:items-end justify-between space-y-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-accent hover:text-white transition-all duration-300 shadow-xl group"
            >
              <span>SEND A MESSAGE</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <a
              href="mailto:dhairya@dhairyabhatt.me"
              className="font-mono text-xs text-ink-muted hover:text-white transition-colors"
            >
              dhairya@dhairyabhatt.me
            </a>
          </div>
        </div>

        {/* Middle Navigation & Socials */}
        <div className="py-10 grid grid-cols-2 sm:grid-cols-4 gap-8 font-mono text-xs border-b border-white/[0.06]">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-ink-muted block mb-3">
              NAVIGATION
            </span>
            <ul className="space-y-2 text-ink-secondary">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link href="/#about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/projects" className="hover:text-white transition-colors">Projects</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-ink-muted block mb-3">
              CONNECT
            </span>
            <ul className="space-y-2 text-ink-secondary">
              <li>
                <a
                  href={siteConfig.socials.find((s) => s.name === "GitHub")?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5 text-accent" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.socials.find((s) => s.name === "LinkedIn")?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Linkedin className="w-3.5 h-3.5 text-accent" />
                  <span>LinkedIn</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.socials.find((s) => s.name === "LeetCode")?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5 text-accent" />
                  <span>LeetCode</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-ink-muted block mb-3">
              LOCAL TELEMETRY
            </span>
            <div className="space-y-1 text-ink-secondary">
              <div>Belfast, UK</div>
              <div className="text-white font-semibold">
                {belfastTime || "--:--:--"} (GMT/BST)
              </div>
              <div className="text-[10px] text-ink-muted/70 pt-1">Queen&apos;s University</div>
            </div>
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-wider text-ink-muted block mb-3">
              EASTER EGGS
            </span>
            <div className="space-y-1.5 text-ink-muted text-[11px]">
              <div>Try the Konami code:</div>
              <div className="text-[10px] font-semibold text-accent">
                ↑ ↑ ↓ ↓ ← → ← → B A
              </div>
              {/* Bleach Zanpakutō Icon */}
              <div className="flex items-center gap-1.5 pt-1 text-ink-muted/60">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M 2 22 L 12 12 M 12 12 L 16 8 M 16 8 L 22 2 M 11 13 L 13 11 M 15 9 L 14 10" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>Bleach Zanpakutō motif</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Status Row: Evangelion MAGI System + Better Call Saul Joke */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono text-[11px] text-ink-muted">
          {/* Evangelion MAGI Diagnostic */}
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-amber-500/90 font-medium tracking-wider">
              MAGI SYSTEM:
            </span>
            <span className="text-ink-muted">
              [MELCHIOR-1: PASS] [BALTHASAR-2: PASS] [CASPER-3: PASS] // SYNC: 99.8%
            </span>
          </div>

          {/* Better Call Saul Micro-Copy */}
          <div className="text-ink-muted/70">
            &ldquo;Lawyered up: no, just well-tested code.&rdquo;
          </div>

          {/* Copyright */}
          <div className="text-ink-muted/50">
            &copy; {new Date().getFullYear()} Dhairya Bhatt · dhairyabhatt.me
          </div>
        </div>
      </div>
    </footer>
  );
}
