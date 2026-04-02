import type { Metadata } from 'next'
import { Cormorant, JetBrains_Mono } from 'next/font/google'
import Navbar     from '@/components/Navbar'
import SiteFooter from '@/components/SiteFooter'
import ChatWidget from '@/components/ChatWidget'
import './globals.css'

const cormorant = Cormorant({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '600', '700'],
  style:    ['normal', 'italic'],
  variable: '--font-cormorant',
  display:  'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets:  ['latin'],
  weight:   ['300', '400', '500', '700'],
  variable: '--font-jetbrains',
  display:  'swap',
})

const SITE = 'https://zachmcentire.dev'
const DESC =
  'Full-Stack & AI Engineer — agentic systems, cloud-native APIs, and the support tooling that keeps them running. 5+ years across product engineering, TAM, and AI. Salt Lake City / Remote.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE),

  title: {
    default:  'Zach McEntire — Full-Stack & AI Engineer',
    template: '%s | Zach McEntire',
  },
  description: DESC,
  keywords: [
    'Zach McEntire', 'Full-Stack Engineer', 'AI Engineer',
    'Support Engineer', 'Solutions Engineer',
    'React', 'Next.js', 'Python', 'FastAPI', 'Claude API',
    'TimescaleDB', 'Salt Lake City', 'Remote',
  ],
  authors:  [{ name: 'Zach McEntire', url: SITE }],
  creator:  'Zach McEntire',
  alternates: { canonical: SITE },

  // ── Favicon / app icons ───────────────────────────────────────────────────
  // Hunter's Mark rune — cyan on obsidian — all sizes generated from
  // public/icon.png (48×48 source). Next.js serves these at the correct
  // paths automatically.
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon.png',          sizes: '48x48',  type: 'image/png' },
    ],
    apple:   [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other:   [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },

  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         SITE,
    siteName:    'Zach McEntire',
    title:       'Zach McEntire — Full-Stack & AI Engineer',
    description: DESC,
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
    images:      ['/opengraph-image'],
  },

  robots: {
    index:     true,
    follow:    true,
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
        <ChatWidget />
      </body>
    </html>
  )
}