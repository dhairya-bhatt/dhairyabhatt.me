import { NextResponse } from "next/server";
import { getNowPlaying } from "@/lib/spotify";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getNowPlaying();
    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/now-playing failed:", error);
    return NextResponse.json(
      {
        isPlaying: false,
        title: "Clair de Lune",
        artist: "Claude Debussy",
        album: "Suite Bergamasque",
        albumImageUrl: "/photos/pictures (1).png",
        songUrl: "https://open.spotify.com",
        isFallback: true,
      },
      { status: 200 }
    );
  }
}
