# Portfolio v2 — Zach McEntire

Next.js 14 portfolio with Gothic Cyberpunk aesthetic, TypeScript, and AI-powered bio personalizer.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS custom properties (no Tailwind, no CSS-in-JS)
- **Fonts**: Cinzel (display) + JetBrains Mono (body) via next/font
- **Images**: next/image with automatic WebP conversion
- **AI**: Claude API (Anthropic) for bio personalizer
- **Deploy**: Vercel

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```
Then edit `.env.local` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-...
```
Get a key at: https://console.anthropic.com

### 3. Run the dev server
```bash
npm run dev
```
Open http://localhost:3000

## Project Structure

```
portfolio-v2/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata, navbar
│   ├── globals.css         # Design tokens, base styles, animations
│   ├── page.tsx            # Home / Hero page
│   ├── about/
│   │   └── page.tsx        # About + Skills + AI Personalizer
│   ├── projects/
│   │   └── page.tsx        # Projects grid
│   └── api/
│       └── personalize/
│           └── route.ts    # Claude API streaming endpoint
├── components/
│   ├── Navbar.tsx          # Scroll-aware fixed navbar
│   ├── ProjectCard.tsx     # Expandable project card (client)
│   └── BioPersonalizer.tsx # AI bio rewriter (client)
├── lib/
│   └── data.ts             # All content data + TypeScript types
├── public/
│   └── images/
│       └── headshot.jpg
└── next.config.js
```

## Deployment to Vercel

1. Push repo to GitHub
2. Go to vercel.com → New Project → Import from GitHub
3. Vercel auto-detects Next.js — no build config needed
4. Add environment variable in Vercel dashboard:
   - `ANTHROPIC_API_KEY` → your key
5. Deploy

## Updating Content

All project data and skills live in `lib/data.ts`. To add a new project, add an entry to the `projects` array. To update skills, edit the `skills` array. No other files need to change.

## Adding the Stoic apps to the projects list

Once you deploy the Stoic apps on Netlify, update the demo URLs in `lib/data.ts` for `stoic-quote` and `stoic-timeline`. Their status is already set to `'live'`.
