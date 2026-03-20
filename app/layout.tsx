import type { Metadata } from 'next'
import { Cormorant, JetBrains_Mono } from 'next/font/google'
import Navbar from '@/components/Navbar'
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

export const metadata: Metadata = {
  title: {
    default:  'Zach McEntire — Full-Stack & AI Engineer',
    template: '%s | Zach McEntire',
  },
  description:
    'Full-Stack and AI Engineer specializing in agentic systems, cloud-native APIs, and developer experience. Based in Denver, CO.',
  keywords: ['Zach McEntire', 'Full-Stack Engineer', 'AI Engineer', 'React', 'Next.js', 'Python', 'FastAPI', 'Denver'],
  authors: [{ name: 'Zach McEntire' }],
  openGraph: {
    type:        'website',
    locale:      'en_US',
    url:         'https://zachmcentire.dev',
    siteName:    'Zach McEntire',
    title:       'Zach McEntire — Full-Stack & AI Engineer',
    description: 'Full-Stack and AI Engineer specializing in agentic systems, cloud-native APIs, and developer experience.',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Zach McEntire — Full-Stack & AI Engineer',
    description: 'Full-Stack and AI Engineer specializing in agentic systems, cloud-native APIs, and developer experience.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jetbrainsMono.variable}`}>
      <body>
        <Navbar />
        <main id="main-content">{children}</main>
      </body>
    </html>
  )
}