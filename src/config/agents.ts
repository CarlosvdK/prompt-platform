import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export interface AgentConfig {
  id: string
  name: string
  description: string
  categorySlug: string
  /** Extra guidance appended to the base system prompt */
  specialization: string
  exampleTopics: string[]
  /** Reference files in project root (prompt-examples-*.md) to learn patterns from */
  referenceFiles: string[]
}

export interface ColorPalette {
  id: string
  name: string
  primary: string    // Tailwind color name (e.g., "rose")
  accent: string     // secondary color
  preview: string    // hex for UI display
  tailwindClasses: string // specific classes to guide the agent
}

export const COLOR_PALETTES: ColorPalette[] = [
  { id: 'ocean', name: 'Ocean', primary: 'cyan', accent: 'blue', preview: '#06b6d4', tailwindClasses: 'bg-cyan-500, text-cyan-400, from-cyan-600 to-blue-600, bg-cyan-950, border-cyan-500/30' },
  { id: 'sunset', name: 'Sunset', primary: 'orange', accent: 'rose', preview: '#f97316', tailwindClasses: 'bg-orange-500, text-orange-400, from-orange-600 to-rose-600, bg-orange-950, border-orange-500/30' },
  { id: 'forest', name: 'Forest', primary: 'emerald', accent: 'teal', preview: '#10b981', tailwindClasses: 'bg-emerald-500, text-emerald-400, from-emerald-600 to-teal-600, bg-emerald-950, border-emerald-500/30' },
  { id: 'lavender', name: 'Lavender', primary: 'violet', accent: 'purple', preview: '#8b5cf6', tailwindClasses: 'bg-violet-500, text-violet-400, from-violet-600 to-purple-600, bg-violet-950, border-violet-500/30' },
  { id: 'crimson', name: 'Crimson', primary: 'rose', accent: 'red', preview: '#f43f5e', tailwindClasses: 'bg-rose-500, text-rose-400, from-rose-600 to-red-600, bg-rose-950, border-rose-500/30' },
  { id: 'amber', name: 'Amber', primary: 'amber', accent: 'yellow', preview: '#f59e0b', tailwindClasses: 'bg-amber-500, text-amber-400, from-amber-600 to-yellow-600, bg-amber-950, border-amber-500/30' },
  { id: 'sapphire', name: 'Sapphire', primary: 'blue', accent: 'indigo', preview: '#3b82f6', tailwindClasses: 'bg-blue-500, text-blue-400, from-blue-600 to-indigo-600, bg-blue-950, border-blue-500/30' },
  { id: 'pink', name: 'Pink', primary: 'pink', accent: 'fuchsia', preview: '#ec4899', tailwindClasses: 'bg-pink-500, text-pink-400, from-pink-600 to-fuchsia-600, bg-pink-950, border-pink-500/30' },
  { id: 'lime', name: 'Lime', primary: 'lime', accent: 'green', preview: '#84cc16', tailwindClasses: 'bg-lime-500, text-lime-400, from-lime-600 to-green-600, bg-lime-950, border-lime-500/30' },
  { id: 'slate', name: 'Slate', primary: 'slate', accent: 'zinc', preview: '#64748b', tailwindClasses: 'bg-slate-500, text-slate-300, from-slate-600 to-zinc-600, bg-slate-900, border-slate-500/30' },
  { id: 'coral', name: 'Coral', primary: 'red', accent: 'orange', preview: '#ef4444', tailwindClasses: 'bg-red-500, text-red-400, from-red-500 to-orange-500, bg-red-950, border-red-500/30' },
  { id: 'sky', name: 'Sky', primary: 'sky', accent: 'cyan', preview: '#0ea5e9', tailwindClasses: 'bg-sky-500, text-sky-400, from-sky-600 to-cyan-600, bg-sky-950, border-sky-500/30' },
]

export function getRandomPalette(): ColorPalette {
  return COLOR_PALETTES[Math.floor(Math.random() * COLOR_PALETTES.length)]
}

export function getPaletteById(id: string): ColorPalette | undefined {
  return COLOR_PALETTES.find((p) => p.id === id)
}

