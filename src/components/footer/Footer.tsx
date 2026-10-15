"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative w-full bg-[#121214] pt-16 sm:pt-20 md:pt-24 pb-8 px-6 sm:px-12 md:px-16 lg:px-20 text-[#ECE8DF] font-funnel overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col justify-between min-h-[420px] md:min-h-[520px]">
        {/* Top Info & Navigation Row matching screenshot */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 sm:gap-14 text-sm sm:text-base font-normal">
          {/* Left: Location, Email */}
          <div className="space-y-1.5 text-white/90 font-light">
            <p className="lowercase">based in: belfast, uk</p>
            <p className="lowercase">
              email:{" "}
              <a
                href="mailto:dhairyabhatt.work@gmail.com"
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                dhairyabhatt.work@gmail.com
              </a>
            </p>
          </div>

          {/* Right: Pages and Socials columns */}
          <div className="flex items-start gap-12 sm:gap-20 md:gap-24 font-light">
            {/* Pages Column */}
            <div>
              <span className="text-xs sm:text-sm text-[#88888E] block mb-2 lowercase">
                pages
              </span>
              <ul className="space-y-1 text-sm sm:text-base lowercase">
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
                  <Link href="/connect" className="hover:text-white transition-colors">
                    connect
                  </Link>
                </li>
              </ul>
            </div>

            {/* Socials Column */}
            <div>
              <span className="text-xs sm:text-sm text-[#88888E] block mb-2 lowercase">
                socials
              </span>
              <ul className="space-y-1 text-sm sm:text-base lowercase">
                <li>
                  <a
                    href="https://github.com/dhairya-bhatt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    github
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/in/dhairya-bhatt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    linkedin
                  </a>
                </li>
                <li>
                  <a
                    href="https://leetcode.com/u/dhairyabhatt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    leetcode
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Center: Massive Wordmark in Rose Gard */}
        <div className="my-10 md:my-14 select-none pointer-events-none">
          <h2 className="text-[14vw] sm:text-[14.5vw] md:text-[15vw] font-rosegard font-normal text-[#ECE8DF] leading-[0.8] tracking-normal w-full text-center md:text-left">
            Dhairya Bhatt
          </h2>
        </div>

        {/* Bottom Bar: Thin Divider, Logo Mark & Copyright matching screenshot */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#88888E] font-light lowercase">
          <p>&copy; {new Date().getFullYear()} dhairya bhatt. all rights reserved</p>
          <div className="w-5 h-5 opacity-40 hover:opacity-80 transition-opacity">
            <img
              src="/logo-transparent.png"
              alt="Dhairya Bhatt Logo Mark"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
