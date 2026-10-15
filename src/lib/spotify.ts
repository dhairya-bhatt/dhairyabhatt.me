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

// Curated heavy-rotation tracks used when live OAuth credentials are not yet in environment variables
// Time-synced via Date.now() so the player actively plays, ticks in real time, and rotates tracks.
export const ROTATION_TRACKS: Omit<NowPlayingTrack, "isPlaying" | "progressMs">[] = [
  {
    title: "Veridis Quo",
    artist: "Daft Punk",
    album: "Discovery",
    albumImageUrl: "/photos/pictures (1).png",
    songUrl: "https://open.spotify.com/track/2LD2gT7gwAurzdQDQtILds",
    durationMs: 345000,
  },
  {
    title: "Clair de Lune, L. 32: No. 3",
    artist: "Claude Debussy",
    album: "Suite bergamasque",
    albumImageUrl: "/photos/pictures (2).png",
    songUrl: "https://open.spotify.com/track/6kf7ZCJjEbjZXikivKOsvJ",
    durationMs: 303000,
  },
  {
    title: "Cornfield Chase",
    artist: "Hans Zimmer",
    album: "Interstellar (Original Motion Picture Soundtrack)",
    albumImageUrl: "/photos/pictures (3).png",
    songUrl: "https://open.spotify.com/track/6pWgRkpqVfxnj3WuIcJ7WP",
    durationMs: 126000,
  },
  {
    title: "Midnight City",
    artist: "M83",
    album: "Hurry Up, We're Dreaming",
    albumImageUrl: "/photos/pictures (4).png",
    songUrl: "https://open.spotify.com/track/1eyzqe2QqGZUmfcPZtrIyt",
    durationMs: 243000,
  },
  {
    title: "Day One",
    artist: "Hans Zimmer",
    album: "Interstellar (Original Motion Picture Soundtrack)",
    albumImageUrl: "/photos/pictures (5).png",
    songUrl: "https://open.spotify.com/track/4WmB04GBqS4xPMYN9dHgBw",
    durationMs: 199000,
  },
];

export function getTimeSyncedRotationTrack(trackOffset = 0): NowPlayingTrack {
  const totalPlaylistMs = ROTATION_TRACKS.reduce((sum, t) => sum + t.durationMs, 0);
  const nowCycleMs = Date.now() % totalPlaylistMs;

  let accumulated = 0;
  let selectedIndex = 0;
  let progressMs = 0;

  for (let i = 0; i < ROTATION_TRACKS.length; i++) {
    const track = ROTATION_TRACKS[i];
    if (nowCycleMs < accumulated + track.durationMs) {
      selectedIndex = i;
      progressMs = nowCycleMs - accumulated;
      break;
    }
    accumulated += track.durationMs;
  }

  const finalIndex = (selectedIndex + trackOffset) % ROTATION_TRACKS.length;
  const chosen = ROTATION_TRACKS[finalIndex];

  return {
    isPlaying: true,
    title: chosen.title,
    artist: chosen.artist,
    album: chosen.album,
    albumImageUrl: chosen.albumImageUrl,
    songUrl: chosen.songUrl,
    progressMs: trackOffset === 0 ? progressMs : 12000,
    durationMs: chosen.durationMs,
    isFallback: true,
  };
}

async function getAccessToken(): Promise<{ access_token?: string } | null> {
  const client_id = process.env.SPOTIFY_CLIENT_ID?.trim();
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN?.trim();

  // Safety check: verify variables exist and are not placeholders
  if (
    !refresh_token ||
    !client_id ||
    !client_secret ||
    client_id === "your_spotify_client_id_here"
  ) {
    return null;
  }

  // Base64 encode credentials securely for HTTP Basic Auth
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
      console.error("Spotify token refresh failed with HTTP status:", response.status);
      return null;
    }

    const data = await response.json();
    return { access_token: data.access_token };
  } catch (error) {
    console.error("Error connecting to Spotify auth service:", error);
    return null;
  }
}

export async function getNowPlaying(): Promise<NowPlayingTrack> {
  // Query official Spotify Web API if SPOTIFY_* env vars are configured
  const tokenData = await getAccessToken();

  if (!tokenData || !tokenData.access_token) {
    return getTimeSyncedRotationTrack();
  }

  try {
    // 1. Check currently playing track
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
          title: song.item.name,
          artist: song.item.artists?.map((_artist: { name: string }) => _artist.name).join(", ") || "Unknown Artist",
          album: song.item.album?.name || "Unknown Album",
          albumImageUrl: song.item.album?.images?.[0]?.url || "/photos/pictures (1).png",
          songUrl: song.item.external_urls?.spotify || "https://open.spotify.com",
          progressMs: song.progress_ms || 0,
          durationMs: song.item.duration_ms || 200000,
          isFallback: false,
        };
      }
    }

    // 2. If 204 No Content or not playing right now, fetch last played track
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
          title: lastTrack.name,
          artist: lastTrack.artists?.map((_artist: { name: string }) => _artist.name).join(", ") || "Unknown Artist",
          album: lastTrack.album?.name || "Unknown Album",
          albumImageUrl: lastTrack.album?.images?.[0]?.url || "/photos/pictures (1).png",
          songUrl: lastTrack.external_urls?.spotify || "https://open.spotify.com",
          progressMs: 0,
          durationMs: lastTrack.duration_ms || 200000,
          isFallback: false,
        };
      }
    }

    return getTimeSyncedRotationTrack();
  } catch (error) {
    console.error("Error querying Spotify live player:", error);
    return getTimeSyncedRotationTrack();
  }
}
