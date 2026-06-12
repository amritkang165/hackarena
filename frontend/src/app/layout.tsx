import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";


export const metadata: Metadata = {
  title: "exHacker — AI-Powered Hackathon Strategy Engine",
  description:
    "Turn any hackathon challenge into a complete winning playbook. 10 AI agents. 10 ranked ideas. Full solution blueprint, pitch deck, and 3 pitch scripts.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=MuseoModerno:ital,wght@0,100..900;1,100..900&family=Outfit:wght@100..900&family=Press+Start+2P&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* ── Animated background layers (fixed, behind all content) ── */}
        <div className="bg-mesh"   aria-hidden="true" />
        <div className="bg-waves"  aria-hidden="true" />
        <div className="bg-grid"   aria-hidden="true" />
        <div className="bg-orb bg-orb-1" aria-hidden="true" />
        <div className="bg-orb bg-orb-2" aria-hidden="true" />
        <div className="bg-orb bg-orb-3" aria-hidden="true" />
        <div className="bg-orb bg-orb-4" aria-hidden="true" />

        {/* ── Page content (sits above background layers) ── */}
        <div className="page-content">
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
            {children}
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
