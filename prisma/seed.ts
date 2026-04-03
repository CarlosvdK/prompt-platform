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
      // ── Dark Sidebar Navigation ──
      {
        promptId: sidebarPrompt.id,
        type: 'code_snippet',
        content: `export default function DarkSidebarNavigation() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const navGroups = [
    { label: "Main", items: [{ name: "Dashboard", icon: "grid" }, { name: "Analytics", icon: "chart" }, { name: "Projects", icon: "folder" }] },
    { label: "Manage", items: [{ name: "Team", icon: "users" }, { name: "Settings", icon: "gear" }] },
  ];
  const iconMap = {
    grid: React.createElement("svg", {width:20,height:20,viewBox:"0 0 20 20",fill:"none"}, React.createElement("rect",{x:2,y:2,width:7,height:7,rx:1.5,fill:"currentColor"}), React.createElement("rect",{x:11,y:2,width:7,height:7,rx:1.5,fill:"currentColor",opacity:0.5}), React.createElement("rect",{x:2,y:11,width:7,height:7,rx:1.5,fill:"currentColor",opacity:0.5}), React.createElement("rect",{x:11,y:11,width:7,height:7,rx:1.5,fill:"currentColor",opacity:0.3})),
    chart: React.createElement("svg", {width:20,height:20,viewBox:"0 0 20 20",fill:"none"}, React.createElement("rect",{x:2,y:10,width:3,height:8,rx:1,fill:"currentColor"}), React.createElement("rect",{x:7,y:6,width:3,height:12,rx:1,fill:"currentColor",opacity:0.7}), React.createElement("rect",{x:12,y:3,width:3,height:15,rx:1,fill:"currentColor",opacity:0.5})),
    folder: React.createElement("svg", {width:20,height:20,viewBox:"0 0 20 20",fill:"none"}, React.createElement("path",{d:"M2 5a2 2 0 012-2h4l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V5z",fill:"currentColor"})),
    users: React.createElement("svg", {width:20,height:20,viewBox:"0 0 20 20",fill:"none"}, React.createElement("circle",{cx:7,cy:7,r:3,fill:"currentColor"}), React.createElement("circle",{cx:14,cy:7,r:2.5,fill:"currentColor",opacity:0.5}), React.createElement("path",{d:"M1 17c0-3 2.5-5 6-5s6 2 6 5",fill:"currentColor",opacity:0.7})),
    gear: React.createElement("svg", {width:20,height:20,viewBox:"0 0 20 20",fill:"none"}, React.createElement("circle",{cx:10,cy:10,r:3,stroke:"currentColor",strokeWidth:2,fill:"none"}), React.createElement("circle",{cx:10,cy:2,r:1.5,fill:"currentColor"}), React.createElement("circle",{cx:10,cy:18,r:1.5,fill:"currentColor"}), React.createElement("circle",{cx:2,cy:10,r:1.5,fill:"currentColor"}), React.createElement("circle",{cx:18,cy:10,r:1.5,fill:"currentColor"})),
  };
  return (
    <div className="min-h-screen bg-slate-950 flex">
      <aside className="flex flex-col border-r border-slate-800/60 bg-slate-950 transition-all duration-300 ease-in-out" style={{width: collapsed ? 72 : 260}}>
        <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-800/60">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0"><span className="text-white font-bold text-sm">S</span></div>
          {!collapsed && <span className="text-white font-semibold text-lg tracking-tight">Softset</span>}
        </div>
        <nav className="flex-1 py-4 space-y-6 overflow-hidden">
          {navGroups.map((group) => (
            <div key={group.label}>
              {!collapsed && <p className="px-5 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{group.label}</p>}
              <div className="space-y-0.5">{group.items.map((item) => {
                const isActive = active === item.name;
                return (<button key={item.name} onClick={() => setActive(item.name)} className={"w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all duration-150 " + (isActive ? "text-white bg-indigo-500/15 border-r-2 border-indigo-400" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50")}>
                  <span className={isActive ? "text-indigo-400" : "text-slate-500"}>{iconMap[item.icon]}</span>
                  {!collapsed && <span>{item.name}</span>}
                </button>);
              })}</div>
            </div>
          ))}
        </nav>
        <div className="px-3 py-2 border-t border-slate-800/60">
          <button onClick={() => setCollapsed(!collapsed)} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors text-sm">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d={collapsed ? "M7 4l5 5-5 5" : "M11 4l-5 5 5 5"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
        <div className="px-4 py-3 border-t border-slate-800/60 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0"><span className="text-white text-sm font-semibold">SC</span></div>
          {!collapsed && <div className="overflow-hidden"><p className="text-sm font-medium text-slate-200 truncate">Sarah Chen</p><p className="text-xs text-slate-500 truncate">admin@softset.dev</p></div>}
        </div>
      </aside>
      <div className="flex-1 flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold text-white mb-2">{active}</h1><p className="text-slate-500 text-sm">Select a page from the sidebar</p></div></div>
    </div>
  );
}`,
        sortOrder: 1,
      },
      // ── Toast Notification System ──
      {
        promptId: toastPrompt.id,
        type: 'code_snippet',
        content: `export default function ToastNotificationSystem() {
  const [toasts, setToasts] = useState([
    { id: 1, type: "success", title: "Deployment Complete", message: "Your application was deployed to production successfully.", progress: 75 },
    { id: 2, type: "error", title: "Build Failed", message: "Pipeline step 'test:e2e' exited with code 1.", progress: 40 },
    { id: 3, type: "warning", title: "Rate Limit Warning", message: "You've used 85% of your API quota this billing cycle.", progress: 60 },
    { id: 4, type: "info", title: "New Version Available", message: "v2.4.0 is ready. Review the changelog before updating.", progress: 90 },
  ]);
  const config = {
    success: { bg: "bg-emerald-950/90", border: "border-emerald-500/30", iconBg: "bg-emerald-500/20", iconColor: "text-emerald-400", progressBg: "bg-emerald-500" },
    error: { bg: "bg-red-950/90", border: "border-red-500/30", iconBg: "bg-red-500/20", iconColor: "text-red-400", progressBg: "bg-red-500" },
    warning: { bg: "bg-amber-950/90", border: "border-amber-500/30", iconBg: "bg-amber-500/20", iconColor: "text-amber-400", progressBg: "bg-amber-500" },
    info: { bg: "bg-blue-950/90", border: "border-blue-500/30", iconBg: "bg-blue-500/20", iconColor: "text-blue-400", progressBg: "bg-blue-500" },
  };
  const icons = { success: "✓", error: "✕", warning: "⚠", info: "ℹ" };
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-8 relative">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-3">Notification System</h1>
        <p className="text-slate-400 text-lg">Real-time alerts and status updates</p>
        <button className="mt-6 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors" onClick={() => setToasts([{ id: Date.now(), type: "success", title: "Action Complete", message: "Your request was processed.", progress: 95 }, ...toasts])}>Trigger Toast</button>
      </div>
      <div className="fixed bottom-6 right-6 flex flex-col-reverse gap-3 z-50" style={{maxWidth: 400}}>
        {toasts.map((toast, index) => {
          const c = config[toast.type];
          return (
            <div key={toast.id} className={c.bg + " " + c.border + " border rounded-xl p-4 backdrop-blur-xl shadow-2xl transition-all duration-300"} style={{width: 380, opacity: 1 - index * 0.08, transform: "scale(" + (1 - index * 0.02) + ")"}}>
              <div className="flex items-start gap-3">
                <div className={c.iconBg + " " + c.iconColor + " w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-lg font-bold"}>{icons[toast.type]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">{toast.title}</h4>
                    <button onClick={() => removeToast(toast.id)} className="text-slate-500 hover:text-slate-300 transition-colors ml-2 text-xs">✕</button>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{toast.message}</p>
                  <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div className={"h-full " + c.progressBg + " rounded-full transition-all duration-1000"} style={{width: toast.progress + "%"}} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}`,
        sortOrder: 1,
      },
      // ── Filterable Data Table ──
      {
        promptId: tablePrompt.id,
        type: 'code_snippet',
        content: `export default function FilterableDataTable() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const users = [
    { name: "Olivia Martin", email: "olivia@company.com", role: "Admin", status: "Active", joined: "Jan 12, 2025" },
    { name: "James Wilson", email: "james@company.com", role: "Editor", status: "Active", joined: "Feb 3, 2025" },
    { name: "Sophia Lee", email: "sophia@company.com", role: "User", status: "Pending", joined: "Mar 18, 2025" },
    { name: "Liam Anderson", email: "liam@company.com", role: "Admin", status: "Active", joined: "Nov 29, 2024" },
    { name: "Emma Davis", email: "emma@company.com", role: "User", status: "Inactive", joined: "Aug 7, 2024" },
    { name: "Noah Brown", email: "noah@company.com", role: "Editor", status: "Active", joined: "Dec 14, 2024" },
    { name: "Ava Garcia", email: "ava@company.com", role: "User", status: "Active", joined: "Mar 1, 2025" },
    { name: "Ethan Miller", email: "ethan@company.com", role: "User", status: "Pending", joined: "Mar 22, 2025" },
  ];
  const filtered = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  const statusStyles = { Active: "bg-emerald-500/15 text-emerald-400", Inactive: "bg-slate-500/15 text-slate-400", Pending: "bg-amber-500/15 text-amber-400" };
  const roleColors = { Admin: "text-purple-400", Editor: "text-sky-400", User: "text-slate-400" };
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6"><h1 className="text-2xl font-bold text-white mb-1">Team Members</h1><p className="text-slate-500 text-sm">Manage your team and their account permissions.</p></div>
        <div className="flex items-center gap-3 mb-4">
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 max-w-sm pl-4 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
            <option value="All">All Roles</option><option value="Admin">Admin</option><option value="User">User</option><option value="Editor">Editor</option>
          </select>
        </div>
        <div className="border border-slate-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead><tr className="bg-slate-900/80">{["Name","Email","Role","Status","Joined"].map((h) => (<th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>))}</tr></thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((user, i) => (
                <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-5 py-3.5"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"><span className="text-white text-xs font-semibold">{user.name.split(" ").map((n) => n[0]).join("")}</span></div><span className="text-sm font-medium text-slate-200">{user.name}</span></div></td>
                  <td className="px-5 py-3.5 text-sm text-slate-400">{user.email}</td>
                  <td className={"px-5 py-3.5 text-sm font-medium " + roleColors[user.role]}>{user.role}</td>
                  <td className="px-5 py-3.5"><span className={"inline-flex px-2.5 py-1 text-xs font-medium rounded-full " + statusStyles[user.status]}>{user.status}</span></td>
                  <td className="px-5 py-3.5 text-sm text-slate-500">{user.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/40 border-t border-slate-800/60">
            <p className="text-sm text-slate-500">Showing <span className="text-slate-300 font-medium">1-{filtered.length}</span> of <span className="text-slate-300 font-medium">24</span></p>
            <div className="flex items-center gap-1.5">
              <button className="px-3 py-1.5 text-sm text-slate-500 bg-slate-800/50 rounded-md">Previous</button>
              <button className="px-3 py-1.5 text-sm text-white bg-indigo-600 rounded-md">1</button>
              <button className="px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-800 rounded-md transition-colors">2</button>
              <button className="px-3 py-1.5 text-sm text-slate-400 hover:bg-slate-800 rounded-md transition-colors">3</button>
              <button className="px-3 py-1.5 text-sm text-slate-300 bg-slate-800/50 hover:bg-slate-800 rounded-md transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`,
        sortOrder: 1,
      },
      // ── Multi-step Checkout Form ──
      {
        promptId: checkoutPrompt.id,
        type: 'code_snippet',
        content: `export default function MultiStepCheckoutForm() {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const steps = [{ num: 1, label: "Shipping", done: true }, { num: 2, label: "Payment", active: true }, { num: 3, label: "Review" }];
  const items = [{ name: "Wireless Pro Headphones", variant: "Matte Black", price: 249.99, qty: 1 }, { name: "USB-C Charging Cable (2m)", variant: "White", price: 19.99, qty: 2 }];
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 9.99; const tax = subtotal * 0.08; const total = subtotal + shipping + tax;
  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-8">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-center mb-10">
          {steps.map((step, i) => (
            <div key={step.num} className="flex items-center">
              <div className="flex items-center gap-2.5">
                <div className={"w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold " + (step.done ? "bg-emerald-500 text-white" : step.active ? "bg-indigo-600 text-white ring-4 ring-indigo-500/20" : "bg-slate-800 text-slate-500")}>{step.done ? "✓" : step.num}</div>
                <span className={"text-sm font-medium " + (step.done ? "text-emerald-400" : step.active ? "text-white" : "text-slate-500")}>{step.label}</span>
              </div>
              {i < steps.length - 1 && <div className={"w-20 h-px mx-4 " + (step.done ? "bg-emerald-500" : "bg-slate-800")} />}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-3">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-7">
              <h2 className="text-xl font-semibold text-white mb-1">Payment Details</h2>
              <p className="text-sm text-slate-500 mb-6">Enter your card information below.</p>
              <div className="space-y-5">
                <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Card Number</label><input type="text" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="4242 4242 4242 4242" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Expiry</label><input type="text" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM / YY" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" /></div>
                  <div><label className="block text-sm font-medium text-slate-300 mb-1.5">CVV</label><input type="text" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="123" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" /></div>
                </div>
                <div><label className="block text-sm font-medium text-slate-300 mb-1.5">Cardholder Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name on card" className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" /></div>
                <div className="flex gap-3 pt-2">
                  <button className="px-5 py-3 rounded-xl bg-slate-800 text-slate-300 text-sm font-medium hover:bg-slate-700 transition-colors">Back</button>
                  <button className="flex-1 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-colors">Continue to Review</button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-2">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
              <div className="space-y-4 mb-5">{items.map((item, i) => (<div key={i} className="flex gap-3"><div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center shrink-0"><span className="text-slate-500 text-lg">📦</span></div><div className="flex-1 min-w-0"><p className="text-sm font-medium text-slate-200 truncate">{item.name}</p><p className="text-xs text-slate-500">{item.variant} · Qty {item.qty}</p></div><p className="text-sm font-medium text-slate-300">{"$"+(item.price * item.qty).toFixed(2)}</p></div>))}</div>
              <div className="border-t border-slate-800 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm"><span className="text-slate-500">Subtotal</span><span className="text-slate-300">{"$"+subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Shipping</span><span className="text-slate-300">{"$"+shipping.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-slate-500">Tax</span><span className="text-slate-300">{"$"+tax.toFixed(2)}</span></div>
                <div className="border-t border-slate-800 pt-3 flex justify-between"><span className="text-sm font-semibold text-white">Total</span><span className="text-lg font-bold text-white">{"$"+total.toFixed(2)}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}`,
        sortOrder: 1,
      },
      // ── Animated Mesh Background ──
      {
        promptId: meshPrompt.id,
        type: 'code_snippet',
        content: `export default function AnimatedMeshBackground() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#09090b]">
      <style>{\`
        @keyframes blob1 { 0%, 100% { transform: translate(0%, 0%) scale(1); } 25% { transform: translate(20%, -15%) scale(1.1); } 50% { transform: translate(-10%, 20%) scale(0.95); } 75% { transform: translate(15%, 10%) scale(1.05); } }
        @keyframes blob2 { 0%, 100% { transform: translate(0%, 0%) scale(1); } 25% { transform: translate(-25%, 15%) scale(1.05); } 50% { transform: translate(15%, -10%) scale(1.1); } 75% { transform: translate(-15%, -20%) scale(0.95); } }
        @keyframes blob3 { 0%, 100% { transform: translate(0%, 0%) scale(1.05); } 25% { transform: translate(10%, 25%) scale(0.95); } 50% { transform: translate(-20%, -10%) scale(1.1); } 75% { transform: translate(20%, -15%) scale(1); } }
      \`}</style>
      <div className="absolute w-[600px] h-[600px] rounded-full opacity-30 blur-[100px]" style={{background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)", top: "10%", left: "15%", animation: "blob1 12s ease-in-out infinite"}} />
      <div className="absolute w-[500px] h-[500px] rounded-full opacity-25 blur-[100px]" style={{background: "radial-gradient(circle, #2563eb 0%, transparent 70%)", top: "30%", right: "10%", animation: "blob2 15s ease-in-out infinite"}} />
      <div className="absolute w-[550px] h-[550px] rounded-full opacity-25 blur-[100px]" style={{background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)", bottom: "5%", left: "30%", animation: "blob3 18s ease-in-out infinite"}} />
      <div className="absolute inset-0" style={{backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px"}} />
      <div className="absolute inset-0" style={{background: "radial-gradient(ellipse at center, transparent 0%, #09090b 75%)"}} />
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-7xl font-extrabold tracking-tight mb-4 text-center" style={{background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 50%, #22d3ee 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>Mesh Gradient</h1>
        <p className="text-slate-400 text-xl max-w-md text-center leading-relaxed">Dynamic animated backgrounds powered by layered radial gradients</p>
        <div className="mt-8 flex gap-4">
          <button className="px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-white text-sm font-medium hover:bg-white/15 transition-all">Explore</button>
          <button className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors">Get Started</button>
        </div>
      </div>
    </div>
  );
}`,
        sortOrder: 1,
      },
      // ── Team Profile Card Grid ──
      {
        promptId: profileGridPrompt.id,
        type: 'code_snippet',
        content: `export default function TeamProfileCardGrid() {
  const team = [
    { name: "Sarah Chen", role: "CEO & Co-Founder", bio: "Former VP at Stripe. Building the future of developer tooling.", initials: "SC", gradient: "from-violet-600 to-indigo-600", projects: 24, followers: "3.2k", rating: 4.9 },
    { name: "Marcus Rivera", role: "Head of Engineering", bio: "Systems architect with 12 years at Google and Meta.", initials: "MR", gradient: "from-cyan-500 to-blue-600", projects: 38, followers: "2.8k", rating: 4.8 },
    { name: "Priya Patel", role: "Lead Designer", bio: "Award-winning product designer. Previously at Figma.", initials: "PP", gradient: "from-pink-500 to-rose-600", projects: 19, followers: "5.1k", rating: 4.9 },
    { name: "Alex Nakamura", role: "ML Engineer", bio: "PhD in NLP from Stanford. Leading prompt optimization.", initials: "AN", gradient: "from-amber-500 to-orange-600", projects: 15, followers: "1.9k", rating: 4.7 },
    { name: "Jordan Blake", role: "Full Stack Developer", bio: "Open source contributor and TypeScript enthusiast.", initials: "JB", gradient: "from-emerald-500 to-teal-600", projects: 42, followers: "4.4k", rating: 4.8 },
    { name: "Elena Vasquez", role: "Product Manager", bio: "Former founder (YC W22). Bridging tech and business.", initials: "EV", gradient: "from-fuchsia-500 to-purple-600", projects: 11, followers: "2.1k", rating: 4.6 },
  ];
  return (
    <div className="min-h-screen bg-[#09090b] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12"><h1 className="text-4xl font-bold text-white mb-3">Meet the Team</h1><p className="text-slate-400 text-lg max-w-2xl mx-auto">The people behind the platform.</p></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((m) => (
            <div key={m.name} className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800/60 hover:scale-[1.02] hover:border-slate-700/60 transition-all duration-300">
              <div className={"h-24 bg-gradient-to-r " + m.gradient + " relative"}>
                <div className="absolute -bottom-8 left-6"><div className="w-16 h-16 rounded-xl bg-slate-900 border-4 border-slate-900 flex items-center justify-center shadow-lg"><span className={"text-lg font-bold bg-gradient-to-r " + m.gradient + " bg-clip-text text-transparent"}>{m.initials}</span></div></div>
              </div>
              <div className="pt-12 px-6 pb-6">
                <h3 className="text-lg font-semibold text-white">{m.name}</h3>
                <p className="text-sm text-indigo-400 font-medium mb-3">{m.role}</p>
                <p className="text-sm text-slate-400 leading-relaxed mb-5">{m.bio}</p>
                <div className="flex items-center gap-4 py-4 border-t border-slate-800/60">
                  <div className="text-center flex-1"><p className="text-lg font-semibold text-white">{m.projects}</p><p className="text-xs text-slate-500">Projects</p></div>
                  <div className="w-px h-8 bg-slate-800" />
                  <div className="text-center flex-1"><p className="text-lg font-semibold text-white">{m.followers}</p><p className="text-xs text-slate-500">Followers</p></div>
                  <div className="w-px h-8 bg-slate-800" />
                  <div className="text-center flex-1"><p className="text-lg font-semibold text-white">{m.rating}</p><p className="text-xs text-slate-500">Rating</p></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}`,
        sortOrder: 1,
      },
      // ── Stats Overview Dashboard ──
      {
        promptId: statsPrompt.id,
        type: 'code_snippet',
        content: `export default function StatsOverviewDashboard() {
  const stats = [
    { label: "Users", value: "23,412", change: "+12.5%", up: true },
    { label: "Revenue", value: "$48,295", change: "+8.2%", up: true },
    { label: "Sessions", value: "1,847", change: "-3.1%", up: false },
    { label: "Conversion", value: "4.62%", change: "+0.8%", up: true },
  ];
  const channels = [
    { name: "Organic Search", pct: 42, color: "bg-indigo-500", dot: "bg-indigo-400" },
    { name: "Direct Traffic", pct: 28, color: "bg-cyan-500", dot: "bg-cyan-400" },
    { name: "Social Media", pct: 18, color: "bg-purple-500", dot: "bg-purple-400" },
    { name: "Email Campaign", pct: 8, color: "bg-amber-500", dot: "bg-amber-400" },
    { name: "Referral", pct: 4, color: "bg-emerald-500", dot: "bg-emerald-400" },
  ];
  const points = [[0,70],[50,55],[100,62],[150,38],[200,42],[250,25],[300,30],[350,18],[400,22],[450,10],[500,15],[550,8]];
  const polyline = points.map(function(p) { return p[0]+","+p[1]; }).join(" ");
  const areaPath = "M0,80 L"+points.map(function(p) { return p[0]+","+p[1]; }).join(" L")+" L550,80 Z";
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div><h1 className="text-2xl font-bold text-white">Overview</h1><p className="text-sm text-slate-500 mt-1">Platform analytics and performance</p></div>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-4 py-2"><span className="text-sm text-slate-300">Mar 1 – Mar 31, 2026</span></div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map(function(s) { return (
            <div key={s.label} className="bg-slate-900/70 border border-slate-800/60 rounded-xl p-5">
              <p className="text-sm text-slate-500 mb-1">{s.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <span className={"text-sm font-medium px-2 py-0.5 rounded-md " + (s.up ? "text-emerald-400 bg-emerald-500/10" : "text-red-400 bg-red-500/10")}>{s.change}</span>
              </div>
            </div>
          ); })}
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 bg-slate-900/70 border border-slate-800/60 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6"><h3 className="text-lg font-semibold text-white">User Growth</h3></div>
            <svg viewBox="0 0 550 90" className="w-full h-auto" preserveAspectRatio="none">
              <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" /><stop offset="100%" stopColor="#6366f1" stopOpacity="0" /></linearGradient></defs>
              {[20,40,60].map(function(y) { return React.createElement("line",{key:y,x1:0,y1:y,x2:550,y2:y,stroke:"#1e293b",strokeWidth:"0.5"}); })}
              <path d={areaPath} fill="url(#cg)" />
              <polyline points={polyline} fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {points.map(function(p,i) { return React.createElement("circle",{key:i,cx:p[0],cy:p[1],r:3,fill:"#818cf8",stroke:"#0f172a",strokeWidth:2}); })}
            </svg>
          </div>
          <div className="bg-slate-900/70 border border-slate-800/60 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Top Channels</h3>
            <div className="space-y-5">
              {channels.map(function(ch) { return (
                <div key={ch.name}>
                  <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2.5"><div className={"w-2.5 h-2.5 rounded-full " + ch.dot} /><span className="text-sm text-slate-300">{ch.name}</span></div><span className="text-sm font-medium text-slate-400">{ch.pct}%</span></div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden"><div className={"h-full " + ch.color + " rounded-full"} style={{width: ch.pct + "%"}} /></div>
                </div>
              ); })}
            </div>
          </div>
        </div>
      </div>
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
