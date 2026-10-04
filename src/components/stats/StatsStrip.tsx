"use client";

import React from "react";
import { funStats } from "@/content/stats";
import { Code2, GitCommit, Target, Coffee, Footprints, Zap } from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  code: <Code2 className="w-4 h-4 text-accent" />,
  "git-commit": <GitCommit className="w-4 h-4 text-accent" />,
  target: <Target className="w-4 h-4 text-accent" />,
  coffee: <Coffee className="w-4 h-4 text-accent" />,
  footprints: <Footprints className="w-4 h-4 text-accent" />,
  zap: <Zap className="w-4 h-4 text-accent" />,
};

export function StatsStrip() {
  return (
    <div className="w-full py-12">
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/[0.08] font-mono text-xs text-ink-muted">
        <span className="uppercase tracking-widest text-[11px] text-ink-secondary">
          [ METRICS &amp; TELEMETRY ]
        </span>
        <span>QUANTITATIVE TRACKING</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {funStats.map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-white/[0.06] bg-[#161618] hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="font-mono text-[10px] text-ink-muted uppercase">
                {stat.label}
              </span>
              {stat.icon && ICON_MAP[stat.icon]}
            </div>

            <div>
              <div className="font-mono text-2xl sm:text-3xl text-white font-semibold tracking-tight">
                {stat.value}
                {stat.suffix && <span className="text-accent text-xl">{stat.suffix}</span>}
              </div>
              {stat.subtext && (
                <p className="font-sans text-[11px] text-ink-muted mt-1 leading-tight line-clamp-2">
                  {stat.subtext}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
