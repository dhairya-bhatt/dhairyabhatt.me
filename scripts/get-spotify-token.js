// scripts/get-spotify-token.js
// Run with: node scripts/get-spotify-token.js <CLIENT_ID> <CLIENT_SECRET> [REDIRECT_URI]

const http = require("http");
const url = require("url");
const readline = require("readline");

const clientId = process.argv[2];
const clientSecret = process.argv[3];
const customRedirect = process.argv[4];

if (!clientId || !clientSecret) {
  console.log("\n❌ Please provide your Client ID and Client Secret:");
  console.log("   node scripts/get-spotify-token.js <CLIENT_ID> <CLIENT_SECRET> [OPTIONAL_REDIRECT_URI]\n");
  process.exit(1);
}

const REDIRECT_URI = customRedirect || "http://127.0.0.1:8888/callback";
const SCOPES = "user-read-currently-playing user-read-recently-played user-read-playback-state";

const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
  SCOPES
)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;

async function exchangeCode(code) {
  try {
    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code.trim(),
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await tokenResponse.json();

    if (data.refresh_token) {
      console.log("\n=================================================");
      console.log("🎉 SUCCESS! HERE IS YOUR REFRESH TOKEN:\n");
      console.log(data.refresh_token);
      console.log("\n=================================================\n");
      console.log("Add this to your .env.local file:");
      console.log(`SPOTIFY_CLIENT_ID=${clientId}`);
      console.log(`SPOTIFY_CLIENT_SECRET=${clientSecret}`);
      console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
      console.log("\n=================================================\n");
      return true;
    } else {
      console.error("\n❌ Failed to retrieve refresh token:", data);
      return false;
    }
  } catch (err) {
    console.error("\n❌ Token exchange failed:", err);
    return false;
  }
}

// If using custom redirect URL like https://dhairyabhatt.me/callback
if (customRedirect && !customRedirect.includes("localhost") && !customRedirect.includes("127.0.0.1")) {
  console.log("\n=================================================");
  console.log("🎧 SPOTIFY TOKEN GENERATOR (CUSTOM REDIRECT)");
  console.log("=================================================");
  console.log(`\nUsing Redirect URI: ${REDIRECT_URI}`);
  console.log("\n1. Open this link in your browser to log in:\n");
  console.log(`👉 ${authUrl}\n`);
  console.log("2. After clicking Agree, Spotify will redirect you.");
  console.log("   Copy the code or the entire URL from your browser address bar.");
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("\nPaste the URL or authorization code here: ", async (answer) => {
    let code = answer.trim();
    if (code.includes("code=")) {
      const parsed = new URL(code.startsWith("http") ? code : `https://example.com/${code}`);
      code = parsed.searchParams.get("code") || code;
    }
    await exchangeCode(code);
    rl.close();
    process.exit(0);
  });
} else {
  // Local HTTP server mode
  const server = http.createServer(async (req, res) => {
    const reqUrl = url.parse(req.url, true);
    if (reqUrl.pathname === "/callback") {
      const code = reqUrl.query.code;

      if (!code) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end("<h1>Authentication Failed</h1><p>No authorization code received.</p>");
        server.close();
        return;
      }

      const success = await exchangeCode(code);

      if (success) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          "<body style='background:#111;color:#fff;font-family:sans-serif;text-align:center;padding:50px;'>" +
            "<h1 style='color:#1DB954;'>Token Generated Successfully!</h1>" +
            "<p>You can close this tab and check your terminal.</p>" +
            "</body>"
        );
      } else {
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end("<h1>Error generating token. Check terminal.</h1>");
      }

      server.close();
      process.exit(0);
    }
  });

  server.listen(8888, () => {
    console.log("\n=================================================");
    console.log("🎧 SPOTIFY TOKEN GENERATOR (LOCAL)");
    console.log("=================================================");
    console.log(`\nRedirect URI: ${REDIRECT_URI}`);
    console.log("\nOpen this link in your browser to authorize your account:\n");
    console.log(`👉 ${authUrl}\n`);
    console.log("Waiting for you to log in in your browser...\n");
  });
}
