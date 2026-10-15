"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ExternalLink, RefreshCw, Disc3, Play, Pause, SkipForward } from "lucide-react";

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

const CLIENT_FALLBACK_TRACKS: SpotifyData[] = [
  {
    isPlaying: true,
    title: "Veridis Quo",
    artist: "Daft Punk",
    album: "Discovery",
    albumImageUrl: "/photos/pictures (1).png",
    songUrl: "https://open.spotify.com/track/2LD2gT7gwAurzdQDQtILds",
    progressMs: 42000,
    durationMs: 345000,
    isFallback: true,
  },
  {
    isPlaying: true,
    title: "Clair de Lune, L. 32: No. 3",
    artist: "Claude Debussy",
    album: "Suite bergamasque",
    albumImageUrl: "/photos/pictures (2).png",
    songUrl: "https://open.spotify.com/track/6kf7ZCJjEbjZXikivKOsvJ",
    progressMs: 68000,
    durationMs: 303000,
    isFallback: true,
  },
  {
    isPlaying: true,
    title: "Cornfield Chase",
    artist: "Hans Zimmer",
    album: "Interstellar (Original Motion Picture Soundtrack)",
    albumImageUrl: "/photos/pictures (3).png",
    songUrl: "https://open.spotify.com/track/6pWgRkpqVfxnj3WuIcJ7WP",
    progressMs: 24000,
    durationMs: 126000,
    isFallback: true,
  },
  {
    isPlaying: true,
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    albumImageUrl: "/photos/pictures (4).png",
    songUrl: "https://open.spotify.com/track/1eyzqe2QqGZUmfcPZtrIyt",
    progressMs: 51000,
    durationMs: 243000,
    isFallback: true,
  },
  {
    isPlaying: true,
    title: "Day One",
    artist: "Hans Zimmer",
    album: "Interstellar (Original Motion Picture Soundtrack)",
    albumImageUrl: "/photos/pictures (5).png",
    songUrl: "https://open.spotify.com/track/4WmB04GBqS4xPMYN9dHgBw",
    progressMs: 38000,
    durationMs: 199000,
    isFallback: true,
  },
];

