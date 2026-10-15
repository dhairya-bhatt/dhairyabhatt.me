/**
 * Helper script to generate SPOTIFY_REFRESH_TOKEN in 30 seconds.
 * 
 * Usage:
 *   node scripts/get-refresh-token.mjs <CLIENT_ID> <CLIENT_SECRET>
 */

import readline from "readline";

const clientId = process.argv[2]?.trim();
const clientSecret = process.argv[3]?.trim();
const redirectUri = "http://localhost:3000";
const scopes = "user-read-currently-playing user-read-recently-played";

if (!clientId || !clientSecret) {
  console.log(`
Usage:
  node scripts/get-refresh-token.mjs <CLIENT_ID> <CLIENT_SECRET>

Example:
  node scripts/get-refresh-token.mjs 1a2b3c4d5e... 9z8y7x6w5v...
`);
  process.exit(1);
}

const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
  redirectUri
)}&scope=${encodeURIComponent(scopes)}`;

console.log("\n========================================================");
console.log("  SPOTIFY REFRESH TOKEN GENERATOR");
console.log("========================================================\n");
console.log("Step 1: In your Spotify Developer App Settings, make sure");
console.log(`        Redirect URI includes: ${redirectUri}\n`);
console.log("Step 2: Open this URL in your browser to authorize:\n");
console.log(authUrl);
console.log("\nStep 3: After clicking 'Agree', your browser will redirect to a URL like:");
console.log(`        http://localhost:3000/?code=AQC...`);
console.log("========================================================\n");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Paste the entire redirect URL (or just the code): ", async (input) => {
  rl.close();

  let code = input.trim();
  if (code.includes("code=")) {
    try {
      const parsedUrl = new URL(code);
      code = parsedUrl.searchParams.get("code") || code;
    } catch {
      const match = code.match(/code=([^&]+)/);
      if (match) code = match[1];
    }
  }

  if (!code) {
    console.error("Error: No code found in input.");
    process.exit(1);
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  try {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const data = await res.json();

    if (data.error) {
      console.error("\nSpotify Error:", data.error, data.error_description || "");
      process.exit(1);
    }

    console.log("\n SUCCESS! Here are your environment variables:\n");
    console.log(`SPOTIFY_CLIENT_ID=${clientId}`);
    console.log(`SPOTIFY_CLIENT_SECRET=${clientSecret}`);
    console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
    console.log("-> Copy & paste these into your local .env.local file and into your Vercel Environment Variables!\n");
  } catch (err) {
    console.error("Failed to exchange code:", err);
  }
});
