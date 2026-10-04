# Dhairya Bhatt — Personal Portfolio (`dhairyabhatt.me`)

> Hand-crafted personal portfolio website for **Dhairya Bhatt** (2nd-year Mathematics & Computer Science undergraduate at Queen's University Belfast). Built for summer 2027 quantitative trading and high-bar software engineering placement recruiters.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router, Server & Client Components)
- **Language**: TypeScript (Strict mode)
- **Styling**: Tailwind CSS + Custom Design Tokens
- **Typography**: `Instrument Serif` (Display), `Inter` (Body & UI), `JetBrains Mono` (Code & Telemetry) via `next/font/google`
- **Animations**: Framer Motion, HTML5 Canvas Particle Engine, CSS Keyframes
- **Icons**: Lucide React + Hand-crafted original SVGs (Pokéball, Straw Hat, Zanpakutō)
- **Deployment**: Vercel (`dhairyabhatt.me`)

---

## 🚀 Local Development

### 1. Prerequisites
Ensure you have Node.js (>= 18.18.0) and npm installed:
```bash
node -v
npm -v
```

### 2. Installation
```bash
git clone https://github.com/dhairyabhatt/dhairyabhatt.me.git
cd dhairyabhatt.me
npm install
```

### 3. Environment Variables
Copy the template into `.env.local`:
```bash
cp .env.local.example .env.local
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm run start
```

---

## 🎵 Spotify "Now Playing" Setup Guide

The portfolio features a live Discord-activity-style widget that queries your Spotify playback every 20 seconds. If nothing is currently playing, it gracefully shows your last played track.

### Step-by-Step Instructions:

#### 1. Create a Spotify Developer App
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard) and log in.
2. Click **Create app**.
3. Fill in:
   - **App name**: `Dhairya Portfolio Now Playing`
   - **App description**: `Live Spotify widget for personal website`
   - **Redirect URIs**: `http://localhost:3000/api/callback`
4. Select **Web API** under APIs used, agree to the terms, and click **Save**.
5. Go to **Settings** and note your **Client ID** and **Client Secret**.

#### 2. Authorize the App to Generate a Refresh Token
Spotify requires an Authorization Code flow once to obtain a persistent `refresh_token`.

1. Paste this URL in your browser (replace `YOUR_CLIENT_ID`):
   ```
   https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3000/api/callback&scope=user-read-currently-playing%20user-read-recently-played
   ```
2. Log in and click **Agree**.
3. You will be redirected to `http://localhost:3000/api/callback?code=NApCCg...`.
4. Copy the long `code` query parameter from the URL address bar.

#### 3. Exchange Code for Refresh Token
Run this cURL command in your terminal (replace `YOUR_CLIENT_ID`, `YOUR_CLIENT_SECRET`, and `YOUR_CODE`):
```bash
curl -X POST -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code&code=YOUR_CODE&redirect_uri=http://localhost:3000/api/callback&client_id=YOUR_CLIENT_ID&client_secret=YOUR_CLIENT_SECRET" \
  https://accounts.spotify.com/api/token
```
In the JSON response, copy the `"refresh_token"` string.

#### 4. Add to `.env.local`
```env
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REFRESH_TOKEN=your_refresh_token
```

*(Note: If you run the site without Spotify tokens, it automatically renders a graceful demo fallback track without errors).*

---

## 🌐 Deploying to Vercel with Custom Domain (`dhairyabhatt.me`)

### 1. Deploy via Git
1. Push your repository to GitHub.
2. Import the project in [Vercel Dashboard](https://vercel.com/new).
3. In **Environment Variables**, add:
   - `SPOTIFY_CLIENT_ID`
   - `SPOTIFY_CLIENT_SECRET`
   - `SPOTIFY_REFRESH_TOKEN`
   - `NEXT_PUBLIC_SITE_URL` = `https://dhairyabhatt.me`
4. Click **Deploy**.

### 2. Configure Custom Domain `dhairyabhatt.me`
1. In your Vercel Project settings, navigate to **Domains**.
2. Add `dhairyabhatt.me` and `www.dhairyabhatt.me`.
3. In your DNS provider (e.g., Namecheap, Cloudflare, GoDaddy):
   - **Type A**: `@` &rarr; `76.76.21.21`
   - **Type CNAME**: `www` &rarr; `cname.vercel-dns.com`
4. Vercel will automatically verify DNS propagation and issue a free SSL certificate within a few minutes.

---

## 🎨 Interactive Features & Easter Eggs

- **Grain Particle Name Assembly**: Real accessible `<h1>` text rendered with thousands of tiny grain particles that scatter into a fine sand cloud when idle, and pull together cleanly into solid typography on hover/tap.
- **Pokéball Menu**: Custom SVG Pokéball that tilts on hover, opening a full-screen circular expansion overlay referencing the Figma Menu frame, with a *"Who's That Pokémon?"* dynamic reveal header.
- **Scattered Gallery**: 14 personal photos from your Queen's University Belfast journey, each featuring a distinct interaction (greyscale-to-color, frosted glass blur, 3D tilt with specular glare, magnetic pull, lift & reset, RGB split glitch, and 3D polaroid flip with caption), backed by a full keyboard-accessible lightbox.
- **Interactive Project Cards**: Spotlight cursor radial lighting, status indicators, and tech stack tags.
- **Anime & Show Details**:
  - **Bleach**: Press the Konami Code (`↑ ↑ ↓ ↓ ← → ← → B A`) to trigger the *"Bankai"* high-contrast screen inversion flash.
  - **Evangelion**: Monospace NERV MAGI System diagnostic telemetry in the footer.
  - **One Piece**: Styled *"WANTED: DHAIRYA BHATT"* poster easter egg card in `/contact`.
  - **Better Call Saul**: *"S'all good, man"* quote on the contact confirmation and 404 page, plus legal footer micro-copy.
  - **Vinland Saga**: Understated *"I have no enemies."* footnote at the end of the About section.
