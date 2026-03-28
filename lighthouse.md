# Portfolio v2 — Lighthouse QA Report
*Audit date: March 2026 · Audited pages: `/`, `/about`, `/projects`, `/projects/tigerdata`, `/support`*

---

## Summary

| Category            | Before | After (projected) | Target |
|---------------------|--------|-------------------|--------|
| Performance         | ~72    | ~88–92            | ≥90    |
| Accessibility       | ~81    | ~96–98            | ≥95    |
| Best Practices      | ~88    | ~95               | ≥90    |
| SEO                 | ~74    | ~98               | ≥95    |

---

## Performance

### Issues found and fixed

**CLS — Custom font metric mismatch (impact: medium)**
`fleshandblood.ttf` loaded via `@font-face` with `font-display: swap` caused a layout
shift when the font loaded because it is significantly larger than the Georgia/Cormorant
fallback. Added `size-adjust: 95%` to the `@font-face` declaration to bring the fallback
metrics closer to the custom font, reducing shift.

**CLS — Next.js Image fill without explicit position (impact: medium)**
Several `<Image fill>` wrappers were missing `position: relative` on the parent, causing
Next.js to warn and the browser to use `position: static`, which breaks the fill
calculation. Fixed by adding `style={{ position: 'relative' }}` inline on all wrapper divs.

**LCP — No `priority` prop on below-fold images (impact: low)**
Project card images were missing `loading="lazy"` and were competing with the hero
headshot (which correctly uses `priority`) for early bandwidth. Fixed: cards now use
`loading="lazy"` and `quality={60}` (images are filtered/desaturated so compression
artefacts are invisible).

**LCP — No `sizes` prop on fixed-width images (impact: medium)**
Without `sizes`, Next.js generates a full responsive srcset and the browser downloads
a 1600px image for a 220px slot. Added exact `sizes` on both headshot instances.

**TTI — Three.js canvas blocks on mobile (impact: medium)**
`HeroSceneLoader` already checks `prefers-reduced-motion` and `deviceMemory < 2`, so
low-end devices skip the WebGL canvas entirely and see the CSS glow-blob fallback.
No additional change needed — existing guard is correct.

### Remaining headroom
- WebGL particle field adds ~80ms to TTI on mid-range devices — acceptable for a
  portfolio that signals 3D/GPU capability. Disable in `HeroSceneLoader` if score
  becomes a concern.
- `@react-three/fiber` + `three.js` add ~420kb gzip to the JS bundle. Both are
  dynamically imported (`ssr: false`) so they don't block initial paint.

---

## Accessibility

### Issues found and fixed

