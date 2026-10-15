import { NextRequest, NextResponse } from "next/server";
import { getNowPlaying, getTimeSyncedRotationTrack } from "@/lib/spotify";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(request: NextRequest) {
  try {
    const offsetParam = request.nextUrl.searchParams.get("offset");
    const offset = offsetParam ? parseInt(offsetParam, 10) || 0 : 0;

    const data = await getNowPlaying();
    if (data.isFallback && offset > 0) {
      return NextResponse.json(getTimeSyncedRotationTrack(offset), {
        status: 200,
        headers: NO_CACHE_HEADERS,
      });
    }

    return NextResponse.json(data, {
      status: 200,
      headers: NO_CACHE_HEADERS,
    });
  } catch (error) {
    console.error("GET /api/now-playing error:", error);
    return NextResponse.json(getTimeSyncedRotationTrack(), {
      status: 200,
      headers: NO_CACHE_HEADERS,
    });
  }
}