const BASE_SYSTEM_PROMPT = `You are a senior UI component prompt engineer for Softset. You create structured prompts that produce identical React + Tailwind CSS components when given to ANY large language model.

PROMPT STRUCTURE REQUIREMENTS:
Every prompt you create MUST have these sections:
1. **Overview** — What the component is, its purpose, and visual style
2. **Requirements** — Exact list of elements, interactions, and states
3. **Styling Specification** — Exact Tailwind classes for every element:
   - Colors: use specific Tailwind classes (bg-zinc-900, text-blue-400, NOT "dark background")
   - Spacing: exact padding/margin values (p-6, gap-4, NOT "some spacing")
   - Typography: font sizes, weights, line heights (text-lg font-semibold)
   - Borders: exact border classes (border border-white/10 rounded-xl)
   - Responsive: include sm:, md:, lg: breakpoints
   - Dark mode: component must look great on dark backgrounds (#09090b)
4. **Expected Output** — The COMPLETE React component code that this prompt should produce. This is the reference implementation.

ORIGINALITY RULES — CRITICAL:
- You will be given reference examples below. These show the QUALITY LEVEL and LEVEL OF DETAIL expected.
- NEVER reproduce these examples. Do not copy their layouts, color schemes, text content, or structure.
- Create ORIGINAL designs with your own creative vision — unique color palettes, novel layouts, fresh interactions.
- The references are purely for quality calibration: match their specificity (exact Tailwind classes, realistic data, complete code) but invent entirely new components.
- Think of yourself as a designer who studied great work but creates their own original portfolio.

COMPONENT RULES:
- Single-file React functional component with default export
- Tailwind CSS utility classes ONLY — no custom CSS, no CSS modules
- Import only from: react, lucide-react (for icons)
- Self-contained — no props required, no external state
- Must render correctly at 1920x1080 on a dark background
- Must be responsive (mobile-first with breakpoints)
- Include realistic mock data inline (names, numbers, text)
- Make it visually impressive — gradients, animations, hover effects
- Be creative with color choices — don't default to purple/indigo every time

OUTPUT FORMAT — respond with valid JSON only (no markdown fences):
{
  "title": "Component Name (e.g., Glassmorphism Login Card)",
  "description": "One concise sentence describing the component",
  "content": "The full structured prompt text (400-800 words) with all 4 sections",
  "previewCode": "The complete React+Tailwind component code that renders the component",
  "tags": ["tailwind", "react", "dark-mode"],
  "categorySlug": "the-category-slug"
}`

