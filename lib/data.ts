// ─── Design Tokens ────────────────────────────────────────────────────────────
export const tokens = {
  obsidian:    '#0d0d0f',
  surface:     '#13141a',
  surface2:    '#1a1b24',
  border:      '#2a2b38',
  borderHover: '#3a3b4a',
  cyan:        '#00e5ff',
  cyanDim:     'rgba(0,229,255,0.12)',
  crimson:     '#8b1a1a',
  crimsonLt:   '#c0392b',
  brass:       '#b8960c',
  brassDim:    'rgba(184,150,12,0.10)',
  textPrimary: '#e8e6df',
  textMuted:   '#9a9890',
  textDim:     '#5a5955',
} as const

export const fonts = {
  display: "'Cinzel', 'Palatino Linotype', Georgia, serif",
  mono:    "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
} as const

// ─── Skills Data ──────────────────────────────────────────────────────────────
// Each skill has a proficiency level 1–5 for the visual depth indicator.
// 5 = daily driver / expert, 4 = strong, 3 = solid working knowledge,
// 2 = learning / recent, 1 = exposure.

export interface Skill {
  name:  string
  level: 1 | 2 | 3 | 4 | 5
}

export interface SkillGroup {
  category:    string
  tab:         string   // short tab label
  icon:        string   // single glyph for tab button
  description: string   // one-line summary shown in the tab panel
  skills:      Skill[]
}

export const skillGroups: SkillGroup[] = [
  {
    category:    'Frontend',
    tab:         'Frontend',
    icon:        '◈',
    description: 'UI engineering — component architecture, type-safe interfaces, accessibility',
    skills: [
      { name: 'React',       level: 5 },
      { name: 'Next.js',     level: 5 },
      { name: 'TypeScript',  level: 4 },
      { name: 'Angular',     level: 4 },
      { name: 'JavaScript',  level: 5 },
      { name: 'HTML5',       level: 5 },
      { name: 'CSS3',        level: 4 },
      { name: 'Tailwind',    level: 3 },
    ],
  },
  {
    category:    'Backend',
    tab:         'Backend',
    icon:        '▸',
    description: 'Server-side systems — APIs, scripting, databases, runtime environments',
    skills: [
      { name: 'Python',      level: 4 },
      { name: 'FastAPI',     level: 4 },
      { name: 'Node.js',     level: 4 },
      { name: 'Express.js',  level: 4 },
      { name: 'C# / .NET',   level: 3 },
      { name: 'REST APIs',   level: 5 },
      { name: 'Firebase',    level: 4 },
      { name: 'Bash',        level: 3 },
    ],
  },
  {
    category:    'AI & Data',
    tab:         'AI & Data',
    icon:        '⬡',
    description: 'Agentic systems, LLM integration, time-series data, vector storage',
    skills: [
      { name: 'Claude API',         level: 5 },
      { name: 'Tool-Use Agents',    level: 5 },
      { name: 'Prompt Engineering', level: 4 },
      { name: 'TimescaleDB',        level: 4 },
      { name: 'PostgreSQL',         level: 3 },
      { name: 'MongoDB',            level: 3 },
      { name: 'Plotly',             level: 3 },
      { name: 'Streamlit',          level: 3 },
    ],
  },
  {
    category:    'Engineering',
    tab:         'Engineering',
    icon:        '⚙',
    description: 'Cloud, CI/CD, DevOps, enterprise support, system debugging',
    skills: [
      { name: 'GitHub Actions',    level: 4 },
      { name: 'Railway',           level: 4 },
      { name: 'Vercel',            level: 4 },
      { name: 'Netlify',           level: 4 },
      { name: 'Linux',             level: 4 },
      { name: 'Networking',        level: 4 },
      { name: 'TAM / Support Eng', level: 5 },
      { name: 'Technical Docs',    level: 5 },
      { name: 'Git',               level: 5 },
      { name: 'Postman',           level: 4 },
    ],
  },
]

// Legacy export — kept so existing components don't break during migration
export const skills = skillGroups.map(g => ({
  category: g.category,
  items: g.skills.map(s => s.name),
}))

// ─── Projects Data ────────────────────────────────────────────────────────────
export type ProjectStatus = 'live' | 'offline' | 'issue'

// ─── Case study content block ─────────────────────────────────────────────────
export interface CaseStudySection {
  heading: string
  body:    string    // paragraph prose
  items?:  string[]  // optional bullet list after the prose
}

