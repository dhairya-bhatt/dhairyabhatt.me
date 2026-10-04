const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

async function getAccessToken() {
  if (!refresh_token || !client_id || !client_secret) {
    return null;
  }

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

    return response.json();
  } catch (error) {
    console.error("Error fetching Spotify access token:", error);
    return null;
  }
}

export async function getNowPlaying() {
  const tokenData = await getAccessToken();

  if (!tokenData || !tokenData.access_token) {
    // Graceful fallback when Spotify credentials aren't set in local env
    return {
      isPlaying: false,
      title: "Clair de Lune",
      artist: "Claude Debussy",
      album: "Suite Bergamasque",
      albumImageUrl: "/photos/pictures (1).jpeg",
      songUrl: "https://open.spotify.com",
      isFallback: true,
    };
  }

  try {
    // 1. Try currently playing
    const response = await fetch(NOW_PLAYING_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
      cache: "no-store",
    });

    if (response.status === 204 || response.status > 400) {
      // 2. Fall back to recently played ("Last seen listening to...")
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
            artist: lastTrack.artists.map((_artist: { name: string }) => _artist.name).join(", "),
            album: lastTrack.album.name,
            albumImageUrl: lastTrack.album.images[0]?.url,
            songUrl: lastTrack.external_urls.spotify,
          };
        }
      }

      return { isPlaying: false };
    }

    const song = await response.json();

    if (!song.item) {
      return { isPlaying: false };
    }

    return {
      isPlaying: song.is_playing,
      title: song.item.name,
      artist: song.item.artists.map((_artist: { name: string }) => _artist.name).join(", "),
      album: song.item.album.name,
      albumImageUrl: song.item.album.images[0]?.url,
      songUrl: song.item.external_urls.spotify,
      progressMs: song.progress_ms,
      durationMs: song.item.duration_ms,
    };
  } catch (error) {
    console.error("Error querying Spotify currently playing:", error);
    return { isPlaying: false };
  }
}
