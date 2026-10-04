"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/nav/Header";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-canvas text-ink-primary flex flex-col justify-between">
      <Header />

      <main className="max-w-2xl mx-auto px-6 py-32 text-center my-auto space-y-6">
        <span className="font-mono text-xs uppercase tracking-widest text-accent font-semibold block">
          ERROR 404 // ROUTE DOES NOT EXIST
        </span>

        {/* Better Call Saul Easter Egg Quote */}
        <h1 className="font-serif text-5xl sm:text-7xl text-white tracking-tight">
          &ldquo;S&apos;all good, man.&rdquo;
        </h1>

        <p className="font-sans text-base text-ink-muted max-w-md mx-auto leading-relaxed">
          The requested path doesn&apos;t exist on this server. Maybe it was moved, or maybe the coordinates were slightly off on the campus map.
        </p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-mono text-xs uppercase tracking-wider font-semibold hover:bg-accent hover:text-white transition-all duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO PORTFOLIO</span>
          </Link>
        </div>
      </main>

      <footer className="py-8 text-center font-mono text-xs text-ink-muted/50 border-t border-white/[0.06]">
        &ldquo;Lawyered up: no, just well-tested code.&rdquo;
      </footer>
    </div>
  );
}
