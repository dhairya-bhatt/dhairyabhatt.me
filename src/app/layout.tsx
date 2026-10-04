import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { SpotifyWidget } from "@/components/spotify/SpotifyWidget";
import { KonamiListener } from "@/components/ui/KonamiListener";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dhairya Bhatt — Portfolio",
    template: "%s | Dhairya Bhatt",
  },
  description:
    "Mathematics & Computer Science undergrad at Queen's University Belfast. Exploring quantitative trading, high-performance systems, and full-stack software engineering.",
  metadataBase: new URL("https://dhairyabhatt.me"),
  keywords: [
    "Dhairya Bhatt",
    "Queen's University Belfast",
    "Mathematics and Computer Science",
    "Quantitative Trading",
    "Software Engineering",
    "Portfolio",
    "QUB",
  ],
  authors: [{ name: "Dhairya Bhatt", url: "https://dhairyabhatt.me" }],
  creator: "Dhairya Bhatt",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Dhairya Bhatt — Mathematics & Computer Science Undergrad",
    description:
      "2nd-year Maths & CS at Queen's University Belfast. Target Summer 2027 Quantitative Trading & Tech Placements.",
    url: "https://dhairyabhatt.me",
    siteName: "Dhairya Bhatt Portfolio",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/photos/dhairya-portrait.jpg",
        width: 1200,
        height: 630,
        alt: "Dhairya Bhatt Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dhairya Bhatt — Portfolio",
    description:
      "Mathematics & Computer Science undergrad at Queen's University Belfast.",
    images: ["/photos/dhairya-portrait.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#141414",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-canvas text-ink-primary antialiased selection:bg-accent selection:text-white min-h-screen flex flex-col">
        {/* Global subtle film grain overlay */}
        <div className="film-grain-overlay" aria-hidden="true" />
        
        {/* Custom interactive pointer for desktop */}
        <CustomCursor />

        {/* Secret Konami code listener */}
        <KonamiListener />

        {/* Pinned Discord-style Spotify Now-Playing Widget */}
        <SpotifyWidget />

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
