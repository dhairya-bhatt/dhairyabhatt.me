"use client";

import React, { useRef, useEffect } from "react";

interface MarqueeStripProps {
  text?: string;
  className?: string;
}

export function MarqueeStrip({
  text = "ABOUT ME · ABOUT ME · ABOUT ME · ABOUT ME · ",
  className = "",
}: MarqueeStripProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      if (scrollerRef.current) {
        scrollerRef.current.style.animationDuration = "12s";
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          if (scrollerRef.current) {
            scrollerRef.current.style.animationDuration = "28s";
          }
        }, 150);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div className={`w-full overflow-hidden select-none border-y border-white/[0.08] py-3 md:py-5 bg-[#141414] ${className}`}>
      <div
        ref={scrollerRef}
        className="flex whitespace-nowrap will-change-transform animate-marquee"
        style={{ animationDuration: "28s" }}
      >
        <span className="font-century text-4xl sm:text-6xl md:text-8xl tracking-tight text-white uppercase font-normal mr-6">
          {text}
        </span>
        <span className="font-century text-4xl sm:text-6xl md:text-8xl tracking-tight text-white uppercase font-normal mr-6" aria-hidden="true">
          {text}
        </span>
        <span className="font-century text-4xl sm:text-6xl md:text-8xl tracking-tight text-white uppercase font-normal mr-6" aria-hidden="true">
          {text}
        </span>
      </div>
    </div>
  );
}
