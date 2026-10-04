"use client";

import React from "react";
import Image from "next/image";
import { wantedBountyData } from "@/content/stats";
import { portraitPhoto } from "@/content/photos";

export function WantedCard() {
  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#161618] p-6 sm:p-8 max-w-md mx-auto shadow-2xl overflow-hidden group">
      {/* Straw Hat SVG Watermark / Badge */}
      <div className="absolute top-4 right-4 opacity-30 group-hover:opacity-70 transition-opacity">
        <svg
          viewBox="0 0 48 24"
          className="w-8 h-4 text-amber-500 fill-current"
          aria-hidden="true"
        >
          {/* Stylized Straw Hat */}
          <path d="M 4 20 Q 24 16 44 20 C 44 20 40 18 36 17 C 36 8 32 4 24 4 C 16 4 12 8 12 17 C 8 18 4 20 4 20 Z" />
          <path d="M 12 15 Q 24 13 36 15" stroke="#FF4632" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Header */}
      <div className="text-center border-b border-white/10 pb-4 mb-5">
        <span className="font-mono text-[10px] tracking-widest text-ink-muted uppercase block">
          SHOW EASTER EGG // ONE PIECE
        </span>
        <h4 className="font-serif text-3xl sm:text-4xl tracking-widest uppercase text-[#F5F2EB] mt-1 font-bold">
          WANTED
        </h4>
        <p className="font-mono text-[10px] tracking-widest text-accent uppercase">
          DEAD OR ALIVE
        </p>
      </div>

      {/* Portrait in Wanted Style */}
      <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-white/10 bg-black/60 mb-5">
        <Image
          src={portraitPhoto.src}
          alt="Dhairya Bhatt Wanted Portrait"
          fill
          sizes="320px"
          className="object-cover sepia-[0.35] contrast-125 group-hover:sepia-0 transition-all duration-500"
        />
      </div>

      {/* Name and Bounty Details */}
      <div className="space-y-3 text-center font-mono">
        <div>
          <span className="text-xl sm:text-2xl font-serif tracking-wider uppercase text-white block">
            {wantedBountyData.wantedFor}
          </span>
          <span className="text-xs text-ink-muted block mt-0.5">
            {wantedBountyData.alias}
          </span>
        </div>

        <div className="pt-2 border-t border-white/10">
          <span className="text-[10px] text-ink-muted uppercase tracking-wider block">
            BOUNTY REWARD:
          </span>
          <span className="text-base sm:text-lg font-bold text-accent tracking-wider block">
            ₿ {wantedBountyData.bounty}
          </span>
        </div>

        <div className="pt-2 font-mono text-[9px] text-ink-muted/60 uppercase">
          ISSUED BY: {wantedBountyData.issuedBy}
        </div>
      </div>
    </div>
  );
}
