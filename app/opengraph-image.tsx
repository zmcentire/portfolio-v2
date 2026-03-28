// app/opengraph-image.tsx
// Default OG image used for the home page and any page without a custom one.
// Next.js 14 automatically picks this up as the OG image for the root route.
// Served at /opengraph-image (Next.js handles the .png extension automatically).
//
// Design: obsidian background, cyan accent line, display name + tagline.
// Kept deliberately simple — text is legible at thumbnail sizes (600×315).

import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt     = 'Zach McEntire — Full-Stack & AI Engineer'
export const size    = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width:           '100%',
          height:          '100%',
          display:         'flex',
          flexDirection:   'column',
          justifyContent:  'flex-end',
          padding:         '72px 80px',
          background:      '#0d0d0f',
          fontFamily:      'Georgia, serif',
          position:        'relative',
        }}
      >
        {/* Grid texture — subtle dot pattern */}
        <div style={{
          position:   'absolute',
          inset:      0,
          backgroundImage: 'radial-gradient(circle, rgba(42,43,56,0.6) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          display: 'flex',
        }} />

        {/* Top accent bar — crimson left, cyan right */}
        <div style={{
          position:        'absolute',
          top:             0,
          left:            0,
          right:           0,
          height:          '4px',
          background:      'linear-gradient(90deg, #8b1a1a 0%, #c0392b 30%, #00e5ff 70%, #33ecff 100%)',
          display:         'flex',
        }} />

        {/* Corner brackets — top left */}
        <div style={{
          position: 'absolute', top: '40px', left: '60px',
          width: '40px', height: '40px',
          borderTop: '2px solid #00e5ff', borderLeft: '2px solid #00e5ff',
          display: 'flex',
        }} />
        {/* Corner brackets — bottom right */}
        <div style={{
          position: 'absolute', bottom: '40px', right: '60px',
          width: '40px', height: '40px',
          borderBottom: '2px solid rgba(0,229,255,0.4)', borderRight: '2px solid rgba(0,229,255,0.4)',
          display: 'flex',
        }} />

        {/* Eyebrow */}
        <div style={{
          display:       'flex',
          marginBottom:  '16px',
          fontFamily:    'monospace',
          fontSize:      '14px',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color:         '#c0392b',
        }}>
          {'// portfolio'}
        </div>

        {/* Name */}
        <div style={{
          display:       'flex',
          fontSize:      '80px',
          fontWeight:    '700',
          letterSpacing: '-0.01em',
          lineHeight:    '1',
          color:         '#e8e6df',
          marginBottom:  '20px',
        }}>
          Zach McEntire
        </div>

        {/* Tagline */}
        <div style={{
          display:       'flex',
          fontSize:      '26px',
          fontWeight:    '400',
          letterSpacing: '0.04em',
          color:         '#9a9890',
          fontFamily:    'monospace',
          marginBottom:  '40px',
        }}>
          Full-Stack &amp; AI Engineer
        </div>

        {/* Pill row */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {['React · Next.js', 'Python · FastAPI', 'Claude API', 'TimescaleDB'].map((tag) => (
            <div key={tag} style={{
              display:       'flex',
              padding:       '6px 16px',
              border:        '1px solid rgba(42,43,56,0.9)',
              borderRadius:  '2px',
              fontFamily:    'monospace',
              fontSize:      '14px',
              letterSpacing: '0.06em',
              color:         '#5a5955',
              background:    'rgba(19,20,26,0.8)',
            }}>
              {tag}
            </div>
          ))}
        </div>

        {/* Bottom-right: URL */}
        <div style={{
          position:      'absolute',
          bottom:        '48px',
          right:         '80px',
          fontFamily:    'monospace',
          fontSize:      '14px',
          letterSpacing: '0.08em',
          color:         'rgba(0,229,255,0.5)',
          display:       'flex',
        }}>
          zachmcentire.dev
        </div>
      </div>
    ),
    { ...size },
  )
}