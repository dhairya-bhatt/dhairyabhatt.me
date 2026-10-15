import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/spotify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET() {
  try {
    const data = await getNowPlaying();
    return NextResponse.json(data, {
      status: 200,
      headers: NO_CACHE_HEADERS,
    });
  } catch (error) {
    console.error("GET /api/now-playing error:", error);
    return NextResponse.json(
      {
        isPlaying: false,
        title: "Not Playing",
        artist: "Spotify",
        album: "Offline",
        albumImageUrl: "",
        songUrl: "https://open.spotify.com",
        progressMs: 0,
        durationMs: 0,
        isFallback: true,
      },
      {
        status: 200,
        headers: NO_CACHE_HEADERS,
      }
    );
  }
}
