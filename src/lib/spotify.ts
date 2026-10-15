const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

export interface NowPlayingTrack {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
  progressMs: number;
  durationMs: number;
  isFallback?: boolean;
}

const DEFAULT_OFFLINE_TRACK: NowPlayingTrack = {
  isPlaying: false,
  title: "Not Playing",
  artist: "Spotify",
  album: "Offline",
  albumImageUrl: "",
  songUrl: "https://open.spotify.com",
  progressMs: 0,
  durationMs: 0,
  isFallback: true,
};

async function getAccessToken(): Promise<{ access_token?: string } | null> {
  const client_id = process.env.SPOTIFY_CLIENT_ID?.trim();
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN?.trim();

  if (
    !refresh_token ||
    !client_id ||
    !client_secret ||
    client_id === "your_spotify_client_id_here"
  ) {
    return null;
  }

  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("Spotify token refresh error HTTP:", response.status);
      return null;
    }

    const data = await response.json();
    return { access_token: data.access_token };
  } catch (error) {
    console.error("Error connecting to Spotify auth:", error);
    return null;
  }
}

export async function getNowPlaying(): Promise<NowPlayingTrack> {
  const tokenData = await getAccessToken();

  if (!tokenData || !tokenData.access_token) {
    return DEFAULT_OFFLINE_TRACK;
  }

  try {
    // 1. Query live currently playing track
    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      cache: "no-store",
    });

    if (response.status === 200) {
      const song = await response.json();
      if (song?.item && song.currently_playing_type !== "ad") {
        return {
          isPlaying: Boolean(song.is_playing),
          title: song.item.name || "Unknown Track",
          artist:
            song.item.artists
              ?.map((_artist: { name: string }) => _artist.name)
              .join(", ") || "Unknown Artist",
          album: song.item.album?.name || "Single",
          albumImageUrl: song.item.album?.images?.[0]?.url || "",
          songUrl:
            song.item.external_urls?.spotify || "https://open.spotify.com",
          progressMs: song.progress_ms || 0,
          durationMs: song.item.duration_ms || 200000,
          isFallback: false,
        };
      }
    }

    // 2. If 204 No Content or paused, query recently played track
    const recentResponse = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      cache: "no-store",
    });

    if (recentResponse.ok) {
      const recentData = await recentResponse.json();
      const lastTrack = recentData.items?.[0]?.track;

      if (lastTrack) {
        return {
          isPlaying: false,
          title: lastTrack.name || "Unknown Track",
          artist:
            lastTrack.artists
              ?.map((_artist: { name: string }) => _artist.name)
              .join(", ") || "Unknown Artist",
          album: lastTrack.album?.name || "Single",
          albumImageUrl: lastTrack.album?.images?.[0]?.url || "",
          songUrl:
            lastTrack.external_urls?.spotify || "https://open.spotify.com",
          progressMs: 0,
          durationMs: lastTrack.duration_ms || 200000,
          isFallback: false,
        };
      }
    }

    return DEFAULT_OFFLINE_TRACK;
  } catch (error) {
    console.error("Error querying Spotify live player:", error);
    return DEFAULT_OFFLINE_TRACK;
  }
}
