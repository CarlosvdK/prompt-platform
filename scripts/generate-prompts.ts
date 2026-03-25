import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
  const args = process.argv.slice(2)
  const categoryFlag = args.indexOf('--category')
  const countFlag = args.indexOf('--count')

  const categorySlug = categoryFlag !== -1 ? args[categoryFlag + 1] : null
  const count = countFlag !== -1 ? parseInt(args[countFlag + 1], 10) : 3

  if (!categorySlug) {
    console.error('Usage: pnpm generate:prompts -- --category <slug> --count <n>')
    console.error('Available categories:')
    const cats = await db.category.findMany({ orderBy: { sortOrder: 'asc' } })
    cats.forEach((c) => console.error(`  ${c.slug} - ${c.name}`))
    process.exit(1)
  }

  const category = await db.category.findUnique({ where: { slug: categorySlug } })
  if (!category) {
    console.error(`Category "${categorySlug}" not found`)
    process.exit(1)
  }

  // Dynamically import the AI provider factory
  const { getAIProvider } = await import('../src/adapters/ai/index')

  const aiProvider = getAIProvider()
  console.log(
    `\nGenerating ${count} prompts for "${category.name}" using ${aiProvider.name} provider...\n`,
  )

  const componentVariations = getVariationsForCategory(categorySlug)

  for (let i = 0; i < count; i++) {
    const variation = componentVariations[i % componentVariations.length]
    console.log(`[${i + 1}/${count}] Generating: ${variation}...`)

    try {
      const result = await aiProvider.generateCompletion({
        systemPrompt: UI_GENERATION_SYSTEM_PROMPT,
        prompt: `Create a UI component prompt for: "${variation}" in the "${category.name}" category. The component should use React and Tailwind CSS. Make it visually impressive and production-ready.`,
        maxTokens: 4096,
        temperature: 0.8,
      })

      let parsed
      try {
        // Extract JSON from response (handle markdown code blocks)
        const jsonStr = result.content
          .replace(/```json\n?/g, '')
          .replace(/```\n?/g, '')
          .trim()
        parsed = JSON.parse(jsonStr)
      } catch {
        console.error(`  Failed to parse JSON response, skipping`)
        continue
      }

      // Create agent run
      const run = await db.agentRun.create({
        data: {
          skill: 'ui-component-generation',
          input: { category: categorySlug, variation } as any,
          status: 'COMPLETED',
          startedAt: new Date(),
          completedAt: new Date(),
          output: { tokens: result.usage } as any,
        },
      })

      // Create prompt draft
      const draft = await db.promptDraft.create({
        data: {
          agentRunId: run.id,
          title: parsed.title,
          description: parsed.description,
          content: parsed.content,
          type: 'CODE',
          metadata: {
            ...(parsed.previewCode ? { previewCode: parsed.previewCode } : {}),
            ...(parsed.tags ? { tags: parsed.tags } : {}),
            categorySlug: categorySlug,
          } as any,
        },
      })

      console.log(`  Created draft: "${parsed.title}" (${draft.id})`)
    } catch (err: any) {
      console.error(`  Error: ${err.message}`)
    }
  }

  console.log('\nDone! Drafts are ready for review in the admin panel.')
  await db.$disconnect()
}

const UI_GENERATION_SYSTEM_PROMPT = `You are a UI component prompt engineer for Softset. Your job is to create prompts that, when given to ANY large language model (GPT-4, Claude, Gemini, Llama), produce identical React + Tailwind CSS components.

Rules for the prompts you create:
1. Each prompt must produce a single-file React component
2. Must use Tailwind CSS utility classes for ALL styling — no custom CSS
3. Must specify EXACT colors using Tailwind classes (e.g., bg-zinc-900, text-blue-400)
4. Must specify EXACT spacing, dimensions, and typography
5. Must include all required imports (React, icons from lucide-react if needed)
6. Must be a default export function component
7. The component must be self-contained — no external dependencies beyond React, Tailwind, and lucide-react
8. Include the complete expected output code as a reference example within the prompt

You MUST respond with valid JSON in this exact format:
{
  "title": "Component Name",
  "description": "One sentence describing what this component is and does",
  "content": "The full detailed prompt (300-600 words) with exact specifications that a user pastes into any LLM",
  "previewCode": "The complete React+Tailwind component code that the prompt should produce"
}`