function formatMs(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export function InteractiveMusicPlayer() {
  const [data, setData] = useState<SpotifyData | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trackOffset, setTrackOffset] = useState(0);
  const [userPaused, setUserPaused] = useState(false);

  const isFetchingRef = useRef(false);

  // Live Spotify synchronization fetch
  const fetchSpotify = useCallback(async (offsetOverride?: number) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setIsRefreshing(true);

    const activeOffset = offsetOverride !== undefined ? offsetOverride : trackOffset;

    try {
      const res = await fetch(`/api/now-playing?offset=${activeOffset}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (res.ok) {
        const json: SpotifyData = await res.json();
        setData(json);
        if (typeof json.progressMs === "number") {
          setCurrentProgress(json.progressMs);
        }
        return;
      }
    } catch (e) {
      console.error("Live Spotify sync check:", e);
    } finally {
      setIsRefreshing(false);
      isFetchingRef.current = false;
    }

    // Client-side rotation fallback if offline or API unreachable
    const fallback =
      CLIENT_FALLBACK_TRACKS[activeOffset % CLIENT_FALLBACK_TRACKS.length];
    setData(fallback);
    setCurrentProgress(fallback.progressMs || 30000);
  }, [trackOffset]);

  // Initial fetch and polling every 8 seconds for real-time sync with Spotify
  useEffect(() => {
    fetchSpotify(0);

    const pollInterval = setInterval(() => {
      fetchSpotify();
    }, 8000);

    // Instant re-sync when user returns to this browser tab or window gains focus
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        fetchSpotify();
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, [fetchSpotify]);

  const isPlaying = Boolean(data?.isPlaying) && !userPaused;

  // Real-time progress ticker (ticks forward every second during active playback)
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentProgress((prev) => {
        const maxDuration = data?.durationMs || 240000;
        // If track has finished, immediately trigger live fetch for next track
        if (prev + 1000 >= maxDuration) {
          const nextOffset = trackOffset + 1;
          setTrackOffset(nextOffset);
          fetchSpotify(nextOffset);
          return 0;
        }
        return prev + 1000;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, data?.durationMs, trackOffset, fetchSpotify]);

  const handleSkipNext = () => {
    const nextOffset = trackOffset + 1;
    setTrackOffset(nextOffset);
    setUserPaused(false);
    fetchSpotify(nextOffset);
  };

  const duration = data?.durationMs || 240000;
  const progressPercent = Math.min((currentProgress / duration) * 100, 100);

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#161618] p-4 sm:p-5 shadow-2xl flex flex-col justify-between overflow-hidden group">
      {/* Top Header: Equalizer + Status & Controls */}
      <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/[0.06] font-mono text-xs">
        <div className="flex items-center gap-2">
          {/* Animated 3-Bar Spotify Green Equalizer */}
          <div className="flex items-end gap-[2px] h-3 w-3">
            <span
              className={`w-[2.5px] rounded-full bg-[#1DB954] transition-all duration-300 ${
                isPlaying ? "animate-equalizer-1" : "h-1 opacity-60"
              }`}
            />
            <span
              className={`w-[2.5px] rounded-full bg-[#1DB954] transition-all duration-300 ${
                isPlaying ? "animate-equalizer-2" : "h-2 opacity-60"
              }`}
            />
            <span
              className={`w-[2.5px] rounded-full bg-[#1DB954] transition-all duration-300 ${
                isPlaying ? "animate-equalizer-3" : "h-1 opacity-60"
              }`}
            />
          </div>

          <span className="uppercase tracking-widest text-[9px] sm:text-[10px] text-[#1DB954] font-semibold">
            {isPlaying ? "NOW PLAYING" : "SPOTIFY · PAUSED"}
          </span>
        </div>

        {/* Playback & Sync Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setUserPaused((p) => !p)}
            aria-label={isPlaying ? "Pause playback" : "Resume playback"}
            className="text-ink-muted hover:text-white transition-colors p-1 cursor-pointer"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5" />
            ) : (
              <Play className="w-3.5 h-3.5 text-[#1DB954]" />
            )}
          </button>

          <button
            onClick={handleSkipNext}
            aria-label="Next track"
            className="text-ink-muted hover:text-white transition-colors p-1 cursor-pointer"
            title="Next track"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => fetchSpotify()}
            disabled={isRefreshing}
            aria-label="Sync with Spotify"
            className="text-ink-muted hover:text-white transition-colors p-1 cursor-pointer"
            title="Sync with Spotify"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                isRefreshing ? "animate-spin text-[#1DB954]" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Display: Vinyl Turntable + Exactly 3 Titles (Name, Artist, Album) */}
      <div className="flex items-center gap-3 sm:gap-4 my-1 sm:my-2">
        {/* Vinyl Style Album Cover Turntable */}
        <button
          type="button"
          onClick={() => setUserPaused((p) => !p)}
          aria-label="Toggle vinyl playback"
          className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 cursor-pointer focus:outline-none"
        >
          <div
            className={`w-full h-full rounded-full bg-[#0A0A0C] border-2 border-[#222225] shadow-2xl flex items-center justify-center relative transition-transform ${
              isPlaying ? "animate-spin" : ""
            }`}
            style={{ animationDuration: "4s" }}
          >
            {/* Vinyl Concentric Microgrooves */}
            <div className="absolute inset-1 rounded-full border border-white/[0.03]" />
            <div className="absolute inset-2.5 rounded-full border border-white/[0.03]" />
            <div className="absolute inset-4 rounded-full border border-white/[0.05]" />

            {/* Center Album Art Circular Label */}
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden border border-white/20 shadow-inner bg-black">
              {data?.albumImageUrl ? (
                <Image
                  src={data.albumImageUrl}
                  alt={data.album || "Album cover"}
                  fill
                  sizes="40px"
                  unoptimized={data.albumImageUrl.startsWith("http")}
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

          {/* Tonearm (swivels onto vinyl when playing) */}
          <div
            className="absolute -top-1 -right-2 w-7 h-12 origin-top-right transition-transform duration-700 pointer-events-none"
            style={{
              transform: isPlaying ? "rotate(24deg)" : "rotate(0deg)",
            }}
          >
            <div className="w-0.5 sm:w-1 h-10 sm:h-12 bg-neutral-400 rounded shadow-md ml-auto" />
            <div className="w-2.5 sm:w-3 h-2 bg-neutral-200 rounded-sm -ml-1" />
          </div>
        </button>

        {/* Exactly 3 Titles: Name, Artist, Album */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* 1. Track Name */}
          <a
            href={data?.songUrl || "https://open.spotify.com"}
            target="_blank"
            rel="noopener noreferrer"
            className="font-century font-bold text-base sm:text-lg text-white hover:text-[#1DB954] transition-colors truncate block group"
            title={data?.title || "Track Name"}
          >
            <span className="truncate group-hover:underline">
              {data?.title || "Veridis Quo"}
            </span>
          </a>

          {/* 2. Artist */}
          <p
            className="font-funnel text-xs sm:text-sm text-ink-secondary truncate"
            title={data?.artist || "Artist"}
          >
            {data?.artist || "Daft Punk"}
          </p>

          {/* 3. Album */}
          <p
            className="font-mono text-[10px] sm:text-[11px] text-ink-muted/80 uppercase tracking-wider truncate"
            title={data?.album || "Album"}
          >
            {data?.album || "Discovery"}
          </p>
        </div>
      </div>

      {/* Progress Bar with Elapsed / Duration Timestamps */}
      <div className="my-2.5">
        <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#1DB954] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1 font-mono text-[10px] text-ink-muted">
          <span>{formatMs(currentProgress)}</span>
          <span>{formatMs(duration)}</span>
        </div>
      </div>

      {/* Bottom Action: Direct Link to Spotify */}
      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-end">
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
