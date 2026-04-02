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
  textDim:     '#868380',
} as const

export const fonts = {
  display: "'fleshandblood', 'Cormorant', Georgia, serif",
  mono:    "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
} as const

// ─── Skills Data ──────────────────────────────────────────────────────────────
export interface Skill {
  name:  string
  level: 1 | 2 | 3 | 4 | 5
}

export interface SkillGroup {
  category:    string
  tab:         string
  icon:        string
  description: string
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
    description: 'Agentic systems, LLM integration, time-series data',
    skills: [
      { name: 'Claude API',         level: 5 },
      { name: 'Tool-Use Agents',    level: 5 },
      { name: 'Prompt Engineering', level: 4 },
      { name: 'TimescaleDB',        level: 4 },
      { name: 'PostgreSQL',         level: 3 },
      { name: 'MongoDB',            level: 3 },
    ],
  },
  {
    category:    'Engineering',
    tab:         'Engineering',
    icon:        '⚙',
    description: 'Cloud, CI/CD, observability, enterprise support, systems debugging',
    skills: [
      { name: 'Datadog',           level: 4 },
      { name: 'GitHub Actions',    level: 4 },
      { name: 'Railway',           level: 4 },
      { name: 'Vercel',            level: 4 },
      { name: 'Docker',            level: 3 },
      { name: 'AWS (EC2, S3)',     level: 3 },
      { name: 'Linux',             level: 4 },
      { name: 'TAM / Support Eng', level: 5 },
      { name: 'Incident Command',  level: 5 },
      { name: 'Zendesk / Jira',   level: 4 },
      { name: 'PagerDuty',         level: 4 },
      { name: 'Git',               level: 5 },
    ],
  },
]

export const skills = skillGroups.map(g => ({
  category: g.category,
  items: g.skills.map(s => s.name),
}))

// ─── Projects Data ────────────────────────────────────────────────────────────
export type ProjectStatus = 'live' | 'offline' | 'issue'

export interface CaseStudySection {
  heading: string
  body:    string
  items?:  string[]
}

export interface CaseStudy {
  role:     string
  duration: string
  outcome:  string
  sections: CaseStudySection[]
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
  caseStudy?:  CaseStudy
}

