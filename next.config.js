/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Remote image sources allowed by Next.js Image
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],

    // Prefer AVIF (smaller) then WebP over JPEG/PNG for optimised images.
    // Next.js negotiates format via Accept header — browsers that don't
    // support AVIF fall back to WebP, then to the original format.
    formats: ['image/avif', 'image/webp'],

    // Breakpoints used to generate the srcset for fill / responsive images.
    // Tuned to the portfolio's actual layout breakpoints (640, 768, 1100px)
    // so the browser receives the closest-fit image rather than one that's
    // significantly over- or under-sized.
    deviceSizes: [640, 768, 1024, 1280, 1600],

    // Fixed-width image srcset steps — used for width= prop images (headshots).
    // 220 and 260 match the exact widths used; 2× for retina.
    imageSizes: [220, 260, 440, 520, 720],

    // Minimum cache TTL for optimised images (seconds). 30 days.
    // Unsplash images don't change; the headshot changes rarely.
    minimumCacheTTL: 2592000,
  },
}

module.exports = nextConfig