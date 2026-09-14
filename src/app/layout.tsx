import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { HelpDot } from "./components/HelpDot";
import { KonamiEgg } from "./components/KonamiEgg";
import { TerminalOverlay } from "./components/TerminalOverlay";
import { PlainField } from "./components/plain/PlainField";
import { PlainHold } from "./components/plain/PlainHold";
import { PLAIN_OPEN_PREFIXES, HOLD_ATTR } from "./components/plain/holdState";
import { SCHEME_ATTR, SCHEME_KEY } from "./components/plain/holdScheme";
import { SITE_LOCKED } from "../siteLock";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MYTHCORP - Discover Your Potential",
  description: "Founded in Chicago - Discover Your Potential with MYTHCORP",
};

// Inline so it runs before paint: it avoids a flash of the wrong theme or the
// hidden page before the holding screen covers it. While SITE_LOCKED is true,
// stored theme choices remain untouched but cannot override plain.
const themeBootstrap = `(function(){var l=${SITE_LOCKED};var o=${JSON.stringify(PLAIN_OPEN_PREFIXES)};var d=document.documentElement;var t='plain';if(!l){try{var s=localStorage.getItem('mythcorp-theme-v2');if(s==='cyberpunk'||s==='luxury'||s==='paper'||s==='plain'){t=s;}}catch(e){}}d.dataset.theme=t;if(l||t==='plain'){var p=location.pathname.replace(/\\/+$/,'')||'/';var open=false;for(var i=0;i<o.length;i++){if(p===o[i]||p.indexOf(o[i]+'/')===0){open=true;break;}}if(l||!open){d.setAttribute('${HOLD_ATTR}','on');}var c='system';try{var q=localStorage.getItem('${SCHEME_KEY}');if(q==='light'||q==='dark'||q==='system'){c=q;}}catch(e){}var dark=c==='dark'||(c==='system'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);d.setAttribute('${SCHEME_ATTR}',dark?'dark':'light');}})();`;

// Chrome origin trial tokens, served so the html-in-canvas API is live for
// ordinary visitors rather than only for whoever has flipped
// chrome://flags/#canvas-draw-element. DecryptReveal, RetroDither and Glitch
// in canvasui/ sample the live DOM through ctx.drawElementImage and
// canvas.requestPaint, and without those they render nothing but their
// untouched children; Asciify degrades to a stale snapshot instead. The rest
// of that folder draws its own geometry and never needed this.
//
// Two things about this that will bite a future session:
//
// 1. A token is issued per origin, so mythcorp.org, i.mythcorp.org and the
//    *.workers.dev preview host each need their own unless the registration
//    was made with subdomain matching. That is why this reads a LIST, comma
//    or whitespace separated. Chrome ignores tokens that do not match the
//    page origin, so shipping all of them on every page is harmless.
// 2. Origin trial tokens EXPIRE, and they expire silently. Nothing throws,
//    nothing logs, the effects simply go inert again and look like a
//    regression in the components. If those four go quiet, check the token's
//    expiry before you go spelunking in canvasui/.
//
// NEXT_PUBLIC_* is inlined at build time, matching NEXT_PUBLIC_SITE_URL in
// sitemap.ts, so changing a token means a rebuild and redeploy, not just a
// worker var edit. With nothing configured this renders no tags at all.
const originTrialTokens = (process.env.NEXT_PUBLIC_ORIGIN_TRIAL_TOKEN ?? '')
  .split(/[\s,]+/)
  .filter(Boolean);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The font variables must live on <html>, not <body>: the theme tokens
    // that reference them (--font-display and friends) are declared on
    // <html>, and a custom property resolves where it is DECLARED. On <body>
    // they were undefined at that point, so every token computed to an
    // invalid value and the whole site silently rendered in Times.
    <html
      lang="en"
      data-theme="plain"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preload the heavy assets the boot sequence depends on so the
            crossfade into the landing has no waterfall. */}
        <link rel="preload" href="/spectre.glb" as="fetch" type="model/gltf-binary" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Inter_Bold.json" as="fetch" crossOrigin="anonymous" />
        <link rel="preload" href="/chicagoskyline.jpg" as="image" />
        {originTrialTokens.map((token) => (
          <meta key={token} httpEquiv="origin-trial" content={token} />
        ))}
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <PlainField />
          <PlainHold />
          {/* Everything the holding screen hides lives inside #page-root.
              The field, the hold chrome and the terminal stay outside it. */}
          <div id="page-root">
            {children}
            <HelpDot />
            <KonamiEgg />
          </div>
          <TerminalOverlay />
        </ThemeProvider>
      </body>
    </html>
  );
}