export const projects: Project[] = [
  {
    id:      'sentinel-ops',
    title:   'SENTINEL/OPS',
    tagline: 'Production API health monitoring & incident management dashboard',
    status:  'live',
    stack:   ['React 18', 'TypeScript', 'Node.js', 'Express', 'BullMQ', 'TimescaleDB', 'WebSocket', 'Railway', 'Vercel'],
    description:
      'A production-grade API health and incident management system. Real-time endpoint polling via a BullMQ job pipeline, WebSocket-streamed live event log, TimescaleDB continuous aggregates for sub-millisecond dashboard queries, and Twilio/SendGrid alerting on threshold violations.',
    highlights: [
      'BullMQ 4-stage pipeline: scheduler → checker → evaluator → notifier',
      'TimescaleDB continuous aggregates, dashboard latency queries sub-millisecond at scale',
      'WebSocket broadcast on every check insert, zero-latency live event log',
      'Twilio SMS + SendGrid email alerts on SLA threshold violations',
      'MTTR auto-calculated via generated TimescaleDB column',
      '64-test suite: Vitest + supertest covering workers, routes, and aggregates',
    ],
    challenges:
      'Designing the BullMQ concurrency model to handle 1,200 endpoints per worker at 60s intervals without blocking the event loop. The evaluator stage required careful rule engine logic against continuous aggregate views rather than raw rows wrong query patterns caused full table scans that would spike at scale.',
    future: [
      'Multi-user authentication and team workspaces',
      'Custom alert channels (Slack webhook, PagerDuty integration)',
      'Anomaly detection using TimescaleDB ML extension',
    ],
    demo:   'https://sentinel-ops-black.vercel.app',
    github: 'https://github.com/zmcentire/sentinel-ops',
    image:  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    caseStudy: {
      role:     'Solo developer',
      duration: '3 weeks',
      outcome:  'Live monitoring dashboard deployed on Railway + Vercel, processing 1,200+ endpoint checks per minute with sub-millisecond aggregate queries and real-time WebSocket event streaming.',
      sections: [
        {
          heading: 'The problem',
          body:    `Support engineers spend too much time discovering incidents through customer reports rather than internal monitoring. SENTINEL/OPS was built to demonstrate what production-grade API health tooling looks like: real polling, real alerting, real SLA tracking, not a mocked dashboard.`,
        },
        {
          heading: 'Architecture decisions',
          body:    'The core insight was separating concerns into four discrete BullMQ queues: scheduling, HTTP probing, rule evaluation, and notification. This means the notifier never sees raw HTTP responses and the checker never writes alert logic.',
          items: [
            'Scheduler enqueues check jobs at configurable intervals per endpoint',
            'Checker performs HTTP probe, writes result to TimescaleDB hypertable',
            'Checker also calls broadcast() for zero-latency WebSocket push',
            'Evaluator reads continuous aggregate (not raw rows) for rule evaluation',
            'Notifier fires Twilio SMS and/or SendGrid email based on alert config',
          ],
        },
        {
          heading: 'TimescaleDB as the backbone',
          body:    `TimescaleDB's continuous aggregates pre-compute 1-minute windowed averages of latency, uptime, and error rates. Dashboard queries hit the \`check_results_1min\` materialized view, sub-millisecond regardless of data volume. The generated \`mttr_minutes\` column auto-calculates mean time to recovery when \`resolved_at\` is written, eliminating application-layer math.`,
        },
        {
          heading: 'Testing strategy',
          body:    'The 64-test suite covers the full stack: Vitest unit tests for SLA utility functions, Zustand store action tests, and API route tests with mocked BullMQ and TimescaleDB clients via supertest. The goal was to test contract boundaries, not implementation details.',
        },
      ],
    },
  },
  {
    id:      'support-desk',
    title:   'SupportDesk',
    tagline: 'AI-powered support ticket triage dashboard with Claude structured JSON',
    status:  'live',
    stack:   ['Next.js 14', 'TypeScript', 'Claude API', 'Zustand', 'Vitest'],
    description:
      'An AI-powered support ticket dashboard demonstrating production-grade support tooling patterns. Claude analyzes each ticket and returns structured JSON (category, priority, sentiment, tags, summary, draft reply). Keyboard-driven queue navigation, SLA tracking, bulk triage, and a live stats bar.',
    highlights: [
      'Claude returns strict structured JSON validated against TypeScript union types',
      'Invalid AI values fall back gracefully. No crashes on bad model output',
      'Bulk triage queues all untriaged tickets sequentially with progress indicator',
      'SLA color bar per ticket: green ≥70%, yellow ≥40%, red <40%',
      'J/K keyboard navigation, Esc to deselect, no mouse required',
      '64-test suite: 16 utility tests, 35 Zustand store tests, 13 API route tests',
    ],
    challenges:
      `The hardest part was making Claude's structured output reliable. Free-form JSON from an LLM fails unpredictably like wrong field names, out-of-range values, null where a union type is expected. The solution was strict prompt engineering plus server-side validation that falls back to the ticket's original values on any invalid field, rather than crashing or returning partial data.`,
    future: [
      'Real Zendesk/Intercom data connector via webhook',
      'Historical triage accuracy metrics',
      'Multi-agent routing based on category',
    ],
    demo:   'https://support-desk-teal.vercel.app',
    github: 'https://github.com/zmcentire/support-desk',
    image:  'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800',
    caseStudy: {
      role:     'Solo developer',
      duration: '2 weeks',
      outcome:  'Live AI triage dashboard deployed on Vercel, demonstrating how a Claude AI layer reduces first-pass ticket categorization time and surfaces draft replies for agent review.',
      sections: [
        {
          heading: 'The problem',
          body:    'Support engineers spend significant time on the first-pass of every ticket: reading it, deciding priority, deciding category, drafting an opening reply. None of that requires human judgment. SupportDesk demonstrates how an AI layer handles that first pass so agents can focus on resolution.',
        },
        {
          heading: 'Structured AI output with fallback',
          body:    'The triage route prompts Claude for strict JSON and validates every field against TypeScript union types before returning to the client. The key engineering constraint was graceful degradation.',
          items: [
            'Claude returns: category, priority, sentiment, tags[], summary, draftReply',
            'Each field validated against its TypeScript union before state update',
            'Invalid value → field falls back to ticket original, no crash, no partial state',
            'API key stays server-side. All Claude calls go through Next.js Route Handlers',
          ],
        },
        {
          heading: 'Keyboard-first UX',
          body:    'Support queues are worked at speed. Every interaction has a keyboard shortcut: J/K to move between tickets, Enter to open, Esc to deselect, T to trigger triage, R to generate a reply suggestion. The design mirrors tools like Linear and GitHub Issues that support engineers already use.',
        },
        {
          heading: 'Testing discipline',
          body:    'The 64-test suite was written alongside the implementation, not after. Utility functions (SLA calculation, priority ordering) have exhaustive unit coverage. The Zustand store tests verify state transitions in isolation. The API route tests mock the Anthropic SDK and verify request/response shape contracts.',
        },
      ],
    },
  },
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
      'Natural language workout ingestion. No manual form entry',
      'Real-time Streamlit dashboard with Plotly visualizations',
      'Linear regression 1RM projections against PR targets',
    ],
    challenges:
      `Designing the TimescaleDB schema to efficiently store and aggregate time-series workout data while keeping Claude tool-use calls stateless was the core architectural challenge. Continuous aggregates required careful hypertable configuration to stay performant at scale.`,
    future: [
      'User authentication & multi-user support',
      'Calorie & diet tracking tab',
      'Sleep quality logging & correlation analysis',
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
          body:    `Existing fitness tracking apps require rigid manual data entry. As a powerlifter, I wanted to log a workout the way I actually think about it: "5x3 squat at 315, felt solid." The data still needed to be structured for meaningful analytics.`,
        },
        {
          heading: 'Approach',
          body:    `I built a Claude tool-use agent as the ingestion layer. The agent receives natural-language input, calls structured tools to parse and validate workout data, then writes time-series records to TimescaleDB hypertables. This kept the AI layer stateless, each ingestion call is independent.`,
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
          body:    `TimescaleDB continuous aggregates require careful schema design upfront. Hypertable chunk intervals need to match your query patterns, too coarse and real-time inserts lag; too fine and the aggregation overhead spikes. I ended up with 1-week chunks and daily aggregates, which gave sub-100ms reads for the dashboard while keeping write latency under 20ms.`,
        },
        {
          heading: 'What I learned',
          body:    `Tool-use agents are significantly more reliable than free-form LLM output for structured data extraction. By defining strict tool schemas, the agent can't hallucinate fields or types, the API rejects malformed calls before they reach the database.`,
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
      `Building reusable, composable Angular components that could scale across different organizational contexts required careful attention to input/output contracts and TypeScript typing discipline.`,
    demo:  'https://getpolyplatform.com/',
    image: '/images/poly-logo.jpeg',
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
      `The UX challenge was building an interface that works under genuine stress, large tap targets, minimal cognitive load, and fast lookup. Data architecture in Firebase required careful normalization to support fast county-filtered queries.`,
    demo:  'https://firehouse-app.web.app',
    image: '/images/hotzone-logo.png',
    caseStudy: {
      role:     'Solo developer',
      duration: '3 weeks',
      outcome:  'Deployed field resource app used by firefighters and paramedics to look up drug protocols and fire hazard data in real-time county-specific emergencies.',
      sections: [
        {
          heading: 'The problem',
          body:    `Firefighters and paramedics in the field need to look up drug administration protocols, hospital locations, and building hazard classifications quickly, often in high-noise, low-light conditions with gloved hands. Existing solutions were PDFs or cluttered web pages designed for desktop use.`,
        },
        {
          heading: 'Design constraints',
          body:    `The UX problem drove every technical decision. The interface had to work under genuine stress conditions: one-hand operation, large tap targets, high contrast, minimal navigation depth. No feature could require more than two taps to reach.`,
          items: [
            'Maximum two-tap depth to any piece of information',
            'County-based filtering as the primary navigation axis',
            'High-contrast color coding for hazard severity levels',
            'Offline-capable reads for poor-signal environments',
          ],
        },
        {
          heading: 'Architecture',
          body:    `Firebase Firestore was the right choice here, no backend server to maintain, real-time sync for protocol updates pushed by administrators, and offline persistence built in. I normalized the data across three collections (protocols, hospitals, hazards) with county as the shared foreign key, allowing fast filtered reads without joins.`,
        },
        {
          heading: 'What I learned',
          body:    `Building for stress users is a different discipline than building for casual users. Every interaction has to be forgiving: fat-finger friendly, never requiring precision, always showing the most likely option first.`,
        },
      ],
    },
  },
  {
    id:      'stoic-quote',
    title:   'Stoic Quote Generator',
    tagline: 'Random quote generator with a custom Stoicism quote library',
    status:  'live',
    stack:   ['React', 'Node.js', 'CSS'],
    description:
      'A random quote generator drawing from a custom-built library of Stoic philosophy quotes across three themes: Adversity, Mortality, and Mental Wellness.',
    highlights: [
      'Custom quote library, not a third-party data source',
      'Quotes organized by theme: Adversity, Mortality, Mental Wellness',
      'Randomized selection with philosopher attribution',
    ],
    challenges:
      `Originally backed by a hosted REST API that went offline when Heroku ended its free tier. Migrated the quote data to a local JSON file, removing the external dependency entirely and making the deploy self-contained.`,
    demo:   'https://stoic-quote-generator.netlify.app',
    github: 'https://github.com/zmcentire/stoic-quote-generator',
    image:  '/images/marcus-aurelius.jpeg',
    caseStudy: {
      role:     'Solo developer',
      duration: '1 week (+ migration)',
      outcome:  'Self-contained Stoic quote generator deployed on Netlify, with zero external runtime dependencies after migrating from a Heroku-hosted API to local JSON.',
      sections: [
        {
          heading: 'The problem',
          body:    `The original app fetched quotes from a custom REST API hosted on Heroku's free tier. When Heroku ended free dynos in November 2022, the API went offline taking the app with it. This was a useful failure: it exposed a fragile architectural decision I had made early on.`,
        },
        {
          heading: 'The migration',
          body:    `The fix was straightforward: the API existed to serve static data that never changed. I migrated the full quote library to a local JSON file and replaced the fetch call with a static import.`,
          items: [
            'Removed axios dependency entirely',
            'Migrated 30+ quotes across 3 themes to quotes.json',
            'Replaced async fetch() with synchronous import',
            'Eliminated cold-start latency quotes load instantly',
          ],
        },
        {
          heading: 'What I learned',
          body:    `Every external runtime dependency is a potential failure point. Static data should be static. Colocated with the code that uses it, versioned together, deployed together.`,
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
      'An interactive timeline app featuring bios, notable quotes, and recommended readings for Marcus Aurelius, Seneca, Epictetus, Zeno, and more.',
    highlights: [
      'Clickable timeline nav with smooth bio transitions',
      'Light/dark theme toggle via styled-components ThemeProvider',
      'Rich biographical content with primary source recommendations',
    ],
    challenges:
      `Building smooth stateful transitions between philosopher bios without a heavy animation library. Achieved with CSS transitions and React state.`,
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
      'A clean, functional metronome with BPM control built using React and the Web Audio API, a focused exercise in precise timing and audio scheduling in the browser.',
    highlights: [
      'Web Audio API for sample-accurate click scheduling',
      'BPM slider with tap-tempo input',
      'Lookahead scheduler pattern to prevent drift',
    ],
    challenges:
      `Browser audio scheduling requires working slightly ahead of playback time to prevent drift. Implemented a lookahead scheduler to maintain click accuracy.`,
    demo:   'https://react-metronome-zm.netlify.app',
    github: 'https://github.com/zmcentire/react-metronome',
    image:  'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800',
  },

  {
    id:      'guitar',
    title:   'Handbuilt Electric Guitar',
    tagline: 'Firebird-inspired body carved from scratch: body, electronics, and custom wood case',
    status:  'live',
    stack:   ['Bandsaw', 'Router', 'Belt Sander', 'Orbital Sander', 'Woodworking'],
    description:
      `A fully handbuilt electric guitar modeled after a Firebird-inspired body shape, finished gloss black with crimson binding. Body carved from what appears to be alder (tight grain, lightweight, consistent resonance). Three single-coil pickups, synchronized tremolo/whammy bar, volume and tone controls. The custom hardshell case, also handbuilt, is solid pine with mortise-and-rail panel construction, chrome hardware, and black crushed velvet lining.`,
    highlights: [
      'Body shaped on a bandsaw from a solid blank, contours sanded by hand',
      'Router used to carve pickup cavities, control cavity, and neck pocket',
      'Gloss black finish over what appears to be alder, tight grain, resonant',
      'Red binding routed along body edges for visual definition',
      '3 single-coil pickups with synchronized tremolo/whammy bar',
      'Custom hardshell pine case with panel-and-rail construction and velvet lining',
    ],
    challenges:
      `The neck pocket is the most unforgiving part of a handbuilt guitar, a fraction of a millimeter off and the intonation never sits right. Routing the control and pickup cavities required careful depth stops on the router to avoid blowing through the body. The case construction, joinery, hardware fitting, and lining, was a separate project almost as involved as the guitar itself.`,
    image:  '/images/guitar-front.jpg',
    caseStudy: {
      role:     'Luthier / woodworker',
      duration: 'Several months',
      outcome:  'A fully playable handbuilt electric guitar with custom case, intonates correctly, plays in tune up the neck, and sounds exactly like a three-single-coil setup should.',
      sections: [
        {
          heading: 'Body',
          body:    `The body is carved from what appears to be alder the grain visible at the binding edges is tight and slightly figured, consistent with alder's characteristics. The shape is Firebird-inspired: the asymmetric offset waist, the extended lower bout, the swept upper horn. The silhouette was drawn freehand, cut on a bandsaw, and shaped progressively through belt, orbital, and hand sanding. The gloss black finish sits over a red binding routed along the edge for separation between top and sides.`,
        },
        {
          heading: 'Electronics routing',
          body:    `The pickup cavities and control cavity were routed with a plunge router using a template. The neck pocket, the most precision-critical cut on any guitar, was routed to match the bolt-on maple neck. Electronics are three single-coil pickups wired to a single volume and tone control, with a standard 5-way selector. Synchronized tremolo bridge with whammy bar.`,
        },
        {
          heading: 'The case',
          body:    `The hardshell case is solid pine, visible from the warm amber tone and the tight knotty grain in the case photos. Constructed with a panel-and-rail method: solid panels fitted into routed channels in the frame rails, similar to traditional door construction. Chrome barrel latches, hinges, and handle hardware. The interior is lined with black crushed velvet cut and fitted to the guitar's contours. Building the case took roughly as long as the guitar body itself, it's a second woodworking project nested inside the first.`,
        },
        {
          heading: 'Why it matters',
          body:    `Building a guitar from raw wood to playable instrument requires understanding tolerances that have no margin for error, neck pocket alignment, bridge saddle height, nut slot depth. It's a lesson in iterative precision that maps directly to how I approach engineering problems: define the constraint, work methodically, test at every stage, and don't move to the next step until the current one is right.`,
        },
      ],
    },
  },
]

export const statusConfig = {
  live:    { label: 'Live',         color: '#00e5ff', bg: 'rgba(0,229,255,0.08)',  border: 'rgba(0,229,255,0.25)'  },
  offline: { label: 'Redeploying', color: '#b8960c', bg: 'rgba(184,150,12,0.08)', border: 'rgba(184,150,12,0.25)' },
  issue:   { label: 'Known Issue', color: '#c0392b', bg: 'rgba(192,57,43,0.08)',  border: 'rgba(192,57,43,0.25)'  },
} as const