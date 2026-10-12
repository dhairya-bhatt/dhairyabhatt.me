import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { KonamiListener } from "@/components/ui/KonamiListener";

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
    "Second-year Mathematics and Computer Science student at Queen's, Belfast. I write software and solve algorithm problems most days. I also run things: Geography Society Secretary, course rep, peer maths mentor, and organiser of a four-year school maths competition. Applying for 2027 placements.",
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
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Dhairya Bhatt — Mathematics & Computer Science Undergrad",
    description:
      "2nd-year Maths & CS at Queen's University Belfast. Exploring quantitative systems, algorithms, and full-stack software engineering.",
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
      className={jetbrainsMono.variable}
    >
      <head>
        <link rel="preload" href="/fonts/rose-gard.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/dm-serif-display.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body className="bg-canvas text-ink-primary antialiased selection:bg-white selection:text-black min-h-screen flex flex-col">
        {/* Global subtle film grain overlay */}
        <div className="film-grain-overlay" aria-hidden="true" />
        
        {/* Custom interactive pointer for desktop */}
        <CustomCursor />

        {/* Secret Konami code listener */}
        <KonamiListener />

        {/* Main Content */}
        <div className="flex-1 flex flex-col relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
