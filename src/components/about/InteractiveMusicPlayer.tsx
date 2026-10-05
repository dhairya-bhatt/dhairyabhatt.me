"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Disc3 } from "lucide-react";

interface Track {
  title: string;
  artist: string;
  album: string;
  bpm: number;
  freq: number;
}

const PLAYLIST: Track[] = [
  {
    title: "Clair de Lune",
    artist: "Claude Debussy",
    album: "Suite Bergamasque",
    bpm: 64,
    freq: 440,
  },
  {
    title: "Gymnopédie No. 1",
    artist: "Erik Satie",
    album: "Trois Gymnopédies",
    bpm: 72,
    freq: 392,
  },
  {
    title: "Resonance (Quant Mix)",
    artist: "HOME",
    album: "Odyssey",
    bpm: 105,
    freq: 523.25,
  },
];

export function InteractiveMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  // Simple procedural ambient synth tone on Web Audio API
  const startAudio = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(currentTrack.freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(isMuted ? 0.0001 : 0.04, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      oscRef.current = osc;
      gainRef.current = gain;
    } catch {
      // AudioContext unavailable / autoplay restricted
    }
  };

  const stopAudio = () => {
    if (gainRef.current && audioCtxRef.current) {
      try {
        gainRef.current.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.4);
        setTimeout(() => {
          if (oscRef.current) {
            oscRef.current.stop();
            oscRef.current.disconnect();
            oscRef.current = null;
          }
        }, 450);
      } catch {
        // Ignored
      }
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopAudio();
      setIsPlaying(false);
    } else {
      startAudio();
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    stopAudio();
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setProgress(0);
    if (isPlaying) {
      setTimeout(startAudio, 200);
    }
  };

  const prevTrack = () => {
    stopAudio();
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setProgress(0);
    if (isPlaying) {
      setTimeout(startAudio, 200);
    }
  };

  // Progress simulation ticker
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            nextTrack();
            return 0;
          }
          return prev + 0.8;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  return (
    <div className="relative rounded-2xl border border-white/10 bg-[#161618] p-5 sm:p-6 shadow-2xl flex flex-col justify-between overflow-hidden group">
      {/* Subtle Turntable Texture */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-white/[0.03] to-transparent rounded-full pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06] font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-emerald-500 animate-pulse" : "bg-neutral-600"}`} />
          <span className="uppercase tracking-widest text-[10px] text-ink-muted">
            {isPlaying ? "STUDY RIG // PLAYING" : "STUDY RIG // STANDBY"}
          </span>
        </div>

        <button
          onClick={() => setIsMuted((prev) => !prev)}
          className="text-ink-muted hover:text-white transition-colors p-1"
          aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Vinyl & Tonearm Visual */}
      <div className="flex items-center gap-6 my-2">
        {/* Spinning Vinyl Record */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
          <div
            className={`w-full h-full rounded-full bg-[#0C0C0E] border-2 border-[#242428] shadow-2xl flex items-center justify-center relative ${
              isPlaying ? "animate-spin" : ""
            }`}
            style={{ animationDuration: "5s" }}
          >
            {/* Grooves */}
            <div className="absolute inset-2 rounded-full border border-white/[0.04]" />
            <div className="absolute inset-4 rounded-full border border-white/[0.04]" />
            <div className="absolute inset-6 rounded-full border border-white/[0.06]" />

            {/* Vinyl Center Label */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-accent flex items-center justify-center shadow-inner">
              <Disc3 className="w-5 h-5 text-black" />
            </div>
            {/* Spindle hole */}
            <div className="w-2 h-2 rounded-full bg-black absolute" />
          </div>

          {/* Tonearm */}
          <div
            className="absolute -top-1 -right-2 w-8 h-14 origin-top-right transition-transform duration-700 pointer-events-none"
            style={{
              transform: isPlaying ? "rotate(26deg)" : "rotate(0deg)",
            }}
          >
            <div className="w-1 h-12 bg-neutral-400 rounded shadow-md ml-auto" />
            <div className="w-3 h-2 bg-neutral-200 rounded-sm -ml-1" />
          </div>
        </div>

        {/* Track Metadata */}
        <div className="flex-1 min-w-0 space-y-1">
          <span className="font-mono text-[10px] text-accent tracking-wider uppercase block">
            {currentTrack.album}
          </span>
          <h4 className="font-serif text-xl sm:text-2xl text-white tracking-tight truncate">
            {currentTrack.title}
          </h4>
          <p className="font-sans text-xs text-ink-muted truncate">
            {currentTrack.artist}
          </p>
          <div className="pt-2 font-mono text-[10px] text-ink-muted/70">
            TEMPO: {currentTrack.bpm} BPM
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="my-4">
        <div className="w-full h-1 bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={prevTrack}
            aria-label="Previous track"
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/10 text-white flex items-center justify-center transition-colors"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause music" : "Play music"}
            className="w-10 h-10 rounded-full bg-white text-black hover:bg-accent hover:text-white flex items-center justify-center transition-all duration-300 shadow-lg cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={nextTrack}
            aria-label="Next track"
            className="w-8 h-8 rounded-full bg-white/[0.05] hover:bg-white/10 text-white flex items-center justify-center transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        <span className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">
          TRACK {currentTrackIndex + 1} / {PLAYLIST.length}
        </span>
      </div>
    </div>
  );
}
