"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ExternalLink, RefreshCw, Disc3 } from "lucide-react";

interface SpotifyData {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  progressMs?: number;
  durationMs?: number;
  isFallback?: boolean;
}

function formatMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export function InteractiveMusicPlayer() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchSpotify = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch("/api/now-playing", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        setData(json);
        if (json.progressMs) {
          setCurrentProgress(json.progressMs);
        }
      }
    } catch (e) {
      console.error("Failed to fetch live Spotify player:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSpotify();
    // Poll Spotify API every 15 seconds
    const pollInterval = setInterval(fetchSpotify, 15000);
    return () => clearInterval(pollInterval);
  }, []);

  // Tick the progress bar every second when actively playing
  useEffect(() => {
    if (!data?.isPlaying) return;

    const timer = setInterval(() => {
      setCurrentProgress((prev) => {
        if (data.durationMs && prev >= data.durationMs) {
          fetchSpotify();
          return 0;
        }
        return prev + 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [data?.isPlaying, data?.durationMs]);

  const duration = data?.durationMs || 240000;
  const progressPercent = Math.min((currentProgress / duration) * 100, 100);
  const isPlaying = !!data?.isPlaying;

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#161618] p-4 sm:p-5 shadow-2xl flex flex-col justify-between overflow-hidden group">
      {/* Discord Spotify Rich Presence Header */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/[0.06] font-mono text-xs">
        <div className="flex items-center gap-2">
          {/* Spotify Green Dot / Equalizer */}
          <div className="flex items-end gap-[2px] h-3 w-3">
            <span className={`w-[2.5px] rounded-full bg-[#1DB954] ${isPlaying ? "animate-equalizer-1" : "h-1"}`} />
            <span className={`w-[2.5px] rounded-full bg-[#1DB954] ${isPlaying ? "animate-equalizer-2" : "h-2"}`} />
            <span className={`w-[2.5px] rounded-full bg-[#1DB954] ${isPlaying ? "animate-equalizer-3" : "h-1"}`} />
          </div>

          <span className="uppercase tracking-widest text-[9px] sm:text-[10px] text-[#1DB954] font-semibold">
            {isPlaying ? "LISTENING TO SPOTIFY" : "SPOTIFY ACTIVITY · IDLE"}
          </span>
        </div>

        <button
          onClick={fetchSpotify}
          disabled={isRefreshing}
          aria-label="Refresh Spotify status"
          className="text-ink-muted hover:text-white transition-colors p-1"
          title="Sync with Spotify"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#1DB954]" : ""}`} />
        </button>
      </div>

      {/* Main Player Display: Turntable + Track Information */}
      <div className="flex items-center gap-3 sm:gap-4 my-1 sm:my-1.5">
        {/* Turntable Vinyl Record with Live Album Art */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0">
          <div
            className={`w-full h-full rounded-full bg-[#0A0A0C] border-2 border-[#222225] shadow-2xl flex items-center justify-center relative ${
              isPlaying ? "animate-spin" : ""
            }`}
            style={{ animationDuration: "4s" }}
          >
            {/* Vinyl Grooves */}
            <div className="absolute inset-1 rounded-full border border-white/[0.03]" />
            <div className="absolute inset-2.5 rounded-full border border-white/[0.03]" />
            <div className="absolute inset-4 rounded-full border border-white/[0.05]" />

            {/* Live Album Artwork as Record Label */}
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white/20 shadow-inner bg-black">
              {data?.albumImageUrl ? (
                <Image
                  src={data.albumImageUrl}
                  alt={data.album || "Spotify album art"}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#1DB954]/20">
                  <Disc3 className="w-4 h-4 sm:w-5 sm:h-5 text-[#1DB954]" />
                </div>
              )}
            </div>
            {/* Center Spindle Hole */}
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-black border border-white/20 absolute z-10" />
          </div>

          {/* Turntable Tonearm (swivels when playing) */}
          <div
            className="absolute -top-1 -right-2 w-7 h-12 origin-top-right transition-transform duration-700 pointer-events-none"
            style={{
              transform: isPlaying ? "rotate(24deg)" : "rotate(0deg)",
            }}
          >
            <div className="w-0.5 sm:w-1 h-10 sm:h-12 bg-neutral-400 rounded shadow-md ml-auto" />
            <div className="w-2.5 sm:w-3 h-2 bg-neutral-200 rounded-sm -ml-1" />
          </div>
        </div>

        {/* Discord-style Metadata */}
        <div className="flex-1 min-w-0 space-y-0.5 sm:space-y-1">
          <span className="font-mono text-[9px] sm:text-[10px] text-ink-muted uppercase tracking-wider block truncate">
            {data?.album || "Spotify Audio"}
          </span>

          <a
            href={data?.songUrl || "https://open.spotify.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="font-century font-bold text-base sm:text-lg md:text-xl text-white hover:text-[#1DB954] transition-colors truncate block group"
          >
            <span className="truncate group-hover:underline">
              {data?.title || "Not Listening Currently"}
            </span>
          </a>

          <p className="font-funnel text-[11px] sm:text-xs text-ink-secondary truncate">
            {data?.artist || "Spotify Account"}
          </p>

          <div className="pt-1.5 flex items-center gap-2 font-mono text-[10px] text-ink-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1DB954]" />
            <span>DISCORD RICH PRESENCE</span>
          </div>
        </div>
      </div>

      {/* Live Discord-style Timestamp & Progress Bar */}
      <div className="my-3">
        <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1DB954] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5 font-mono text-[10px] text-ink-muted">
          <span>{formatMs(currentProgress)}</span>
          <span>{formatMs(duration)}</span>
        </div>
      </div>

      {/* Bottom Action Button: Open in Spotify */}
      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
        <span className="font-mono text-[10px] text-ink-muted uppercase">
          LIVE SPOTIFY FEED
        </span>

        <a
          href={data?.songUrl || "https://open.spotify.com"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1DB954]/10 hover:bg-[#1DB954] text-[#1DB954] hover:text-black font-mono text-[10px] font-semibold transition-all duration-200"
        >
          <span>LISTEN ON SPOTIFY</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
