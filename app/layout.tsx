import type { Metadata } from 'next'
import { Cormorant, JetBrains_Mono } from 'next/font/google'
import Navbar from '@/components/Navbar'
import SiteFooter from '@/components/SiteFooter'
import './globals.css'

// ── Display font: Cormorant ───────────────────────────────────────────────
// Fallback display serif loaded via next/font.
// Cormorant is a high-contrast, thin-stroked serif — the closest Google
// Fonts match to Bloodborne's cold, refined title lettering.
// fleshandblood.ttf (the primary display font) is loaded via @font-face
// in globals.css and takes precedence wherever it loads.
const cormorant = Cormorant({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600', '700'],
  style:    ['normal', 'italic'],
  variable: '--font-cormorant',
  display:  'swap',
})

// ── Mono font: JetBrains Mono ─────────────────────────────────────────────
// All body copy, labels, nav links, UI text, code.
// --font-jetbrains avoids collision with --font-mono utility token.
const jetbrainsMono = JetBrains_Mono({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '700'],
  variable: '--font-jetbrains',
  display:  'swap',
})

// ── Canonical base URL ───────────────────────────────────────────────────────
// metadataBase is required for Next.js to resolve relative OG image URLs
// at build time. Without it, /opengraph-image doesn't expand to a full URL
// and social crawlers see a broken image reference.
const SITE = 'https://zachmcentire.dev'

// ── Shared description ────────────────────────────────────────────────────────
const DESC =
  'Full-Stack & AI Engineer — agentic systems, cloud-native APIs, and the support tooling that keeps them running. 5+ years across product engineering, TAM, and AI. Salt Lake City / Remote.'

export const metadata: Metadata = {
  // metadataBase turns relative paths like /opengraph-image into absolute URLs
  metadataBase: new URL(SITE),

  title: {
    default:  'Zach McEntire — Full-Stack & AI Engineer',
    template: '%s | Zach McEntire',
  },
  description: DESC,
  keywords: [
    'Zach McEntire',
    'Full-Stack Engineer',
    'AI Engineer',
    'Support Engineer',
    'Solutions Engineer',
    'React',
    'Next.js',
    'Python',
    'FastAPI',
    'Claude API',
    'TimescaleDB',
    'Salt Lake City',
    'Remote',
  ],
  authors:  [{ name: 'Zach McEntire', url: SITE }],
  creator:  'Zach McEntire',

  // Canonical URL — prevents duplicate-content issues if the site is
  // ever served from multiple domains or www/non-www variants.
  alternates: { canonical: SITE },

  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         SITE,
    siteName:    'Zach McEntire',
    title:       'Zach McEntire — Full-Stack & AI Engineer',
    description: DESC,
    // /opengraph-image resolves to the app/opengraph-image.tsx ImageResponse route.
    // metadataBase above expands this to https://zachmcentire.dev/opengraph-image
    images: [{
      url:    '/opengraph-image',
      width:  1200,
      height: 630,
      alt:    'Zach McEntire — Full-Stack & AI Engineer',
    }],
  },

  twitter: {
    card:        'summary_large_image',
    title:       'Zach McEntire — Full-Stack & AI Engineer',
    description: DESC,
    // Twitter also picks up the OG image automatically, but being
    // explicit prevents edge cases with some crawlers.
    images:      ['/opengraph-image'],
  },

  robots: {
    index:             true,
    follow:            true,
    googleBot: {
      index:               true,
      follow:              true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jetbrainsMono.variable}`}>
      <body>
        <Navbar />
        <main id="main-content">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}