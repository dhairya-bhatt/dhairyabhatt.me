"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/nav/Header";
import { siteConfig } from "@/content/site";
import {
  ArrowLeft,
  ArrowUpRight,
  Github,
  Linkedin,
  Code2,
  Mail,
  Instagram,
  BookOpen,
  Film,
  Music,
  MessageSquare,
  Tv,
} from "lucide-react";

function SocialPlatformIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "github":
      return <Github className="w-4 h-4" />;
    case "linkedin":
      return <Linkedin className="w-4 h-4" />;
    case "code":
      return <Code2 className="w-4 h-4" />;
    case "mail":
      return <Mail className="w-4 h-4" />;
    case "instagram":
      return <Instagram className="w-4 h-4" />;
    case "discord":
      return <MessageSquare className="w-4 h-4" />;
    case "spotify":
      return <Music className="w-4 h-4" />;
    case "letterboxd":
      return <Film className="w-4 h-4" />;
    case "goodreads":
      return <BookOpen className="w-4 h-4" />;
    case "anilist":
      return <Tv className="w-4 h-4" />;
    default:
      return <ArrowUpRight className="w-4 h-4" />;
  }
}

export default function ConnectPage() {
  const primarySocials = siteConfig.socials.filter((s) => s.isPrimary);
  const secondarySocials = siteConfig.socials.filter((s) => !s.isPrimary);

  return (
    <div className="relative min-h-screen bg-canvas text-ink-primary">
      <Header />

      <main className="max-w-5xl mx-auto px-6 md:px-12 lg:px-16 pt-32 pb-24">
        {/* Navigation Back */}
        <div className="mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-funnel text-xs text-ink-muted hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-white/70" />
            <span>back to home</span>
          </Link>
        </div>

        {/* Page Title in Century Font */}
        <div className="space-y-3 mb-14">
          <h1 className="font-century text-4xl sm:text-5xl md:text-6xl text-white tracking-tight lowercase">
            connect
          </h1>
          <p className="font-funnel text-sm sm:text-base text-ink-muted max-w-2xl font-light">
            Open for technical discussions, collaborative engineering, or talking maths, films, books, music, and anime. Reach out directly at{" "}
            <a
              href="mailto:dhairyabhatt.work@gmail.com"
              className="text-white hover:underline underline-offset-4 font-normal"
            >
              dhairyabhatt.work@gmail.com
            </a>
            .
          </p>
        </div>

        {/* Channels Section */}
        <div className="space-y-12">
          {/* Section 01: Engineering & Direct Channels */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
                01 / Engineering &amp; Direct
              </span>
              <span className="font-mono text-[10px] text-ink-muted/60">
                WORK &amp; CODE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {primarySocials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.name === "Email" ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="p-5 rounded-xl border border-white/[0.08] bg-[#161618] hover:border-white/30 hover:bg-[#1B1B1E] transition-all duration-300 group flex items-start justify-between"
                >
                  <div className="min-w-0 pr-3">
                    <span className="font-mono text-[10px] text-ink-muted uppercase block mb-1">
                      {social.label}
                    </span>
                    <h3 className="font-century text-xl text-white group-hover:text-white transition-colors">
                      {social.name}
                    </h3>
                    <span className="font-mono text-xs text-ink-secondary mt-1 block truncate">
                      {social.username}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.04] text-ink-muted group-hover:text-white group-hover:bg-white/10 transition-colors shrink-0">
                    <SocialPlatformIcon icon={social.icon} />
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Section 02: Socials, Media & Cultural Corner */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
              <span className="font-mono text-[11px] uppercase tracking-widest text-ink-muted">
                02 / Socials &amp; Pursuits
              </span>
              <span className="font-mono text-[10px] text-ink-muted/60">
                CULTURE &amp; LOGS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {secondarySocials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-xl border border-white/[0.08] bg-[#161618] hover:border-white/30 hover:bg-[#1B1B1E] transition-all duration-300 group flex items-start justify-between"
                >
                  <div className="min-w-0 pr-3">
                    <span className="font-mono text-[10px] text-ink-muted uppercase block mb-1">
                      {social.label}
                    </span>
                    <h3 className="font-century text-xl text-white group-hover:text-white transition-colors">
                      {social.name}
                    </h3>
                    <span className="font-mono text-xs text-ink-secondary mt-1 block truncate">
                      {social.username}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/[0.04] text-ink-muted group-hover:text-white group-hover:bg-white/10 transition-colors shrink-0">
                    <SocialPlatformIcon icon={social.icon} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