function getVariationsForCategory(slug: string): string[] {
  const variations: Record<string, string[]> = {
    'landing-pages': [
      'Animated gradient hero with floating orbs',
      'SaaS product hero with screenshot mockup',
      'Dark mode landing with particle background',
      'Minimal hero with split layout and image',
      'Startup landing page with feature grid',
      'App download hero with phone mockup',
      'Newsletter landing with glassmorphism card',
      'Portfolio hero with animated text reveal',
      'Agency landing with scroll-triggered sections',
      'E-commerce hero with product carousel',
    ],
    headers: [
      'Transparent navbar with blur on scroll',
      'Sidebar navigation with collapsible sections',
      'Mega menu header with dropdown panels',
      'Minimal topbar with centered logo',
      'Dashboard header with search and notifications',
      'Mobile-first hamburger navigation',
      'Breadcrumb navigation with icons',
      'Sticky header with progress indicator',
      'Split navigation with CTA button',
      'Dark glassmorphism navbar',
    ],
    cards: [
      'Product card with hover zoom image',
      'Team member profile card',
      'Stat card with animated counter',
      'Blog post card with category badge',
      'Testimonial card with avatar and rating',
      'Feature card with icon and description',
      'Pricing card with gradient border',
      'App download card with QR code',
      'Social media post card',
      'Notification card with actions',
    ],
    forms: [
      'Multi-step form with progress bar',
      'Floating label input form',
      'Search bar with filter dropdowns',
      'Contact form with map placeholder',
      'Newsletter signup with inline validation',
      'File upload form with drag and drop',
      'Survey form with radio and checkbox groups',
      'Settings form with toggle switches',
      'Comment form with rich text toolbar',
      'Registration form with password strength',
    ],
    authentication: [
      'Glassmorphism login with social buttons',
      'Split screen login with illustration',
      'OTP verification code input',
      'Password reset flow with email input',
      'Magic link login form',
      'Sign up with avatar upload',
      'Two-factor authentication setup',
      'Login with biometric icon prompt',
      'Onboarding flow with step indicators',
      'Account selection screen',
    ],
    checkout: [
      'Three-tier pricing comparison table',
      'Shopping cart with quantity controls',
      'Payment form with card preview',
      'Subscription plan selector with toggle',
      'Order summary with promo code input',
      'Checkout stepper with address form',
      'Invoice template with line items',
      'Donation amount selector with presets',
      'Upgrade plan modal with feature comparison',
      'Free trial signup with plan details',
    ],
    animations: [
      'Skeleton loading screen for dashboard',
      'Animated gradient button with shimmer',
      'Scroll-triggered fade-in cards',
      'Typing text animation component',
      'Pulsing notification dot badge',
      'Spinning loader with progress ring',
      'Staggered list item entrance animation',
      'Hover card with 3D tilt effect',
      'Animated counter with easing',
      'Morphing hamburger to close icon',
    ],
    backgrounds: [
      'Animated mesh gradient background',
      'Dot grid pattern with radial fade',
      'Aurora borealis gradient effect',
      'Geometric pattern with hover reveal',
      'Noise texture overlay background',
      'Gradient orbs floating animation',
      'Grid lines background with glow',
      'Wave pattern bottom divider',
      'Starfield parallax background',
      'Blurred color blobs background',
    ],
    footers: [
      'Multi-column footer with newsletter',
      'Minimal footer with social icons',
      'Dark gradient footer with sitemap',
      'Footer with language and theme toggle',
      'Centered footer with logo and links',
      'Footer with app download badges',
      'Sticky bottom bar with CTA',
      'Footer with recent blog posts',
      'Large footer with contact form',
      'Animated footer with wave divider',
    ],
    dashboards: [
      'Analytics dashboard with stat cards',
      'Admin sidebar layout with header',
      'KPI dashboard with mini charts',
      'Project management board layout',
      'User activity feed with timeline',
      'Settings page with section tabs',
      'Profile page with cover photo',
      'Notification center with filters',
      'File manager grid and list view',
      'Calendar view with event cards',
    ],
    modals: [
      'Confirmation dialog with actions',
      'Image lightbox with gallery',
      'Command palette search modal',
      'Cookie consent banner',
      'Toast notification stack',
      'Bottom sheet with drag handle',
      'Full-screen mobile menu overlay',
      'Share dialog with copy link',
      'Feedback form modal',
      'Announcement popup with dismiss',
    ],
    tables: [
      'Data table with sort and filter',
      'Kanban board with drag columns',
      'Timeline list with date groups',
      'Leaderboard table with rank badges',
      'Transaction history table',
      'User management table with actions',
      'Comparison table with checkmarks',
      'Inventory list with search',
      'Chat message list with grouping',
      'Expandable row detail table',
    ],
  }
  return variations[slug] ?? ['Custom UI component']
}

main().catch(console.error)
