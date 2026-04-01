import {
  PrismaClient,
  UserRole,
  PromptStatus,
  PromptType,
  ReviewAction,
} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // ── Clear all existing data (foreign-key-safe order) ─────────────────
  await prisma.auditLog.deleteMany()
  await prisma.adEvent.deleteMany()
  await prisma.unlockEvent.deleteMany()
  await prisma.reviewDecision.deleteMany()
  await prisma.promptDraft.deleteMany()
  await prisma.agentRun.deleteMany()
  await prisma.promptPreview.deleteMany()
  await prisma.promptVersion.deleteMany()
  await prisma.promptTag.deleteMany()
  await prisma.prompt.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.category.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.user.deleteMany()

  console.log('  Cleared existing data')

  // ── Users ────────────────────────────────────────────────────────────

  const admin = await prisma.user.create({
    data: {
      email: 'admin@softset.dev',
      name: 'Sarah Chen',
      role: UserRole.ADMIN,
      emailVerified: new Date('2025-12-01'),
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    },
  })

  const reviewer = await prisma.user.create({
    data: {
      email: 'reviewer@softset.dev',
      name: 'Marcus Rivera',
      role: UserRole.REVIEWER,
      emailVerified: new Date('2025-12-15'),
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
    },
  })

  const user = await prisma.user.create({
    data: {
      email: 'user@softset.dev',
      name: 'Jamie Okoro',
      role: UserRole.USER,
      emailVerified: new Date('2026-01-10'),
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jamie',
    },
  })

  console.log('  Created 3 users')

  // ── Categories ───────────────────────────────────────────────────────

  const categoryData = [
    { name: 'Landing Pages', slug: 'landing-pages', description: 'Hero sections, full landing page layouts, and above-the-fold designs', icon: 'Layout', sortOrder: 1 },
    { name: 'Headers & Navigation', slug: 'headers', description: 'Navbars, sidebars, breadcrumbs, and menu components', icon: 'PanelTop', sortOrder: 2 },
    { name: 'Cards & Tiles', slug: 'cards', description: 'Product cards, profile cards, stat cards, and pricing cards', icon: 'Square', sortOrder: 3 },
    { name: 'Forms & Inputs', slug: 'forms', description: 'Login forms, signup forms, contact forms, and search bars', icon: 'FormInput', sortOrder: 4 },
    { name: 'Authentication', slug: 'authentication', description: 'Login pages, signup pages, password reset, and OTP flows', icon: 'Lock', sortOrder: 5 },
    { name: 'Checkout & Payments', slug: 'checkout', description: 'Checkout flows, pricing tables, and cart components', icon: 'CreditCard', sortOrder: 6 },
    { name: 'Animations & Effects', slug: 'animations', description: 'Loading spinners, transitions, scroll effects, and hover animations', icon: 'Sparkles', sortOrder: 7 },
    { name: 'Backgrounds & Patterns', slug: 'backgrounds', description: 'Gradient backgrounds, mesh patterns, particles, and decorative elements', icon: 'Paintbrush', sortOrder: 8 },
    { name: 'Footers', slug: 'footers', description: 'Site footers, newsletter sections, and link grids', icon: 'PanelBottom', sortOrder: 9 },
    { name: 'Dashboards', slug: 'dashboards', description: 'Admin panels, stat dashboards, and chart layouts', icon: 'LayoutDashboard', sortOrder: 10 },
    { name: 'Modals & Overlays', slug: 'modals', description: 'Dialog boxes, bottom sheets, toasts, and notifications', icon: 'Layers', sortOrder: 11 },
    { name: 'Tables & Lists', slug: 'tables', description: 'Data tables, list views, and kanban boards', icon: 'Table', sortOrder: 12 },
  ]

  const categories: Record<string, { id: string }> = {}
  for (const c of categoryData) {
    categories[c.slug] = await prisma.category.create({ data: c })
  }

  console.log('  Created 12 categories')

  // ── Tags ─────────────────────────────────────────────────────────────

  const tagData = [
    { name: 'Tailwind', slug: 'tailwind' },
    { name: 'React', slug: 'react' },
    { name: 'Next.js', slug: 'nextjs' },
    { name: 'Responsive', slug: 'responsive' },
    { name: 'Dark Mode', slug: 'dark-mode' },
    { name: 'Animated', slug: 'animated' },
    { name: 'Minimal', slug: 'minimal' },
    { name: 'Glassmorphism', slug: 'glassmorphism' },
    { name: 'Gradient', slug: 'gradient' },
    { name: 'shadcn/ui', slug: 'shadcn' },
    { name: 'Framer Motion', slug: 'framer-motion' },
    { name: 'Mobile First', slug: 'mobile-first' },
    { name: 'Accessible', slug: 'accessible' },
    { name: 'Skeleton', slug: 'skeleton' },
    { name: 'Loading State', slug: 'loading-state' },
  ]

  const tags: Record<string, { id: string }> = {}
  for (const t of tagData) {
    tags[t.slug] = await prisma.tag.create({ data: t })
  }

  console.log(`  Created ${tagData.length} tags`)

  // ── Prompt Content ───────────────────────────────────────────────────

  const glassmorphismLoginContent = `Create a React component called GlassmorphismLoginCard that renders a glassmorphism-style login card using only Tailwind CSS utility classes. The component must be a single self-contained file that can be dropped into any React + Tailwind project and work immediately.

## Layout & Container

The outermost wrapper should be a full-screen centered container using min-h-screen, flex, items-center, and justify-center. Set the background to a rich dark gradient: bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900. Add two decorative blurred circles behind the card for visual depth:
- A 72x72 (w-72 h-72) rounded-full div with bg-purple-500 opacity-30 blur-3xl positioned absolutely in the top-left area.
- A 72x72 rounded-full div with bg-blue-500 opacity-30 blur-3xl positioned absolutely in the bottom-right area.

## The Card

The card itself should be a div with the following exact Tailwind classes for the glassmorphism effect: bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl. Set width to w-full max-w-md and padding to p-8. The card must sit above the decorative circles using relative z-10.

## Card Header

At the top of the card, render:
1. A small lock icon centered above the title. Use a 12x12 div with rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center, containing a white SVG lock icon (20x20). Center this div with mx-auto mb-6.
2. An h2 heading "Welcome back" using text-2xl font-bold text-white text-center.
3. A paragraph "Sign in to your account" using text-sm text-gray-400 text-center mt-2 mb-8.

## Form Fields

Render a form with two input groups, each wrapped in a div with mb-5:

**Email field:**
- A label element with text-sm font-medium text-gray-300 mb-1 block, text "Email address".
- An input with type="email", placeholder="you@example.com", and these exact classes: w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200.

**Password field:**
- A label with the same styling, text "Password".
- An input with type="password", placeholder="Enter your password", same classes as the email input.

Below the password field, add a flex justify-end mb-6 div containing an anchor tag "Forgot password?" with text-sm text-purple-400 hover:text-purple-300 transition-colors.

## Sign In Button

A full-width submit button with text "Sign In" and these classes: w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98].

## Divider

Below the button, render a divider row: flex items-center my-6 with two flex-1 h-px bg-white/20 divs and a span "or continue with" in text-xs text-gray-500 mx-4.

## Social Login Buttons

A flex gap-3 row containing three equally sized buttons (flex-1). Each button should have: py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-2 text-white text-sm. The three buttons are:
1. Google (with a simple G letter or SVG icon)
2. GitHub (with the GitHub SVG icon)
3. Apple (with the Apple icon)

## Footer

At the bottom, a paragraph with text-center text-sm text-gray-500 mt-8: "Don't have an account?" followed by a span or anchor "Sign up" with text-purple-400 hover:text-purple-300 cursor-pointer font-medium.

## Component Requirements

- Export the component as the default export.
- Use React.useState hooks for email and password state.
- The form should have an onSubmit handler that prevents default and logs the credentials to console.
- All interactive elements must have appropriate hover and focus states.
- The entire card must look polished at mobile widths (it should fill the screen with some margin on phones).
- Do NOT use any external component libraries — only React and Tailwind CSS utility classes.`

  const gradientHeroContent = `Create a React component called GradientHeroSection that renders a visually striking hero section with an animated gradient background. Use only React, Tailwind CSS classes, and inline CSS keyframe animations (injected via a style tag or inline styles). The component must be completely self-contained in a single file.

## Animated Background

The hero section wrapper uses min-h-screen w-full relative overflow-hidden. The background should be a continuously animating gradient using a div with absolute inset-0 and a CSS animation. Define a keyframe animation called "gradient-shift" that smoothly rotates through four color stops over 8 seconds, infinitely looping:

- 0%: background-position at 0% 50%
- 25%: background-position at 100% 50%
- 50%: background-position at 100% 0%
- 100%: background-position at 0% 50%

Apply background-size: 400% 400% and use the gradient: linear-gradient(135deg, #0f0c29, #302b63, #24243e, #0f0c29, #1a1a2e, #16213e, #0f3460, #533483). Inject this animation via a <style> tag inside the component.

On top of the gradient, add a subtle grid overlay: an absolute inset-0 div with opacity-10 and a CSS background-image of a repeating grid pattern using linear-gradient:
- background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
- background-size: 60px 60px

Also add two floating blurred orbs for depth:
- A w-96 h-96 rounded-full with bg-purple-600/20 blur-3xl, absolutely positioned at top-1/4 -left-48, with a slow 6s floating animation (translateY -20px to 20px).
- A w-80 h-80 rounded-full with bg-blue-600/20 blur-3xl, absolutely positioned at bottom-1/4 -right-40, with the same floating animation but a 1s delay.

## Content Container

Center the content with relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center.

### Badge / Pill

At the top, render a small pill-shaped badge: an inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 element. Inside, place a span with a pulsing green dot (w-2 h-2 rounded-full bg-green-400 with animate-pulse) and text "Now in Public Beta" using text-sm text-gray-300.

### Heading

An h1 element using text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl. The text should be split across multiple spans:
- First line "Build stunning" in text-white.
- Second line "interfaces" with a gradient text effect: text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400. This gradient span should also have the gradient-shift animation applied to the background for a shimmering text effect.
- Third line "at lightning speed" in text-white.

### Subtitle

A p element with text-lg sm:text-xl text-gray-400 max-w-2xl mt-6 leading-relaxed. Text: "The modern UI toolkit that helps developers and designers ship beautiful, production-ready components in minutes instead of hours."

### CTA Buttons

A flex flex-col sm:flex-row gap-4 mt-10 div with two buttons:

1. Primary CTA: "Get Started Free" with an arrow icon. Classes: group px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-lg shadow-2xl shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-2. The arrow icon should have group-hover:translate-x-1 transition-transform.

2. Secondary CTA: "View Components" with a play/demo icon. Classes: px-8 py-4 rounded-xl bg-white/5 border border-white/20 backdrop-blur-sm hover:bg-white/10 text-white font-semibold text-lg transition-all duration-300 flex items-center gap-2.

### Social Proof

Below the CTAs, add a mt-16 flex flex-col items-center gap-4 section:
- A row of 5 overlapping avatar circles: each w-10 h-10 rounded-full border-2 border-slate-900 with -ml-3 on all except the first. Use bg-gradient-to-br with different color pairs for each (purple/blue, pink/purple, blue/cyan, green/emerald, orange/red).
- Below the avatars, text "Trusted by 2,000+ developers" in text-sm text-gray-500.
- A row of 5 star icons (yellow, w-4 h-4) representing a 5-star rating.

## Responsive Behavior

- On mobile (default): single-column CTAs, smaller heading text.
- On sm and up: side-by-side CTAs, larger heading.
- On lg and up: maximum heading size, comfortable spacing.

## Component Requirements

- Export as default.
- No external dependencies beyond React and Tailwind.
- All animations must use CSS keyframes injected via a <style> tag rendered inside the component.
- Must look complete and professional when rendered in isolation.`

  const pricingTableContent = `Create a React component called MinimalPricingTable that renders a clean, minimal three-tier pricing table with a monthly/yearly toggle. Use only React and Tailwind CSS. The component must be fully self-contained in a single file.

## Overall Layout

The wrapper should use min-h-screen bg-white dark:bg-slate-950 py-20 px-4 sm:px-6 lg:px-8. All colors must support both light and dark mode using Tailwind's dark: prefix throughout.

## Header Section

Center a header block with text-center max-w-3xl mx-auto mb-16:
1. A small uppercase tracking label: text-sm font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-4. Text: "Pricing".
2. A heading h2: text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white. Text: "Simple, transparent pricing".
3. A subtitle p: text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto. Text: "Choose the plan that fits your needs. Upgrade or downgrade at any time."

## Billing Toggle

Below the header, render a centered toggle: flex items-center justify-center gap-3 mb-12.
- A span "Monthly" with text-sm font-medium, colored text-slate-900 dark:text-white when monthly is active, text-slate-500 dark:text-slate-400 otherwise.
- A toggle button: w-14 h-7 rounded-full with bg-purple-600 when yearly is selected, bg-slate-300 dark:bg-slate-700 otherwise. Inside, a w-5 h-5 rounded-full bg-white shadow-sm circle that translates right (translate-x-7) when yearly is active, translate-x-1 when monthly. Use transition-all duration-300.
- A span "Yearly" with matching conditional text color.
- A small "Save 20%" badge next to "Yearly": ml-2 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium. Only show when yearly is NOT active (to entice switching) or always show it as a static indicator.

Use React.useState to manage the billing period toggle.

## Pricing Cards Grid

A grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto containing three plan cards:

### Free Plan
- Card wrapper: rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 relative.
- Plan name: text-lg font-semibold text-slate-900 dark:text-white. Text: "Free".
- Description: text-sm text-slate-500 dark:text-slate-400 mt-2. Text: "Perfect for trying things out."
- Price: mt-6 flex items-baseline gap-1. The dollar amount "$0" in text-4xl font-bold text-slate-900 dark:text-white, and "/month" in text-sm text-slate-500.
- CTA button: mt-8 w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors. Text: "Get Started".
- Feature list: mt-8 space-y-4. Each feature has a checkmark icon in text-slate-400 and text-sm text-slate-600 dark:text-slate-400. Features: "Up to 3 projects", "Basic components", "Community support", "1 GB storage".

### Pro Plan (Highlighted / Popular)
- Card wrapper: rounded-2xl border-2 border-purple-600 bg-white dark:bg-slate-900 p-8 relative shadow-xl shadow-purple-500/10 scale-105 on md screens (md:scale-105).
- A "Popular" badge absolutely positioned: absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold shadow-lg.
- Plan name: "Pro" — same text style as Free.
- Description: "For professionals and small teams."
- Price: "$29" when monthly, "$23" when yearly (calculated from $276/year). Same text-4xl font-bold treatment, with "/month" beside it. When yearly is active, show a small line-through original price: a span "$29" with line-through text-slate-400 text-lg mr-2 before the "$23".
- CTA button: mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all duration-200. Text: "Start Free Trial".
- Feature list with checkmarks in text-purple-500: "Everything in Free", "Unlimited projects", "Premium components", "Priority support", "10 GB storage", "Custom themes", "Analytics dashboard".

### Enterprise Plan
- Card wrapper: same as Free plan styling.
- Plan name: "Enterprise".
- Description: "For large teams and organizations."
- Price: Display "Custom" in text-4xl font-bold text-slate-900 dark:text-white instead of a dollar amount. Below it, text-sm text-slate-500 "Tailored to your needs".
- CTA button: same style as Free plan. Text: "Contact Sales".
- Feature list: "Everything in Pro", "Unlimited storage", "Dedicated support", "Custom integrations", "SLA guarantee", "SSO & SAML", "Onboarding assistance", "Custom contracts".

## Feature Comparison Section (Optional Bottom Section)

Below the cards, add a mt-20 text-center section:
- A text-sm text-slate-500 dark:text-slate-400: "All plans include SSL, 99.9% uptime, and GDPR compliance."

## Component Requirements

- Export as default.
- Use React.useState for the monthly/yearly toggle.
- All prices must react to the toggle (Free stays $0, Pro switches between $29 and $23, Enterprise stays "Custom").
- Every color must have a dark: variant so the component works in both light and dark mode.
- The Pro card must be visually elevated with the border-2 border-purple-600, shadow, and "Popular" badge.
- Responsive: cards stack on mobile, 3-column grid on md and up.
- No external dependencies — React and Tailwind only.`

  // ── Extra prompt content strings ─────────────────────────────────────

  const darkSidebarContent = `Create a React component called DarkSidebarNav that renders a collapsible dark sidebar navigation. Use only React and Tailwind CSS. The sidebar should be 240px wide when expanded and 64px when collapsed, with a smooth width transition (transition-all duration-300). The background is bg-slate-900 with a right border border-slate-800.

At the top, show a logo area: when expanded show a gradient text logo "Softset" in font-bold text-lg bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent; when collapsed show only a colored square icon. Next to the logo (expanded only) place a collapse toggle button (ChevronLeft icon) that switches to ChevronRight when collapsed.

Navigation items should be grouped in two sections separated by a thin divider. Section 1 "Main" includes: Dashboard (LayoutDashboard icon), Prompts (FileText), Reviews (ClipboardCheck), Analytics (BarChart2). Section 2 "Settings" includes: Team (Users), Settings (Settings), Help (HelpCircle).

Each nav item: flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer. Default state: text-slate-400 hover:text-white hover:bg-slate-800. Active state: text-white bg-slate-800 with a left border-l-2 border-purple-500. When collapsed, hide the label and show only the icon centered, with a tooltip (title attribute) showing the label. Use React.useState for collapsed state and active item. Export as default.`

  const toastSystemContent = `Create a React component called ToastSystem that demonstrates a notification toast system. Use only React and Tailwind CSS.

The component renders a full-page demo with a dark bg-slate-950 background. In the center, show a card with four trigger buttons: "Success", "Error", "Warning", "Info" — each styled with their respective color (green, red, amber, blue).

Toasts appear in the top-right corner (fixed top-5 right-5 flex flex-col gap-3 z-50). Each toast is 320px wide with rounded-xl bg-slate-800 border border-slate-700 shadow-2xl p-4. Inside: an icon on the left (CheckCircle for success, XCircle for error, AlertTriangle for warning, Info for info), a title in text-sm font-semibold text-white, a subtitle message in text-xs text-slate-400, and an X close button on the right. Each toast type has a colored left border (border-l-4) and matching icon color.

Toasts animate in from the right (translate-x-full to translate-x-0) using a CSS keyframe slide-in. They auto-dismiss after 4 seconds with a shrinking progress bar at the bottom of the toast showing time remaining. Support stacking up to 5 toasts; oldest dismisses first when limit exceeded. Use React.useState for the toast array, each item having id, type, title, message, and createdAt. Export as default.`

  const dataTableContent = `Create a React component called FilterableDataTable that renders a sortable, filterable data table. Use only React and Tailwind CSS.

Generate 20 rows of mock user data inline (no fetch): each row has id, name, email, role (Admin/Editor/Viewer), status (Active/Inactive), and joinDate.

Above the table: a search input on the left (searches name and email, bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500) and a role filter dropdown on the right (same styling, options: All Roles, Admin, Editor, Viewer).

The table wrapper uses overflow-x-auto rounded-xl border border-slate-800. The table itself: w-full text-sm. Header row: bg-slate-900 text-slate-400 text-xs uppercase tracking-wider. Each header cell is clickable to sort (show an up/down arrow icon — solid when active, gray outline otherwise). Rows alternate bg-slate-950 / bg-slate-900/50, hover:bg-slate-800/50. Columns: Name+Avatar (generated initials with colored bg), Email, Role (badge), Status (green dot for Active, gray for Inactive), Join Date, Actions (Edit and Delete icon buttons).

Below the table: pagination showing "Showing X-Y of Z results" and Prev/Next buttons. Show 8 rows per page. Use React.useState for search, filter, sort column, sort direction, and current page. All filtering/sorting is done client-side. Export as default.`

  const checkoutFormContent = `Create a React component called MultiStepCheckout that renders a 3-step checkout form. Use only React and Tailwind CSS. Background: bg-slate-950 min-h-screen, centered card max-w-lg mx-auto.

Step indicator at the top: three numbered circles connected by lines. Completed steps show a checkmark with bg-purple-600; current step shows the number with a ring ring-purple-500; future steps are bg-slate-800 text-slate-500.

Step 1 — Shipping: fields for First Name, Last Name (side by side), Email, Address, City, State + ZIP (side by side), Country dropdown. All inputs: bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:ring-2 focus:ring-purple-500.

Step 2 — Payment: Card number input with card brand detection (show Visa/MC icon when number starts with 4 or 5), Cardholder Name, Expiry and CVC side by side. Below, a secure payment badge row (lock icon + "256-bit SSL" text in text-xs text-slate-500).

Step 3 — Review: Show a summary of all entered data in read-only rows, plus a mock order total breakdown (Subtotal, Shipping, Tax, Total in bold).

Navigation: "Back" button (ghost style) and "Continue" / "Place Order" (purple gradient) buttons. Use React.useState for current step and form data object. Validate that all fields are non-empty before allowing next step; show inline error messages in text-red-400 text-xs. Export as default.`

  const meshBackgroundContent = `Create a React component called AnimatedMeshBackground that renders several variants of animated background effects for use behind UI sections. Use only React and Tailwind CSS with inline styles for keyframe animations injected via a <style> tag.

The component renders a full-screen demo page showing 4 background variants in a 2x2 grid (each taking half the viewport height):

1. Aurora: Radial gradients in purple/teal/blue that slowly rotate and shift using a CSS animation. Use 3 overlapping absolutely-positioned radial-gradient divs with different animation delays and durations (15s, 20s, 25s).

2. Dot Matrix: A repeating radial-gradient dot pattern (2px dots, 30px spacing) on a dark background, with a slow parallax drift animation (background-position shifting by 30px over 4s).

3. Noise Mesh: A mesh gradient using multiple conic-gradient and radial-gradient layers blended with mix-blend-mode screen, softly animated with a hue rotation filter animation.

4. Grid Glow: A sharp CSS grid (1px lines, rgba(255,255,255,0.05)) over a dark background, with a centered radial spotlight that follows the mouse position using onMouseMove and inline styles updating a CSS custom property --mx, --my.

Each variant fills its grid cell completely, is labeled with its name in the top-left corner in text-xs text-white/40 font-mono uppercase tracking-widest, and has no visible overflow. Export as default.`

  const profileCardGridContent = `Create a React component called TeamProfileGrid that renders a grid of team member profile cards. Use only React and Tailwind CSS.

Define 9 team members inline with: name, role, department, avatar (use initials with a unique gradient per person), bio (1–2 sentences), stats (projects: number, reviews: number, rating: 1–5), and social links (GitHub, Twitter/X, LinkedIn — as href strings).

Layout: responsive grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8 bg-slate-950 min-h-screen.

Each card: bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1.

Card structure:
- Top banner: h-20 bg-gradient-to-br (unique gradient per person using different color pairs)
- Avatar: w-16 h-16 rounded-2xl border-4 border-slate-900 flex items-center justify-center text-xl font-bold text-white, positioned -mt-8 ml-4 relative z-10 with matching gradient
- Name + role: mt-2 px-4, name in font-semibold text-white, role in text-xs text-slate-400, department badge in text-xs rounded-full bg-slate-800 text-slate-300 px-2 py-0.5 inline-block mt-1
- Bio: text-xs text-slate-500 px-4 mt-3 line-clamp-2
- Stats row: flex justify-around py-3 px-4 border-t border-slate-800 mt-4, each stat has a number in font-semibold text-white and label in text-xs text-slate-500
- Social icons row: flex gap-2 px-4 pb-4, each icon button has p-1.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors

Export as default.`

  const dashboardStatsContent = `Create a React component called StatsOverviewDashboard that renders a real-time-feeling stats dashboard. Use only React and Tailwind CSS.

Background: bg-slate-950 min-h-screen p-6 lg:p-8.

Header row: "Overview" heading in text-2xl font-bold text-white, subtitle "Last 30 days" in text-sm text-slate-400, and a date range badge on the right.

Top stats row: 4 cards in a responsive grid (grid-cols-2 lg:grid-cols-4 gap-4). Each stat card: bg-slate-900 rounded-2xl border border-slate-800 p-5. Content: icon in a colored rounded-xl p-2.5 bg-(color)/10 top-right, metric name in text-xs text-slate-400 uppercase tracking-wider, value in text-3xl font-bold text-white mt-2, change indicator (+12.5%) in text-sm — green with ArrowUpRight if positive, red with ArrowDownRight if negative. Stats: Total Users (23,412, +12.5%), Revenue ($48,295, +8.2%), Active Sessions (1,847, -3.1%), Conversion (4.62%, +0.8%).

Middle section: 2-column grid (grid-cols-1 lg:grid-cols-3 gap-6 mt-6). Left column spans 2: a line chart placeholder built with SVG (700x200 viewBox, grid lines, a smooth cubic bezier path in stroke purple-500 with a gradient fill below). Right column: "Top Channels" list — 5 items each with a colored dot, channel name, bar (bg-slate-800 rounded-full h-1.5 with an inner div width % in bg-purple-500), and percentage text.

Bottom row: "Recent Transactions" table — 5 rows with avatar, name, transaction type badge, amount, and status pill (Completed/Pending/Failed with matching colors). Export as default.`

  // ── Prompts ──────────────────────────────────────────────────────────

  // 1. Published — Glassmorphism Login Card
  const glassmorphismPrompt = await prisma.prompt.create({
    data: {
      title: 'Glassmorphism Login Card',
      slug: 'glassmorphism-login-card',
      description:
        'A copy-paste-ready prompt that generates a stunning glassmorphism login card with blur effects, semi-transparent backgrounds, social login buttons, and smooth hover states. React + Tailwind only.',
      type: PromptType.CODE,
      status: PromptStatus.PUBLISHED,
      categoryId: categories['authentication'].id,
      content: glassmorphismLoginContent,
      metadata: {
        framework: 'react',
        styling: 'tailwind',
        estimatedTokens: 1800,
      },
      unlockCount: 487,
      viewCount: 2341,
      publishedAt: new Date('2026-02-10'),
      createdAt: new Date('2026-01-20'),
    },
  })

  // 2. Published — Gradient Hero Section
  const heroPrompt = await prisma.prompt.create({
    data: {
      title: 'Gradient Hero Section',
      slug: 'gradient-hero-section',
      description:
        'Generate a full animated gradient hero section with floating orbs, grid overlay, shimmering gradient text, CTA buttons, and social proof avatars. Fully responsive, single-file React + Tailwind component.',
      type: PromptType.CODE,
      status: PromptStatus.PUBLISHED,
      categoryId: categories['landing-pages'].id,
      content: gradientHeroContent,
      metadata: {
        framework: 'react',
        styling: 'tailwind',
        estimatedTokens: 2200,
      },
      unlockCount: 612,
      viewCount: 3105,
      publishedAt: new Date('2026-02-15'),
      createdAt: new Date('2026-01-25'),
    },
  })

  // 3. Published — Minimal Pricing Table
  const pricingPrompt = await prisma.prompt.create({
    data: {
      title: 'Minimal Pricing Table',
      slug: 'minimal-pricing-table',
      description:
        'A 3-tier pricing table with monthly/yearly toggle, highlighted "Popular" plan, dark mode support, and responsive grid. Clean, minimal design using React + Tailwind.',
      type: PromptType.CODE,
      status: PromptStatus.PUBLISHED,
      categoryId: categories['checkout'].id,
      content: pricingTableContent,
      metadata: {
        framework: 'react',
        styling: 'tailwind',
        estimatedTokens: 2000,
      },
      unlockCount: 389,
      viewCount: 1920,
      publishedAt: new Date('2026-02-20'),
      createdAt: new Date('2026-02-01'),
    },
  })

  // 4. Published — Dark Sidebar Navigation
  const sidebarPrompt = await prisma.prompt.create({
    data: {
      title: 'Dark Sidebar Navigation',
      slug: 'dark-sidebar-navigation',
      description: 'A collapsible dark sidebar with grouped nav items, active states, icon-only collapsed mode, and smooth width transition. React + Tailwind only.',
      type: PromptType.CODE,
      status: PromptStatus.PUBLISHED,
      categoryId: categories['headers'].id,
      content: darkSidebarContent,
      metadata: { framework: 'react', styling: 'tailwind', estimatedTokens: 1400 },
      unlockCount: 301,
      viewCount: 1540,
      publishedAt: new Date('2026-02-22'),
      createdAt: new Date('2026-02-05'),
    },
  })

  // 5. Published — Toast Notification System
  const toastPrompt = await prisma.prompt.create({
    data: {
      title: 'Toast Notification System',
      slug: 'toast-notification-system',
      description: 'A fully working toast/notification system with success, error, warning, and info variants, auto-dismiss, progress bar, and stacking. React + Tailwind only.',
      type: PromptType.CODE,
      status: PromptStatus.PUBLISHED,
      categoryId: categories['modals'].id,
      content: toastSystemContent,
      metadata: { framework: 'react', styling: 'tailwind', estimatedTokens: 1600 },
      unlockCount: 278,
      viewCount: 1380,
      publishedAt: new Date('2026-02-25'),
      createdAt: new Date('2026-02-08'),
    },
  })

  // 6. Published — Filterable Data Table
  const tablePrompt = await prisma.prompt.create({
    data: {
      title: 'Filterable Data Table',
      slug: 'filterable-data-table',
      description: 'A sortable, filterable data table with search, role filter, pagination, and status badges. 20 rows of mock data included. React + Tailwind only.',
      type: PromptType.CODE,
      status: PromptStatus.PUBLISHED,
      categoryId: categories['tables'].id,
      content: dataTableContent,
      metadata: { framework: 'react', styling: 'tailwind', estimatedTokens: 1800 },
      unlockCount: 422,
      viewCount: 2100,
      publishedAt: new Date('2026-03-01'),
      createdAt: new Date('2026-02-12'),
    },
  })

  // 7. Published — Multi-step Checkout Form
  const checkoutPrompt = await prisma.prompt.create({
    data: {
      title: 'Multi-step Checkout Form',
      slug: 'multi-step-checkout-form',
      description: 'A 3-step checkout with shipping, payment, and review steps. Step indicator, card brand detection, inline validation, and order summary. React + Tailwind only.',
      type: PromptType.CODE,
      status: PromptStatus.PUBLISHED,
      categoryId: categories['checkout'].id,
      content: checkoutFormContent,
      metadata: { framework: 'react', styling: 'tailwind', estimatedTokens: 1900 },
      unlockCount: 356,
      viewCount: 1760,
      publishedAt: new Date('2026-03-05'),
      createdAt: new Date('2026-02-18'),
    },
  })

  // 8. Published — Animated Mesh Background
  const meshPrompt = await prisma.prompt.create({
    data: {
      title: 'Animated Mesh Background',
      slug: 'animated-mesh-background',
      description: '4 animated background variants: Aurora, Dot Matrix, Noise Mesh, and Grid Glow with mouse-tracking spotlight. CSS keyframe animations only. React + Tailwind.',
      type: PromptType.CODE,
      status: PromptStatus.PUBLISHED,
      categoryId: categories['backgrounds'].id,
      content: meshBackgroundContent,
      metadata: { framework: 'react', styling: 'tailwind', estimatedTokens: 1500 },
      unlockCount: 198,
      viewCount: 980,
      publishedAt: new Date('2026-03-08'),
      createdAt: new Date('2026-02-22'),
    },
  })

  // 9. Published — Team Profile Card Grid
  const profileGridPrompt = await prisma.prompt.create({
    data: {
      title: 'Team Profile Card Grid',
      slug: 'team-profile-card-grid',
      description: 'A responsive 3-column grid of team profile cards with avatar, bio, stats, and social links. Hover lift effect and unique gradient per card. React + Tailwind only.',
      type: PromptType.CODE,
      status: PromptStatus.PUBLISHED,
      categoryId: categories['cards'].id,
      content: profileCardGridContent,
      metadata: { framework: 'react', styling: 'tailwind', estimatedTokens: 1700 },
      unlockCount: 245,
      viewCount: 1220,
      publishedAt: new Date('2026-03-12'),
      createdAt: new Date('2026-02-26'),
    },
  })

  // 10. Published — Stats Overview Dashboard
  const statsPrompt = await prisma.prompt.create({
    data: {
      title: 'Stats Overview Dashboard',
      slug: 'stats-overview-dashboard',
      description: 'A complete analytics dashboard with stat cards, SVG line chart, top channels bar list, and recent transactions table. Dark mode, fully responsive. React + Tailwind only.',
      type: PromptType.CODE,
      status: PromptStatus.PUBLISHED,
      categoryId: categories['dashboards'].id,
      content: dashboardStatsContent,
      metadata: { framework: 'react', styling: 'tailwind', estimatedTokens: 2100 },
      unlockCount: 334,
      viewCount: 1650,
      publishedAt: new Date('2026-03-15'),
      createdAt: new Date('2026-03-01'),
    },
  })

  // 11. Pending Review — Animated Skeleton Loader
  const skeletonPrompt = await prisma.prompt.create({
    data: {
      title: 'Animated Skeleton Loader Kit',
      slug: 'animated-skeleton-loader-kit',
      description:
        'A set of skeleton loader components for cards, text blocks, and avatars with a shimmer animation. React + Tailwind, no dependencies.',
      type: PromptType.CODE,
      status: PromptStatus.PENDING_REVIEW,
      categoryId: categories['animations'].id,
      content: `Create a React component library file called SkeletonKit that exports multiple skeleton loader components using only Tailwind CSS. Include: SkeletonCard (a card-shaped placeholder with image area, title bar, and description lines), SkeletonAvatar (a circular pulsing placeholder), SkeletonText (configurable number of lines with varying widths), and a SkeletonTable (header row + 5 body rows). All skeletons must use a shimmer animation built with a CSS keyframe that slides a linear-gradient highlight from left to right over a bg-slate-200 dark:bg-slate-800 base. Use animate-pulse as a fallback and the custom shimmer as the primary effect. Export each component individually and also a SkeletonDemo component that shows them all on one page.`,
      metadata: {
        framework: 'react',
        styling: 'tailwind',
        estimatedTokens: 1200,
      },
      unlockCount: 0,
      viewCount: 78,
      createdAt: new Date('2026-03-10'),
    },
  })

  // 5. Draft — Dashboard Stats Grid
  const dashboardPrompt = await prisma.prompt.create({
    data: {
      title: 'Dashboard Stats Grid with Charts',
      slug: 'dashboard-stats-grid',
      description:
        'A responsive dashboard grid with stat cards, sparkline charts, and a recent activity feed. React + Tailwind, dark mode ready.',
      type: PromptType.CODE,
      status: PromptStatus.DRAFT,
      categoryId: categories['dashboards'].id,
      content: `Create a React component called DashboardStats that renders an admin dashboard overview page. Include a top row of 4 stat cards (Total Users, Revenue, Active Projects, Conversion Rate) each with an icon, value, percentage change indicator (green for up, red for down), and a mini sparkline SVG chart. Below the stats, add a two-column layout: left side has a larger area chart placeholder (use an SVG with a gradient fill under the line), right side has a "Recent Activity" feed showing 5 items with avatar, action text, and relative timestamp. Use Tailwind exclusively, support dark mode with dark: variants on every element. Make it fully responsive — single column on mobile, two columns on md+.`,
      metadata: {
        framework: 'react',
        styling: 'tailwind',
        estimatedTokens: 1600,
      },
      unlockCount: 0,
      viewCount: 12,
      createdAt: new Date('2026-03-18'),
    },
  })

  console.log('  Created 12 prompts')

  // ── Prompt Tags ──────────────────────────────────────────────────────

  await prisma.promptTag.createMany({
    data: [
      // Glassmorphism Login Card
      { promptId: glassmorphismPrompt.id, tagId: tags['tailwind'].id },
      { promptId: glassmorphismPrompt.id, tagId: tags['react'].id },
      { promptId: glassmorphismPrompt.id, tagId: tags['glassmorphism'].id },
      { promptId: glassmorphismPrompt.id, tagId: tags['dark-mode'].id },
      // Gradient Hero Section
      { promptId: heroPrompt.id, tagId: tags['tailwind'].id },
      { promptId: heroPrompt.id, tagId: tags['react'].id },
      { promptId: heroPrompt.id, tagId: tags['gradient'].id },
      { promptId: heroPrompt.id, tagId: tags['responsive'].id },
      { promptId: heroPrompt.id, tagId: tags['animated'].id },
      // Minimal Pricing Table
      { promptId: pricingPrompt.id, tagId: tags['tailwind'].id },
      { promptId: pricingPrompt.id, tagId: tags['react'].id },
      { promptId: pricingPrompt.id, tagId: tags['minimal'].id },
      { promptId: pricingPrompt.id, tagId: tags['responsive'].id },
      { promptId: pricingPrompt.id, tagId: tags['dark-mode'].id },
      // Dark Sidebar Navigation
      { promptId: sidebarPrompt.id, tagId: tags['tailwind'].id },
      { promptId: sidebarPrompt.id, tagId: tags['react'].id },
      { promptId: sidebarPrompt.id, tagId: tags['responsive'].id },
      { promptId: sidebarPrompt.id, tagId: tags['dark-mode'].id },
      // Toast Notification System
      { promptId: toastPrompt.id, tagId: tags['tailwind'].id },
      { promptId: toastPrompt.id, tagId: tags['react'].id },
      { promptId: toastPrompt.id, tagId: tags['animated'].id },
      // Filterable Data Table
      { promptId: tablePrompt.id, tagId: tags['tailwind'].id },
      { promptId: tablePrompt.id, tagId: tags['react'].id },
      { promptId: tablePrompt.id, tagId: tags['responsive'].id },
      // Multi-step Checkout Form
      { promptId: checkoutPrompt.id, tagId: tags['tailwind'].id },
      { promptId: checkoutPrompt.id, tagId: tags['react'].id },
      { promptId: checkoutPrompt.id, tagId: tags['responsive'].id },
      // Animated Mesh Background
      { promptId: meshPrompt.id, tagId: tags['tailwind'].id },
      { promptId: meshPrompt.id, tagId: tags['react'].id },
      { promptId: meshPrompt.id, tagId: tags['animated'].id },
      { promptId: meshPrompt.id, tagId: tags['gradient'].id },
      // Team Profile Card Grid
      { promptId: profileGridPrompt.id, tagId: tags['tailwind'].id },
      { promptId: profileGridPrompt.id, tagId: tags['react'].id },
      { promptId: profileGridPrompt.id, tagId: tags['responsive'].id },
      // Stats Overview Dashboard
      { promptId: statsPrompt.id, tagId: tags['tailwind'].id },
      { promptId: statsPrompt.id, tagId: tags['react'].id },
      { promptId: statsPrompt.id, tagId: tags['dark-mode'].id },
      { promptId: statsPrompt.id, tagId: tags['responsive'].id },
      // Skeleton Loader (pending review)
      { promptId: skeletonPrompt.id, tagId: tags['tailwind'].id },
      { promptId: skeletonPrompt.id, tagId: tags['react'].id },
      { promptId: skeletonPrompt.id, tagId: tags['skeleton'].id },
      { promptId: skeletonPrompt.id, tagId: tags['loading-state'].id },
      { promptId: skeletonPrompt.id, tagId: tags['animated'].id },
      // Dashboard Stats (draft)
      { promptId: dashboardPrompt.id, tagId: tags['tailwind'].id },
      { promptId: dashboardPrompt.id, tagId: tags['react'].id },
      { promptId: dashboardPrompt.id, tagId: tags['dark-mode'].id },
      { promptId: dashboardPrompt.id, tagId: tags['responsive'].id },
    ],
  })

  console.log('  Created prompt-tag associations')

  // ── Prompt Versions ──────────────────────────────────────────────────

  await prisma.promptVersion.createMany({
    data: [
      {
        promptId: glassmorphismPrompt.id,
        version: 1,
        content: glassmorphismLoginContent,
        changelog: 'Initial version with glassmorphism card, social logins, and form fields.',
        createdAt: new Date('2026-01-20'),
      },
      {
        promptId: heroPrompt.id,
        version: 1,
        content: gradientHeroContent,
        changelog: 'Initial version with animated gradient, floating orbs, and social proof section.',
        createdAt: new Date('2026-01-25'),
      },
      {
        promptId: pricingPrompt.id,
        version: 1,
        content: pricingTableContent,
        changelog: 'Initial version with 3-tier pricing, monthly/yearly toggle, and dark mode.',
        createdAt: new Date('2026-02-01'),
      },
    ],
  })

  console.log('  Created prompt versions')

  // ── Prompt Previews ──────────────────────────────────────────────────

  await prisma.promptPreview.createMany({
    data: [
      {
        promptId: glassmorphismPrompt.id,
        type: 'code_snippet',
        content: `import React, { useState } from 'react';

export default function GlassmorphismLoginCard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-purple-500 opacity-30 blur-3xl" />
      <div className="absolute bottom-20 right-20 w-72 h-72 rounded-full bg-blue-500 opacity-30 blur-3xl" />

      {/* Glass card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl">
        {/* Lock icon */}
        <div className="mx-auto mb-6 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-white text-center">Welcome back</h2>
        <p className="text-sm text-gray-400 text-center mt-2 mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-300 mb-1 block">Email address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" />
          </div>
          <div className="mb-5">
            <label className="text-sm font-medium text-gray-300 mb-1 block">Password</label>
            <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200" />
          </div>
          <div className="flex justify-end mb-6">
            <a href="#" className="text-sm text-purple-400 hover:text-purple-300 transition-colors">Forgot password?</a>
          </div>
          <button type="submit" className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
            Sign In
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-white/20" />
          <span className="text-xs text-gray-500 mx-4">or continue with</span>
          <div className="flex-1 h-px bg-white/20" />
        </div>

        {/* Social buttons */}
        <div className="flex gap-3">
          <button className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-2 text-white text-sm">Google</button>
          <button className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-2 text-white text-sm">GitHub</button>
          <button className="flex-1 py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 flex items-center justify-center gap-2 text-white text-sm">Apple</button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Don&apos;t have an account? <span className="text-purple-400 hover:text-purple-300 cursor-pointer font-medium">Sign up</span>
        </p>
      </div>
    </div>
  );
}`,
        sortOrder: 1,
      },
      {
        promptId: heroPrompt.id,
        type: 'code_snippet',
        content: `import React from 'react';

export default function GradientHeroSection() {
  return (
    <>
      <style>{\`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 0%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      \`}</style>
      <div className="min-h-screen w-full relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e, #0f0c29, #1a1a2e, #16213e, #0f3460, #533483)',
          backgroundSize: '400% 400%',
          animation: 'gradient-shift 8s ease infinite',
        }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        {/* Floating orbs */}
        <div className="absolute top-1/4 -left-48 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl" style={{ animation: 'float 6s ease-in-out infinite' }} />
        <div className="absolute bottom-1/4 -right-40 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl" style={{ animation: 'float 6s ease-in-out infinite 1s' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-gray-300">Now in Public Beta</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl">
            <span className="text-white">Build stunning</span><br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">interfaces</span><br />
            <span className="text-white">at lightning speed</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mt-6 leading-relaxed">
            The modern UI toolkit that helps developers and designers ship beautiful, production-ready components in minutes instead of hours.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <button className="group px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-lg shadow-2xl shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
              Get Started Free
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </button>
            <button className="px-8 py-4 rounded-xl bg-white/5 border border-white/20 backdrop-blur-sm hover:bg-white/10 text-white font-semibold text-lg transition-all duration-300 flex items-center gap-2">
              View Components
            </button>
          </div>
        </div>
      </div>
    </>
  );
}`,
        sortOrder: 1,
      },
      {
        promptId: pricingPrompt.id,
        type: 'code_snippet',
        content: `import React, { useState } from 'react';

export default function MinimalPricingTable() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-20 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-4">Pricing</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Simple, transparent pricing</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 mt-4 max-w-xl mx-auto">Choose the plan that fits your needs. Upgrade or downgrade at any time.</p>
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-center gap-3 mb-12">
        <span className={\`text-sm font-medium \${!yearly ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}\`}>Monthly</span>
        <button onClick={() => setYearly(!yearly)} className={\`w-14 h-7 rounded-full transition-colors duration-300 \${yearly ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'} relative\`}>
          <div className={\`w-5 h-5 rounded-full bg-white shadow-sm absolute top-1 transition-all duration-300 \${yearly ? 'translate-x-7' : 'translate-x-1'}\`} />
        </button>
        <span className={\`text-sm font-medium \${yearly ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}\`}>Yearly</span>
        <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">Save 20%</span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Free */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Free</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Perfect for trying things out.</p>
          <div className="mt-6 flex items-baseline gap-1">
            <span className="text-4xl font-bold text-slate-900 dark:text-white">$0</span>
            <span className="text-sm text-slate-500">/month</span>
          </div>
          <button className="mt-8 w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Get Started</button>
        </div>

        {/* Pro */}
        <div className="rounded-2xl border-2 border-purple-600 bg-white dark:bg-slate-900 p-8 relative shadow-xl shadow-purple-500/10 md:scale-105">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold shadow-lg">Popular</div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pro</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">For professionals and small teams.</p>
          <div className="mt-6 flex items-baseline gap-1">
            {yearly && <span className="text-lg text-slate-400 line-through mr-2">$29</span>}
            <span className="text-4xl font-bold text-slate-900 dark:text-white">{yearly ? '$23' : '$29'}</span>
            <span className="text-sm text-slate-500">/month</span>
          </div>
          <button className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-purple-500/25 transition-all duration-200">Start Free Trial</button>
        </div>

        {/* Enterprise */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Enterprise</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">For large teams and organizations.</p>
          <div className="mt-6">
            <span className="text-4xl font-bold text-slate-900 dark:text-white">Custom</span>
            <p className="text-sm text-slate-500 mt-1">Tailored to your needs</p>
          </div>
          <button className="mt-8 w-full py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Contact Sales</button>
        </div>
      </div>

      <p className="mt-20 text-center text-sm text-slate-500 dark:text-slate-400">All plans include SSL, 99.9% uptime, and GDPR compliance.</p>
    </div>
  );
}`,
        sortOrder: 1,
      },
    ],
  })

  console.log('  Created prompt previews')

  // ── Review Decisions ─────────────────────────────────────────────────

  await prisma.reviewDecision.createMany({
    data: [
      {
        promptId: glassmorphismPrompt.id,
        reviewerId: reviewer.id,
        action: ReviewAction.APPROVED,
        notes:
          'Excellent glassmorphism prompt. The Tailwind class specifications are precise, the blur and transparency values are well-chosen, and the component structure is clear. Social login section is a nice touch. Approved for publication.',
        createdAt: new Date('2026-02-05'),
      },
      {
        promptId: heroPrompt.id,
        reviewerId: reviewer.id,
        action: ReviewAction.NEEDS_CHANGES,
        notes:
          'Great overall concept but the floating orb animation should specify exact keyframes rather than relying on a description. Also add responsive breakpoints for the heading text sizes.',
        createdAt: new Date('2026-02-08'),
      },
      {
        promptId: heroPrompt.id,
        reviewerId: reviewer.id,
        action: ReviewAction.APPROVED,
        notes:
          'All feedback addressed. Animations are now fully specified with CSS keyframes, heading has proper sm/md/lg breakpoints. The social proof section really sells the component. Approved.',
        createdAt: new Date('2026-02-13'),
      },
      {
        promptId: pricingPrompt.id,
        reviewerId: reviewer.id,
        action: ReviewAction.APPROVED,
        notes:
          'Clean, minimal design with solid dark mode coverage. The monthly/yearly toggle logic is well-specified. The "Popular" badge and scale effect on the Pro card make the hierarchy clear. Ready to publish.',
        createdAt: new Date('2026-02-18'),
      },
    ],
  })

  console.log('  Created review decisions')

  // ── Audit Logs ───────────────────────────────────────────────────────

  await prisma.auditLog.createMany({
    data: [
      // Glassmorphism Login Card lifecycle
      {
        userId: admin.id,
        promptId: glassmorphismPrompt.id,
        action: 'prompt.created',
        details: { title: 'Glassmorphism Login Card' },
        ipAddress: '192.168.1.1',
        createdAt: new Date('2026-01-20'),
      },
      {
        userId: reviewer.id,
        promptId: glassmorphismPrompt.id,
        action: 'prompt.reviewed',
        details: { action: 'APPROVED', version: 1 },
        ipAddress: '192.168.1.2',
        createdAt: new Date('2026-02-05'),
      },
      {
        userId: admin.id,
        promptId: glassmorphismPrompt.id,
        action: 'prompt.published',
        details: { publishedAt: '2026-02-10T00:00:00.000Z' },
        ipAddress: '192.168.1.1',
        createdAt: new Date('2026-02-10'),
      },
      // Gradient Hero Section lifecycle
      {
        userId: admin.id,
        promptId: heroPrompt.id,
        action: 'prompt.created',
        details: { title: 'Gradient Hero Section' },
        ipAddress: '192.168.1.1',
        createdAt: new Date('2026-01-25'),
      },
      {
        userId: reviewer.id,
        promptId: heroPrompt.id,
        action: 'prompt.reviewed',
        details: { action: 'NEEDS_CHANGES', version: 1 },
        ipAddress: '192.168.1.2',
        createdAt: new Date('2026-02-08'),
      },
      {
        userId: reviewer.id,
        promptId: heroPrompt.id,
        action: 'prompt.reviewed',
        details: { action: 'APPROVED', version: 1 },
        ipAddress: '192.168.1.2',
        createdAt: new Date('2026-02-13'),
      },
      {
        userId: admin.id,
        promptId: heroPrompt.id,
        action: 'prompt.published',
        details: { publishedAt: '2026-02-15T00:00:00.000Z' },
        ipAddress: '192.168.1.1',
        createdAt: new Date('2026-02-15'),
      },
      // Minimal Pricing Table lifecycle
      {
        userId: admin.id,
        promptId: pricingPrompt.id,
        action: 'prompt.created',
        details: { title: 'Minimal Pricing Table' },
        ipAddress: '192.168.1.1',
        createdAt: new Date('2026-02-01'),
      },
      {
        userId: reviewer.id,
        promptId: pricingPrompt.id,
        action: 'prompt.reviewed',
        details: { action: 'APPROVED', version: 1 },
        ipAddress: '192.168.1.2',
        createdAt: new Date('2026-02-18'),
      },
      {
        userId: admin.id,
        promptId: pricingPrompt.id,
        action: 'prompt.published',
        details: { publishedAt: '2026-02-20T00:00:00.000Z' },
        ipAddress: '192.168.1.1',
        createdAt: new Date('2026-02-20'),
      },
      // Skeleton Loader — submitted for review
      {
        userId: user.id,
        promptId: skeletonPrompt.id,
        action: 'prompt.created',
        details: { title: 'Animated Skeleton Loader Kit' },
        ipAddress: '10.0.0.1',
        createdAt: new Date('2026-03-10'),
      },
      {
        userId: user.id,
        promptId: skeletonPrompt.id,
        action: 'prompt.submitted_for_review',
        details: { version: 1 },
        ipAddress: '10.0.0.1',
        createdAt: new Date('2026-03-10'),
      },
      // Dashboard Stats — draft created
      {
        userId: admin.id,
        promptId: dashboardPrompt.id,
        action: 'prompt.created',
        details: { title: 'Dashboard Stats Grid with Charts' },
        ipAddress: '192.168.1.1',
        createdAt: new Date('2026-03-18'),
      },
      // System seed marker
      {
        userId: null,
        promptId: null,
        action: 'system.seed_completed',
        details: { version: '2.0.0', timestamp: new Date().toISOString() },
        createdAt: new Date(),
      },
    ],
  })

  console.log('  Created audit log entries')

  console.log('\nSeeding complete!')
  console.log(`
Summary:
  - Users:       3 (admin, reviewer, user)
  - Categories: 12
  - Tags:       15
  - Prompts:     5 (3 published, 1 pending_review, 1 draft)
  - Versions:    3
  - Previews:    3 (code_snippet for each published prompt)
  - Reviews:     4
  - Audit Logs: 14
  `)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
