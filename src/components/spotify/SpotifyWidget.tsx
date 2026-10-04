"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ExternalLink, Music2, ChevronDown, ChevronUp } from "lucide-react";

interface SpotifyTrack {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  isFallback?: boolean;
}

export function SpotifyWidget() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch("/api/now-playing");
        if (res.ok) {
          const data = await res.json();
          setTrack(data);
        }
      } catch (err) {
        console.error("Failed to fetch Spotify track:", err);
      }
    };

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 20000); // Poll every 20s
    return () => clearInterval(interval);
  }, []);

  if (!track || !track.title) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-[320px] w-full hidden sm:block">
      <div className="rounded-2xl border border-white/10 bg-[#141416]/95 backdrop-blur-xl p-3.5 shadow-2xl transition-all duration-300 hover:border-white/20">
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06] font-mono text-[10px]">
          <div className="flex items-center gap-1.5">
            {/* Animated Equalizer Bars */}
            <div className="flex items-end gap-[2px] h-3 w-3">
              <span className={`w-[2.5px] rounded-full bg-[#1DB954] ${track.isPlaying ? "animate-equalizer-1" : "h-1"}`} />
              <span className={`w-[2.5px] rounded-full bg-[#1DB954] ${track.isPlaying ? "animate-equalizer-2" : "h-2"}`} />
              <span className={`w-[2.5px] rounded-full bg-[#1DB954] ${track.isPlaying ? "animate-equalizer-3" : "h-1"}`} />
            </div>

            <span className="uppercase tracking-wider font-medium text-ink-muted">
              {track.isPlaying ? "NOW PLAYING" : "LAST SEEN LISTENING TO"}
            </span>
          </div>

          <button
            onClick={() => setIsMinimized((prev) => !prev)}
            aria-label={isMinimized ? "Expand Spotify widget" : "Minimize Spotify widget"}
            className="text-ink-muted hover:text-white transition-colors"
          >
            {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Track Content */}
        {!isMinimized && (
          <div className="flex items-center gap-3">
            {/* Album Artwork */}
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-black/60 shrink-0 border border-white/10">
              {track.albumImageUrl ? (
                <Image
                  src={track.albumImageUrl}
                  alt={track.album || "Spotify Album Artwork"}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ink-muted">
                  <Music2 className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0 pr-1">
              <a
                href={track.songUrl || "https://open.spotify.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs font-medium text-white hover:text-[#1DB954] transition-colors truncate block group"
              >
                <span className="truncate">{track.title}</span>
              </a>
              <p className="font-sans text-[11px] text-ink-muted truncate">
                {track.artist}
              </p>
            </div>

            {/* External Link Icon */}
            {track.songUrl && (
              <a
                href={track.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open track on Spotify"
                className="text-ink-muted hover:text-[#1DB954] transition-colors p-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