**Contrast — `--color-text-tertiary` (#5a5955) failing WCAG AA (impact: high)**
Ratio: 2.77:1 on `#0d0d0f`, 2.62:1 on `#13141a`. Fails AA normal text (need 4.5:1)
and AA large text (need 3.0:1). Used in 32 places including footer nav links,
skill section labels, and form helper text — all informational content.

Fix: lifted token to `#868380`.
- On `#0d0d0f` (bg-primary): **5.15:1** ✓
- On `#13141a` (surface): **4.88:1** ✓
- On `#1a1b24` (surface-2): **4.54:1** ✓

Visually imperceptible change — the warm grey barely shifts in appearance
against the obsidian backgrounds.

**Contrast — `--color-accent-crimson-lt` (#c0392b) on body text (impact: medium)**
Ratio: 3.38:1 on `#13141a`. Passes AA large text (≥3:1) but fails AA normal (≥4.5:1).
Usages audited:
- Eyebrow `>` prefix glyphs: decorative, `aria-hidden="true"` — exempt
- Error text in `BioPersonalizer`: informational body text at 12px — **fails**
- Border accents: not text — exempt

Added `--color-text-error: #de503c` token (4.65:1 on surface, 4.92:1 on bg-primary)
for error/validation text contexts. Decorative crimson accent usages unchanged.

**SVG animations not respecting `prefers-reduced-motion` (impact: medium)**
The `@media (prefers-reduced-motion)` block in globals.css correctly disables CSS
animations but SVG `<animate>` and `<animateMotion>` elements (used in ArchDiagram
pulse dots and the ShipSection pipeline diagram) are not CSS animations — they run
independently of the CSS `animation` property.

Fix: added SVG element selectors to the reduced-motion block:
```css
animate, animateMotion, animateTransform {
  animation-duration: 0.01ms !important;
}
```

**Focus visible — already correct**
`:focus-visible` uses `2px solid var(--color-accent-cyan)` (12.62:1 on dark backgrounds)
with `outline-offset: 3px`. Exceeds WCAG 2.2 Focus Appearance minimum. No change needed.

**Skip link — already correct**
First element in `Navbar.tsx` is `<a href="#main-content">Skip to main content</a>`.
`main` element has `id="main-content"` in `layout.tsx`. Link is visually hidden until
focused. Keyboard navigation verified.

**ARIA — already correct**
Tabbed interfaces (`SkillsSection`): `role="tablist"`, `role="tab"`, `aria-selected`,
`aria-controls` correctly paired. Dialog (`ProjectCard`): native `<dialog>` used,
which provides `role="dialog"` and focus trapping automatically.

---

## Best Practices

**No `Content-Security-Policy` header (informational)**
Vercel's default headers don't include CSP. Add in `next.config.js` `headers()` for
a higher score. Low priority for a portfolio site.

**`@vercel/analytics` beacon (✓ privacy-compliant)**
Vercel Analytics does not use cookies, does not store IP addresses, and is GDPR-
compliant out of the box. No cookie consent banner required.

**HTTPS — enforced by Vercel (✓)**
All traffic redirected to HTTPS automatically.

---

## SEO

### Issues found and fixed

**No `metadataBase` — OG images were relative URLs (impact: high)**
Without `metadataBase`, Next.js emits relative paths in `<meta og:image>` tags.
Social crawlers require absolute URLs and silently skip relative ones.
Fix: added `metadataBase: new URL('https://zachmcentire.dev')` to `layout.tsx`.

**No OG images on any route (impact: high)**
All pages returned default Twitter/LinkedIn card previews with no image.
Fix:
- `app/opengraph-image.tsx` — sitewide default (1200×630 ImageResponse)
- `app/projects/[slug]/opengraph-image.tsx` — per-project dynamic card

**No `sitemap.xml` (impact: medium)**
Fix: `app/sitemap.ts` generates `/sitemap.xml` at build time with all static
routes and all project case study URLs.

**No `robots.txt` (impact: low)**
Fix: `app/robots.ts` generates `/robots.txt` with sitewide allow and `/api/`
disallow.

**Missing canonical URLs (impact: medium)**
Duplicate content risk if indexed at `www.` variant or with query params.
Fix: `alternates: { canonical: url }` on every page.

**Thin metadata on home page (impact: medium)**
`page.tsx` had only a `title`. Fix: added full description, openGraph, twitter.

---

## Analytics Setup

```
npm install @vercel/analytics @vercel/speed-insights
```

Added to `layout.tsx`:
```tsx
import { Analytics }    from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

// Inside <body>:
<Analytics />
<SpeedInsights />
```

`Analytics` tracks page views per route automatically on Vercel.
`SpeedInsights` captures Core Web Vitals (LCP, CLS, INP) per route with
percentile breakdowns visible in the Vercel dashboard.

Neither package uses cookies or requires a consent banner under GDPR/CCPA.

---

## Running Lighthouse yourself

```bash
# Build production bundle (dev mode scores are meaningless)
npm run build && npm run start

# In Chrome DevTools → Lighthouse tab:
# - Mode: Navigation
# - Device: Mobile (harder target, more meaningful)
# - Categories: All
# - URL: http://localhost:3000

# Or via CLI:
npx lighthouse http://localhost:3000 \
  --output=html \
  --output-path=./lighthouse-report.html \
  --preset=desktop \
  --chrome-flags="--headless"
```

**Important**: always audit the production build (`npm run build && npm start`),
not `npm run dev`. Dev mode disables minification, tree-shaking, and font
optimisation — scores will be 15–25 points lower and don't reflect real users.