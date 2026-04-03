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

export function buildSystemPrompt(config: AgentConfig): string {
  const references = loadReferenceExamples(config)

  return `${BASE_SYSTEM_PROMPT}

SPECIALIZATION:
${config.specialization}${references}`
}

export function getRandomTopic(config: AgentConfig): string {
  return config.exampleTopics[Math.floor(Math.random() * config.exampleTopics.length)]
}