export interface CaseStudy {
  role:      string          // e.g. "Solo developer"
  duration:  string          // e.g. "6 weeks"
  outcome:   string          // one-sentence result
  sections:  CaseStudySection[]
}

export interface Project {
  id:          string
  title:       string
  tagline:     string
  status:      ProjectStatus
  statusNote?: string
  stack:       string[]
  description: string
  highlights:  string[]
  challenges:  string
  future?:     string[]
  demo?:       string
  github?:     string
  image:       string
  caseStudy?:  CaseStudy     // populated for flagship projects
}

export const projects: Project[] = [
  {
    id:      'tigerdata',
    title:   'TigerData Fitness Tracker',
    tagline: 'Agentic AI powerlifting coach & analytics platform',
    status:  'live',
    stack:   ['Python', 'TimescaleDB', 'FastAPI', 'Streamlit', 'Claude API', 'Plotly', 'Railway'],
    description:
      'An agentic powerlifting tracker built on TimescaleDB. Ingests workout data via natural language, stores sets as time-series data in hypertables, and projects 1RM progress toward 2026 PR targets using continuous aggregates and linear regression.',
    highlights: [
      'AI coaching interface powered by Claude tool-use agents',
      'Natural language workout ingestion — no manual form entry',
      'Real-time Streamlit dashboard with Plotly visualizations',
      'Linear regression 1RM projections against PR targets',
    ],
    challenges:
      'Designing the TimescaleDB schema to efficiently store and aggregate time-series workout data while keeping Claude tool-use calls stateless was the core architectural challenge. Continuous aggregates required careful hypertable configuration to stay performant at scale.',
    future: [
      'User authentication & multi-user support',
      'Calorie & diet tracking tab',
      'Sleep quality logging & correlation analysis',
      'Expanded workout tracker (cardio, mobility)',
    ],
    demo:   'https://tigerdata-fitness-tracker-production-a693.up.railway.app',
    github: 'https://github.com/zmcentire/tigerdata-fitness-tracker',
    image:  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    caseStudy: {
      role:     'Solo developer',
      duration: '4 weeks',
      outcome:  'Live agentic fitness tracker deployed on Railway, processing natural-language workout logs into TimescaleDB hypertables with real-time 1RM projections.',
      sections: [
        {
          heading: 'The problem',
          body:    'Existing fitness tracking apps require rigid manual data entry — sets, reps, and weights into separate fields. As a powerlifter, I wanted to log a workout the way I actually think about it: "5x3 squat at 315, felt solid." The data still needed to be structured for meaningful analytics.',
        },
        {
          heading: 'Approach',
          body:    'I built a Claude tool-use agent as the ingestion layer. The agent receives natural-language input, calls structured tools to parse and validate workout data, then writes time-series records to TimescaleDB hypertables. This kept the AI layer stateless — each ingestion call is independent, which matters for reliability and cost.',
          items: [
            'Claude tool-use agents for NL → structured data parsing',
            'TimescaleDB hypertables for time-series workout storage',
            'Continuous aggregates pre-compute 7-day and 30-day rolling windows',
            'FastAPI handles agent orchestration and REST endpoints',
            'Streamlit dashboard renders Plotly charts from aggregated data',
          ],
        },
        {
          heading: 'The hard part',
          body:    'TimescaleDB continuous aggregates require careful schema design upfront. Hypertable chunk intervals need to match your query patterns — too coarse and real-time inserts lag; too fine and the aggregation overhead spikes. I ended up with 1-week chunks and daily aggregates, which gave sub-100ms reads for the dashboard while keeping write latency under 20ms.',
        },
        {
          heading: 'What I learned',
          body:    `Tool-use agents are significantly more reliable than free-form LLM output for structured data extraction. By defining strict tool schemas, the agent can't hallucinate fields or types — the API rejects malformed calls before they reach the database. This pattern is worth applying to any AI feature that touches persistent data.`,
        },
      ],
    },
  },
  {
    id:      'poly',
    title:   'Poly Platform',
    tagline: 'Event scheduling & social platform for organizations',
    status:  'live',
    stack:   ['Angular', 'TypeScript', 'HTML5', 'CSS3'],
    description:
      'A social event scheduling platform combining organizational exclusivity with interest-based content to encourage face-to-face engagement for university students and company employees.',
    highlights: [
      'Built navigation, menus, and typography systems',
      'Developed reusable action card components in Angular',
      'Interest-based content discovery for orgs and events',
      'Backend data aggregation for organizational analytics',
    ],
    challenges:
      'Building reusable, composable Angular components that could scale across different organizational contexts required careful attention to input/output contracts and TypeScript typing discipline.',
    demo:  'https://getpolyplatform.com/',
    image: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?w=800',
  },
  {
    id:      'hotzone',
    title:   'HotZone',
    tagline: 'Comprehensive resource app for firefighters & paramedics',
    status:  'live',
    stack:   ['React', 'Firebase', 'Node.js', 'CSS'],
    description:
      'A field resource application for firefighters and paramedics to look up drug protocols, administration dosages, Utah hospital locations, fire hazard information by building type, and county-specific procedures.',
    highlights: [
      'Custom Firebase API storing drug, protocol, and fire hazard data',
      'County-specific protocol filtering',
      'Utah hospital directory with quick-reference info',
      'Designed for high-pressure, low-latency field use',
    ],
    challenges:
      'The UX challenge was building an interface that works under genuine stress — large tap targets, minimal cognitive load, and fast lookup. Data architecture in Firebase required careful normalization to support fast county-filtered queries.',
    demo:  'https://firehouse-app.web.app',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    caseStudy: {
      role:     'Solo developer',
      duration: '3 weeks',
      outcome:  'Deployed field resource app used by firefighters and paramedics to look up drug protocols and fire hazard data in real-time county-specific emergencies.',
      sections: [
        {
          heading: 'The problem',
          body:    'Firefighters and paramedics in the field need to look up drug administration protocols, hospital locations, and building hazard classifications quickly — often in high-noise, low-light conditions with gloved hands. Existing solutions were PDFs or cluttered web pages designed for desktop use.',
        },
        {
          heading: 'Design constraints',
          body:    'The UX problem drove every technical decision. The interface had to work under genuine stress conditions: one-hand operation, large tap targets, high contrast, minimal navigation depth. No feature could require more than two taps to reach.',
          items: [
            'Maximum two-tap depth to any piece of information',
            'County-based filtering as the primary navigation axis',
            'High-contrast color coding for hazard severity levels',
            'Offline-capable reads for poor-signal environments',
          ],
        },
        {
          heading: 'Architecture',
          body:    'Firebase Firestore was the right choice here — no backend server to maintain, real-time sync for protocol updates pushed by administrators, and offline persistence built in. I normalized the data across three collections (protocols, hospitals, hazards) with county as the shared foreign key, allowing fast filtered reads without joins.',
        },
        {
          heading: 'What I learned',
          body:    `Building for stress users is a different discipline than building for casual users. Every interaction has to be forgiving — fat-finger friendly, never requiring precision, always showing the most likely option first. The county filter defaulting to the user's most recently selected county eliminated the most common source of wrong-protocol lookups in testing.`,
        },
      ],
    },
  },
  {
    id:      'stoic-quote',
    title:   'Stoic Quote Generator',
    tagline: 'Random quote generator with a custom Stoicism quote library',
    status:  'live',
    stack:   ['React', 'Node.js', 'Reactstrap', 'CSS'],
    description:
      'A random quote generator drawing from a custom-built library of Stoic philosophy quotes across three themes: Adversity, Mortality, and Mental Wellness.',
    highlights: [
      'Custom quote library — not a third-party data source',
      'Quotes organized by theme: Adversity, Mortality, Mental Wellness',
      'Randomized selection with philosopher attribution',
    ],
    challenges:
      'Originally backed by a hosted REST API that went offline when Heroku ended its free tier. Migrated the quote data to a local JSON file, removing the external dependency entirely and making the deploy self-contained.',
    future: [
      'Filter by philosopher or theme',
      'Daily quote via email subscription',
    ],
    demo:   'https://stoic-quote-generator.netlify.app',
    github: 'https://github.com/zmcentire/stoic-quote-generator',
    image:  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    caseStudy: {
      role:     'Solo developer',
      duration: '1 week (+ migration)',
      outcome:  'Self-contained Stoic quote generator deployed on Netlify, with zero external runtime dependencies after migrating from a Heroku-hosted API to local JSON.',
      sections: [
        {
          heading: 'The problem',
          body:    `The original app fetched quotes from a custom REST API hosted on Heroku's free tier. When Heroku ended free dynos in November 2022, the API went offline — taking the app with it. This was a useful failure: it exposed a fragile architectural decision I had made early on.',
        },
        {
          heading: 'The migration',
          body:    'The fix was straightforward once I understood the root cause: the API existed to serve static data that never changed. There was no reason for a network round-trip, cold start risk, or external service dependency. I migrated the full quote library to a local JSON file and replaced the fetch call with a static import.`,
          items: [
            'Removed axios dependency entirely',
            'Migrated 30+ quotes across 3 themes to quotes.json',
            'Replaced async fetch() with synchronous import',
            'Eliminated cold-start latency — quotes load instantly',
            'Redeployed on Netlify — zero ongoing infrastructure cost',
          ],
        },
        {
          heading: 'What I learned',
          body:    'Every external runtime dependency is a potential failure point. Static data should be static — colocated with the code that uses it, versioned together, deployed together. The simplest architecture that satisfies the requirements is almost always the most resilient one. This migration made the app faster, cheaper, and more reliable simultaneously.',
        },
      ],
    },
  },
  {
    id:      'stoic-timeline',
    title:   'Stoic Timeline',
    tagline: 'Interactive timeline & biographies of Stoic philosophers',
    status:  'live',
    stack:   ['React', 'styled-components', 'CSS'],
    description:
      'An interactive timeline app featuring bios, notable quotes, and recommended readings for Marcus Aurelius, Seneca, Epictetus, Zeno, and more. Includes a light/dark theme toggle.',
    highlights: [
      'Clickable timeline nav with smooth bio transitions',
      'Light/dark theme toggle via styled-components ThemeProvider',
      'Rich biographical content with primary source recommendations',
    ],
    challenges:
      'Building smooth stateful transitions between philosopher bios without a heavy animation library — achieved with CSS transitions and React state.',
    future: [
      'Expand to other ancient philosophy schools',
      'Audio narration of selected quotes',
    ],
    demo:   'https://stoic-timeline.netlify.app',
    github: 'https://github.com/zmcentire/stoic-bio',
    image:  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
  },
  {
    id:      'metronome',
    title:   'React Metronome',
    tagline: 'Precise BPM metronome built in React',
    status:  'live',
    stack:   ['React', 'Web Audio API'],
    description:
      'A clean, functional metronome with BPM control built using React and the Web Audio API — a focused exercise in precise timing and audio scheduling in the browser.',
    highlights: [
      'Web Audio API for sample-accurate click scheduling',
      'BPM slider with tap-tempo input',
      'Lookahead scheduler pattern to prevent drift',
    ],
    challenges:
      'Browser audio scheduling requires working slightly ahead of playback time to prevent drift — implemented a lookahead scheduler to maintain click accuracy.',
    demo:   'https://react-metronome-zm.netlify.app',
    github: 'https://github.com/zmcentire/react-metronome',
    image:  'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800',
  },
  {
    id:         'recipe',
    title:      'React Recipe App',
    tagline:    'Recipe search powered by the Edamam API',
    status:     'issue',
    statusNote: 'CORS issue — API proxy refactor planned',
    stack:      ['React', 'Edamam API', 'CSS'],
    description:
      'A recipe search application using React and the Edamam recipe search API. Fetches and displays recipe cards with ingredients, nutrition info, and source links.',
    highlights: [
      'Dynamic recipe search with debounced input',
      'Recipe card grid with nutrition summary',
    ],
    challenges:
      'The Edamam API returns CORS errors when called directly from the browser. The fix is proxying requests through a Next.js API route — this refactor is planned.',
    future: [
      'Proxy API calls through a Next.js API route to resolve CORS',
      'Save favorite recipes to localStorage',
    ],
    demo:   'https://zachmac-recipe-react.netlify.app/',
    github: 'https://github.com/zmcentire/react-recipe-app',
    image:  'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=800',
  },
]

export const statusConfig = {
  live:    { label: 'Live',         color: '#00e5ff', bg: 'rgba(0,229,255,0.08)',  border: 'rgba(0,229,255,0.25)'  },
  offline: { label: 'Redeploying', color: '#b8960c', bg: 'rgba(184,150,12,0.08)', border: 'rgba(184,150,12,0.25)' },
  issue:   { label: 'Known Issue', color: '#c0392b', bg: 'rgba(192,57,43,0.08)',  border: 'rgba(192,57,43,0.25)'  },
} as const