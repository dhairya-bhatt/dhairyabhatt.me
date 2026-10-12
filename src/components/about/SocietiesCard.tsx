"use client";

import React from "react";
import { aboutContent } from "@/content/about";
import { Users, Compass, Code, Pi } from "lucide-react";

const SOCIETY_ICONS: Record<string, React.ReactNode> = {
  "Geography Society": <Compass className="w-3.5 h-3.5 text-emerald-400" />,
  "Computer Science Society": <Code className="w-3.5 h-3.5 text-blue-400" />,
  "Mathematics Society": <Pi className="w-3.5 h-3.5 text-amber-400" />,
};

export function SocietiesCard() {
  const societies = aboutContent.societies;

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#161618] p-4 sm:p-5 shadow-2xl overflow-hidden flex flex-col justify-between group">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/[0.06] font-mono text-xs">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-emerald-400" />
          <span className="uppercase tracking-widest text-[9px] sm:text-[10px] text-ink-muted">
            CAMPUS SOCIETIES · QUB
          </span>
        </div>
        <span className="text-white/60 font-mono text-[9px] sm:text-[10px] uppercase">
          {societies.length} AFFILIATIONS
        </span>
      </div>

      {/* Society List */}
      <div className="space-y-2.5 my-1 sm:my-1.5">
        {societies.map((soc) => (
          <div
            key={soc.name}
            className="p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15 transition-all duration-200"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 min-w-0">
                {SOCIETY_ICONS[soc.name] || <Users className="w-3.5 h-3.5 text-white/60" />}
                <h4 className="font-funnel font-medium text-xs sm:text-sm text-white truncate">
                  {soc.name}
                </h4>
              </div>
              {soc.role && (
                <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/80 shrink-0">
                  {soc.role}
                </span>
              )}
            </div>

            {soc.detail && (
              <p className="font-funnel text-[11px] sm:text-xs text-ink-secondary leading-snug font-light">
                {soc.detail}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Footer Hint */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-[10px] text-ink-muted">
        <span>ACTIVE INVOLVEMENT</span>
        <span className="text-white/80 font-medium">QUEEN&apos;S BELFAST</span>
      </div>
    </div>
  );
}