export const AGENT_CONFIGS: AgentConfig[] = [
  {
    id: 'landing-page-agent',
    name: 'Landing Page Agent',
    description: 'Hero sections, feature grids, CTAs, testimonial blocks, pricing sections',
    categorySlug: 'landing-pages',
    referenceFiles: ['prompt-examples.md', 'prompt-examples-clients.md', 'prompt-examples-dashboard.md'],
    specialization: `You specialize in LANDING PAGE components. Focus on:
- Hero sections with gradient backgrounds, animated elements, compelling headlines
- Feature grids with icons, descriptions, and visual hierarchy
- Call-to-action blocks with buttons, social proof, and urgency
- Testimonial sections with avatars, quotes, and company logos
- Stats/metrics sections with animated counters
Always use min-h-screen layouts. Include floating decorative elements (blurred orbs, grid overlays). Use bold typography (text-5xl to text-7xl for headlines). The categorySlug MUST be "landing-pages".`,
    exampleTopics: [
      'SaaS product hero with animated gradient and feature badges',
      'Developer tool landing with code snippet preview and terminal aesthetic',
      'AI startup hero with glowing neural network visualization',
      'Startup feature grid with animated icons and hover cards',
      'Social proof section with animated avatar stack and metrics',
      'Product comparison hero with split-screen design',
    ],
  },
  {
    id: 'form-agent',
    name: 'Form & Input Agent',
    description: 'Login forms, signup flows, checkout forms, search inputs, multi-step wizards',
    categorySlug: 'forms',
    referenceFiles: ['prompt-examples.md', 'prompt-examples-toggles.md'],
    specialization: `You specialize in FORM and INPUT components. Focus on:
- Login/signup cards with glassmorphism, social auth buttons, and validation states
- Multi-step forms with progress indicators and smooth transitions
- Search bars with autocomplete dropdowns and filter chips
- Contact forms with floating labels and inline validation
- File upload zones with drag-and-drop visual feedback
Always include useState for form state. Show focus rings, error states, and hover effects. Use proper form semantics (labels, placeholders). The categorySlug MUST be "forms" or "authentication" or "checkout" depending on the component.`,
    exampleTopics: [
      'Glassmorphism signup with password strength meter',
      'Multi-step onboarding wizard with avatar upload',
      'Command palette search with keyboard shortcuts display',
      'Credit card payment form with card brand detection',
      'Contact form with floating labels and map background',
      'File upload dropzone with progress bars and preview thumbnails',
    ],
  },
  {
    id: 'dashboard-agent',
    name: 'Dashboard Agent',
    description: 'Analytics dashboards, stat cards, charts, activity feeds, data visualizations',
    categorySlug: 'dashboards',
    referenceFiles: ['prompt-examples.md', 'prompt-examples-dashboard.md'],
    specialization: `You specialize in DASHBOARD and ANALYTICS components. Focus on:
- Stat card grids with KPI values, trend indicators (up/down arrows), and sparklines
- SVG-based charts (line charts with polyline, bar charts with rect, donut charts with circle)
- Activity feeds with timestamps, avatars, and action descriptions
- Metric comparison tables with progress bars and percentage changes
- Real-time-feeling data with realistic business metrics
Use bg-slate-950 backgrounds. Include SVG charts (no external charting libraries). Use realistic data: revenue numbers, user counts, conversion rates. The categorySlug MUST be "dashboards".`,
    exampleTopics: [
      'E-commerce analytics dashboard with revenue chart and top products',
      'SaaS metrics dashboard with MRR, churn, and customer growth',
      'Social media analytics with engagement rates and follower trends',
      'DevOps monitoring dashboard with uptime and error rates',
      'Financial overview with portfolio allocation donut chart',
      'Marketing campaign dashboard with conversion funnel',
    ],
  },
  {
    id: 'card-agent',
    name: 'Card & Tile Agent',
    description: 'Profile cards, pricing cards, product cards, blog cards, team grids',
    categorySlug: 'cards',
    referenceFiles: ['prompt-examples.md', 'prompt-examples-borders.md', 'prompt-examples-clients.md'],
    specialization: `You specialize in CARD and TILE components. Focus on:
- Profile cards with avatar banners, stats rows, social links, and hover lift effects
- Pricing cards with tier comparison, popular badge, toggle (monthly/yearly)
- Product cards with image placeholders, ratings, price, and add-to-cart
- Blog/article cards with cover image area, author, date, and reading time
- Team member grids with role badges and unique gradient accents per card
Always create multiple cards in a grid layout (grid-cols-1 md:grid-cols-2 lg:grid-cols-3). Each card should have hover:scale-[1.02] or hover:-translate-y-1 transitions. Use rounded-2xl with border border-slate-800. The categorySlug MUST be "cards".`,
    exampleTopics: [
      'NFT marketplace card grid with bid prices and countdown timers',
      'Team page with role-based gradient cards and social links',
      'SaaS pricing table with feature comparison and popular highlight',
      'Recipe cards with difficulty badges, cook time, and rating stars',
      'Portfolio project cards with tech stack tags and live preview links',
      'Podcast episode cards with play button, duration, and waveform',
    ],
  },
  {
    id: 'navigation-agent',
    name: 'Navigation Agent',
    description: 'Sidebars, navbars, headers, footers, breadcrumbs, tab bars',
    categorySlug: 'headers',
    referenceFiles: ['prompt-examples.md', 'prompt-examples-borders.md'],
    specialization: `You specialize in NAVIGATION components. Focus on:
- Collapsible sidebars with grouped nav items, active indicators, and user avatars
- Top navigation bars with logo, links, search, and profile dropdown
- Footer layouts with multi-column links, newsletter signup, and social icons
- Breadcrumb trails with separators and current page highlight
- Tab bar navigation with animated indicator and badge counts
Include useState for active/collapsed states. Use border-r or border-b dividers. Active states should use indigo/purple accents. Include realistic nav item labels (Dashboard, Analytics, Settings, etc). The categorySlug MUST be "headers" or "footers".`,
    exampleTopics: [
      'Admin sidebar with collapsible groups and notification badges',
      'Mega menu navbar with dropdown panels and featured content',
      'Documentation sidebar with nested sections and search',
      'Mobile bottom tab bar with animated active indicator',
      'Dashboard header with breadcrumbs, search, and user menu',
      'Footer with newsletter form, sitemap columns, and dark theme',
    ],
  },
  {
    id: 'feedback-agent',
    name: 'Feedback & Overlay Agent',
    description: 'Toasts, modals, dialogs, alerts, notifications, tooltips, popovers',
    categorySlug: 'modals',
    referenceFiles: ['prompt-examples.md', 'prompt-examples-tooltips.md'],
    specialization: `You specialize in FEEDBACK and OVERLAY components. Focus on:
- Toast notification systems with success/error/warning/info variants, auto-dismiss progress bars
- Modal dialogs with backdrop blur, close button, and action buttons
- Alert banners with icons, dismiss buttons, and color-coded severity
- Notification centers with read/unread states and grouping by date
- Confirmation dialogs with destructive action warnings
Show multiple variants in one component (e.g., 4 toast types stacked). Use position fixed/absolute for overlays. Include animation via transition classes. Use emerald for success, red for error, amber for warning, blue for info. The categorySlug MUST be "modals".`,
    exampleTopics: [
      'Toast notification stack with progress bars and action buttons',
      'Cookie consent banner with preference toggles',
      'Notification center dropdown with mark-all-read and categories',
      'Delete confirmation modal with typing confirmation input',
      'Alert banner system with expandable details and dismiss',
      'Onboarding tooltip tour with step indicators and highlights',
    ],
  },
]

