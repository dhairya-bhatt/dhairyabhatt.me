/**
 * Helper script to generate SPOTIFY_REFRESH_TOKEN.
 * 
 * Usage:
 *   node scripts/get-refresh-token.mjs [CLIENT_ID] [CLIENT_SECRET] [REDIRECT_URI]
 */

import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log("\n========================================================");
  console.log("  SPOTIFY REFRESH TOKEN GENERATOR (dhairyabhatt.me)");
  console.log("========================================================\n");

  let clientId = process.argv[2]?.trim();
  let clientSecret = process.argv[3]?.trim();
  let redirectUri = process.argv[4]?.trim();

  if (!clientId) {
    clientId = (await ask("Enter your Spotify Client ID: ")).trim();
  }
  if (!clientSecret) {
    clientSecret = (await ask("Enter your Spotify Client Secret: ")).trim();
  }
  if (!redirectUri) {
    const inputUri = (
      await ask(
        "Enter the exact Redirect URI you added in Spotify App Settings\n(press Enter to default to 'https://dhairyabhatt.me'): "
      )
    ).trim();
    redirectUri = inputUri || "https://dhairyabhatt.me";
  }

  // Remove trailing slash if user just entered https://dhairyabhatt.me/ and Spotify has https://dhairyabhatt.me
  // We keep it as entered, but inform user
  const scopes = "user-read-currently-playing user-read-recently-played";

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes)}`;

  console.log("\n--------------------------------------------------------");
  console.log("Step 1: Open this authorization URL in your browser:\n");
  console.log(authUrl);
  console.log("\nStep 2: Log in and click 'Agree'.");
  console.log(`Step 3: Spotify will redirect to: ${redirectUri}/?code=...`);
  console.log("--------------------------------------------------------\n");

  const input = await ask("Paste the full redirected URL (or just the code): ");
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
    console.error("\n[Error] No authorization code found in input.");
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
      console.error("\n[Spotify Error]:", data.error, "-", data.error_description || "");
      console.log(`\nNote: Make sure '${redirectUri}' matches the exact Redirect URI saved in your Spotify Developer Dashboard.\n`);
      process.exit(1);
    }

    console.log("\n========================================================");
    console.log("  SUCCESS! YOUR ENVIRONMENT VARIABLES ARE READY:");
    console.log("========================================================\n");
    console.log(`SPOTIFY_CLIENT_ID=${clientId}`);
    console.log(`SPOTIFY_CLIENT_SECRET=${clientSecret}`);
    console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
    console.log("Add these 3 variables to your Vercel Project Dashboard (Settings > Environment Variables)!\n");
  } catch (err) {
    console.error("Failed to exchange authorization code:", err);
  }
}

main();
