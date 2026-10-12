"use client";

import React from "react";
import { statsData } from "@/content/stats";

export function StatsStrip() {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between mb-8 pb-3 border-b border-white/[0.08] font-mono text-xs text-ink-muted">
        <span className="uppercase tracking-widest text-[11px] text-ink-secondary">
          [ STATS &amp; TELEMETRY ]
        </span>
        <span>AT A GLANCE</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {statsData.map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-white/[0.06] bg-[#161618] hover:border-white/20 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="font-mono text-xl sm:text-2xl text-white font-semibold tracking-tight">
                {stat.value}
              </div>
              <p className="font-funnel text-xs text-ink-secondary mt-1.5 leading-snug">
                {stat.label}
              </p>
            </div>

            {stat.note && (
              <div className="pt-3 mt-3 border-t border-white/[0.04]">
                <span className="font-mono text-[9px] text-ink-muted block uppercase">
                  {stat.note}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
