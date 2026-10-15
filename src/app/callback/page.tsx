"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Check, Copy } from "lucide-react";

function CallbackContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F11] text-[#ECE8DF] font-funnel flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-[#161618] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="space-y-1">
          <span className="font-mono text-xs uppercase tracking-wider text-[#1DB954]">
            Spotify Authorization Callback
          </span>
          <h1 className="font-century text-2xl sm:text-3xl text-white">
            {error ? "Authorization Error" : "Authorization Successful"}
          </h1>
        </div>

        {error ? (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 font-mono text-xs">
            {error}
          </div>
        ) : code ? (
          <div className="space-y-4">
            <p className="text-xs sm:text-sm text-[#88888E]">
              Copy the code below (or copy the entire URL from your browser address bar) and paste it into the script or reply:
            </p>

            <div className="relative p-3.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-white break-all max-h-36 overflow-y-auto">
              {code}
            </div>

            <button
              onClick={handleCopy}
              className="w-full py-3 rounded-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Authorization Code</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <p className="text-xs text-[#88888E] font-mono">
            Waiting for Spotify code parameter in URL (?code=...)...
          </p>
        )}
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F0F11]" />}>
      <CallbackContent />
    </Suspense>
  );
}
