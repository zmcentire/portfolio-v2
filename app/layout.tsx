import type { Metadata } from 'next'
import { Cinzel, JetBrains_Mono } from 'next/font/google'
import Navbar from '@/components/Navbar'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Zach McEntire — Full-Stack & AI Engineer',
    template: '%s | Zach McEntire',
  },
  description:
    'Full-Stack and AI Engineer specializing in agentic systems, cloud-native APIs, and developer experience. Based in Denver, CO.',
  keywords: ['Zach McEntire', 'Full-Stack Engineer', 'AI Engineer', 'React', 'Next.js', 'Python', 'FastAPI', 'Denver'],
  authors: [{ name: 'Zach McEntire' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://zachmcentire.dev',
    siteName: 'Zach McEntire',
    title: 'Zach McEntire — Full-Stack & AI Engineer',
    description: 'Full-Stack and AI Engineer specializing in agentic systems, cloud-native APIs, and developer experience.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zach McEntire — Full-Stack & AI Engineer',
    description: 'Full-Stack and AI Engineer specializing in agentic systems, cloud-native APIs, and developer experience.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${jetbrainsMono.variable}`}>
      <body>
        <Navbar />
        <main id="main-content">{children}</main>
      </body>
    </html>
  )
}