export function getAgentConfig(agentId: string): AgentConfig | undefined {
  return AGENT_CONFIGS.find((a) => a.id === agentId)
}

/**
 * Loads reference examples from the prompt-examples-*.md files.
 * Truncates to stay within token budget (~4000 chars per file).
 */
export function loadReferenceExamples(config: AgentConfig): string {
  const projectRoot = process.cwd()
  const sections: string[] = []

  for (const file of config.referenceFiles) {
    const filePath = join(projectRoot, file)
    if (!existsSync(filePath)) continue

    try {
      let content = readFileSync(filePath, 'utf-8').trim()
      if (!content) continue

      // Truncate long files to ~4000 chars to stay within token budget
      if (content.length > 4000) {
        content = content.slice(0, 4000) + '\n\n[... truncated for brevity]'
      }

      sections.push(`--- Reference from ${file} ---\n${content}`)
    } catch {
      continue
    }
  }

  if (sections.length === 0) return ''

  return `\n\nREFERENCE EXAMPLES (for quality calibration ONLY — never copy these):
${sections.join('\n\n')}`
}

export function buildSystemPrompt(config: AgentConfig, palette?: ColorPalette): string {
  const references = loadReferenceExamples(config)
  const colorPalette = palette ?? getRandomPalette()

  const colorDirective = `

COLOR PALETTE — you MUST use this palette for this component:
- Palette: "${colorPalette.name}" (id: ${colorPalette.id})
- Primary color: ${colorPalette.primary} (use Tailwind ${colorPalette.primary}-* classes)
- Accent color: ${colorPalette.accent} (use Tailwind ${colorPalette.accent}-* classes)
- Example classes: ${colorPalette.tailwindClasses}
- Use these colors for buttons, accents, gradients, borders, badges, and highlights
- Background should remain dark (#09090b or slate-950) — the palette colors are for accents and UI elements
- Include "colorPalette": "${colorPalette.id}" in your JSON output alongside the other fields`

  return `${BASE_SYSTEM_PROMPT}

SPECIALIZATION:
${config.specialization}${colorDirective}${references}`
}

export function getRandomTopic(config: AgentConfig): string {
  return config.exampleTopics[Math.floor(Math.random() * config.exampleTopics.length)]
}
