# Carlos — Prompt Examples

Reference examples for agent training. Do NOT reuse directly — use as inspiration only.

---

### Animated Gradient Hero
**Category:** landing-pages
**Complexity:** complex
**Key elements:** animated gradient background, floating orbs, grid overlay, large headline, subtitle, CTA buttons, social proof avatars

**Prompt:**
Create a full-screen hero section with an animated gradient background that shifts between deep purple, navy, and dark teal. Add 3 floating blurred orbs (purple, blue, cyan) that slowly drift using CSS keyframe animations. Overlay a subtle grid pattern at 5% opacity with 60px spacing. Center the content vertically: a "Now in Beta" badge with a green pulsing dot, a 3-line headline (text-5xl to text-7xl responsive) where the middle line uses gradient text (purple to pink to blue), a subtitle paragraph in text-slate-400, two CTA buttons (primary gradient and secondary outline with backdrop blur), and a row of 5 overlapping avatar circles with a "+2,000 users" label. Use min-h-screen, bg-[#09090b], Inter font. Single-file React + Tailwind, no external dependencies.

**Notes:**
- The animated background is what sells this — the keyframe animation on background-position makes it feel alive
- Floating orbs add depth without being distracting
- The grid overlay is subtle but adds texture
- Could improve: add a mouse-tracking spotlight effect, add entrance animations on scroll

---

### Glassmorphism Auth Card
**Category:** authentication
**Complexity:** medium
**Key elements:** frosted glass effect, gradient background, form inputs, social login, password visibility toggle

**Prompt:**
Create a centered login card with glassmorphism styling on a gradient background. Background: min-h-screen with bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900, plus two decorative blurred circles (purple and blue, 300px, opacity-30, blur-3xl) positioned top-left and bottom-right. Card: max-w-md, bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8. Include a lock icon in a gradient circle at top, "Welcome back" heading, "Sign in to your account" subtitle, email input, password input, "Forgot password?" link, gradient submit button with shadow and hover scale, a divider with "or continue with", three social buttons (Google, GitHub, Apple) in a row, and a "Don't have an account? Sign up" footer. All inputs: bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 with focus:ring-2 focus:ring-purple-500. Use useState for email and password. Export default.

**Notes:**
- The backdrop-blur-xl on bg-white/10 creates the glass effect
- Decorative blurred circles in the background add visual interest behind the glass
- Could improve: add password strength indicator, add shake animation on invalid submit, add loading state on button

---

### Stats Dashboard with SVG Chart
**Category:** dashboards
**Complexity:** complex
**Key elements:** stat cards with trend indicators, SVG line chart with gradient fill, channel breakdown with progress bars, date range selector

**Prompt:**
Create an analytics dashboard on bg-slate-950 with p-8. Header: "Overview" in text-2xl font-bold text-white with "Platform analytics" subtitle, and a date range badge on the right showing "Mar 1 – Mar 31, 2026" in a rounded-lg bg-slate-900 border border-slate-800 container. Below: 4 stat cards in grid-cols-4 gap-4, each bg-slate-900/70 border border-slate-800/60 rounded-xl p-5 showing: label (text-sm text-slate-500), value (text-2xl font-bold text-white), and change badge (emerald for positive, red for negative, with px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-sm). Stats: Users 23,412 +12.5%, Revenue $48,295 +8.2%, Sessions 1,847 -3.1%, Conversion 4.62% +0.8%. Below stats: 2-column grid (col-span-2 + col-span-1). Left: "User Growth" card with an SVG chart (viewBox 0 0 550 90) containing horizontal grid lines at y=20,40,60 in #1e293b, a filled area path with linearGradient from #6366f1 opacity 0.3 to 0, and a polyline stroke #818cf8 strokeWidth 2 with circle dots at each data point. Right: "Top Channels" list with 5 items, each showing a colored dot, channel name, percentage, and a progress bar (h-1.5 bg-slate-800 rounded-full with inner colored div). Export default, use no charting library.

**Notes:**
- SVG charts are key — no external dependencies needed, and they look great
- The gradient fill under the line chart adds polish
- Stat cards need both the number AND the trend to be useful
- Could improve: add hover tooltips on chart points, add time range toggle buttons (7D/30D/90D)

---

### Notification Toast Stack
**Category:** modals
**Complexity:** medium
**Key elements:** 4 toast variants (success/error/warning/info), progress bars, dismiss buttons, stacking effect

**Prompt:**
Create a toast notification demo with a dark background (bg-[#09090b] min-h-screen). Center: heading "Notification System" in text-4xl font-bold text-white, subtitle, and a "Trigger Toast" button in bg-indigo-600. In the bottom-right corner (fixed bottom-6 right-6), display 4 stacked toast notifications using flex flex-col-reverse gap-3. Each toast: 380px wide, rounded-xl p-4 backdrop-blur-xl shadow-2xl border, with type-specific colors — success: bg-emerald-950/90 border-emerald-500/30, error: bg-red-950/90 border-red-500/30, warning: bg-amber-950/90 border-amber-500/30, info: bg-blue-950/90 border-blue-500/30. Each contains: a colored icon badge (w-9 h-9 rounded-lg), title (text-sm font-semibold text-white), message (text-xs text-slate-400), close button, and a progress bar (h-1 bg-slate-800 rounded-full with inner colored bar at varying widths). Stack effect: each toast gets slightly more transparent (opacity: 1 - index * 0.08) and slightly smaller (scale: 1 - index * 0.02). Use useState for the toast array with add/remove functions. Export default.

**Notes:**
- The stacking effect (scale + opacity decrease per item) makes it feel like a real stack
- Progress bars indicate auto-dismiss timing
- flex-col-reverse makes new toasts appear at the bottom naturally
- Could improve: add slide-in animation, add auto-dismiss with setTimeout, add "undo" action button on dismiss

---

### Multi-Step Checkout
**Category:** checkout
**Complexity:** complex
**Key elements:** step indicator, payment form, order summary sidebar, card brand detection, inline validation

**Prompt:**
Create a 3-step checkout flow showing step 2 (Payment) as active. Background: bg-[#09090b] min-h-screen flex items-center justify-center p-8. Step indicator at top: 3 steps in a horizontal row — step 1 "Shipping" completed (bg-emerald-500 with checkmark), step 2 "Payment" active (bg-indigo-600 with ring-4 ring-indigo-500/20), step 3 "Review" upcoming (bg-slate-800 text-slate-500). Connect steps with lines (w-20 h-px, emerald if previous step done, slate-800 otherwise). Below: grid-cols-5 gap-8 layout. Left col-span-3: payment form card (bg-slate-900/60 border border-slate-800 rounded-2xl p-7) with "Payment Details" heading, card number input (placeholder 4242 4242 4242 4242), expiry + CVV in 2-col grid, cardholder name, Back button (bg-slate-800) and "Continue to Review" button (bg-indigo-600). Right col-span-2: order summary card with 2 items (each with thumbnail placeholder, name, variant, qty, price), subtotal, shipping $9.99, tax (8% of subtotal), and bold total. All inputs: bg-slate-950 border border-slate-700 rounded-xl. Use useState for all form fields. Export default.

**Notes:**
- The step indicator with checkmarks for completed steps gives clear progress feedback
- ring-4 on the active step draws the eye
- Order summary being sticky on the right keeps context visible while filling the form
- Could improve: add card brand icon detection based on first digit, add field validation with red borders, add order item images

---

### Filterable Data Table
**Category:** tables
**Complexity:** complex
**Key elements:** search input, role filter dropdown, sortable columns, status badges, avatar initials, pagination

**Prompt:**
Create a data table page on bg-slate-950 p-8. Header: "Team Members" in text-2xl font-bold text-white, subtitle "Manage your team and permissions". Filter row: search input (pl-9 with search icon, bg-slate-900 border-slate-800 rounded-lg, focus:ring-2 ring-indigo-500/40) and role dropdown (All/Admin/User/Editor, same styling). Table: border border-slate-800 rounded-xl overflow-hidden. Header row bg-slate-900/80 with columns: Name, Email, Role, Status, Joined — each th text-xs font-semibold text-slate-400 uppercase tracking-wider. Body: 8 rows of realistic user data with divide-y divide-slate-800/60, hover:bg-slate-900/40. Name column: avatar circle (w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 with white initials) + name text. Role: colored text (Admin=purple-400, Editor=sky-400, User=slate-400). Status: pill badges (Active=emerald, Inactive=slate, Pending=amber, using bg-color-500/15 text-color-400 rounded-full). Pagination footer: "Showing 1-8 of 24" on left, page buttons on right (Previous disabled, 1 active in indigo-600, 2-3 hover:bg-slate-800, Next). Use useState for search and roleFilter with client-side filtering. Export default.

**Notes:**
- The avatar with gradient + initials is better than a generic icon
- Color-coded roles and status badges make scanning easy
- Client-side filtering with useState keeps it self-contained
- Could improve: add column sort with ascending/descending arrows, add row selection checkboxes, add bulk actions dropdown

---

### Team Profile Card Grid
**Category:** cards
**Complexity:** medium
**Key elements:** colored banner per card, avatar with initials, role badge, bio, stats row, social icons, hover lift

**Prompt:**
Create a team page on bg-[#09090b] p-8. Header: centered "Meet the Team" in text-4xl font-bold text-white, subtitle in text-slate-400. Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6, max-w-6xl mx-auto. 6 cards, each bg-slate-900 rounded-2xl overflow-hidden border border-slate-800/60 hover:scale-[1.02] hover:border-slate-700/60 transition-all duration-300. Each card: colored banner (h-24 bg-gradient-to-r, unique gradient per person — violet-to-indigo, cyan-to-blue, pink-to-rose, amber-to-orange, emerald-to-teal, fuchsia-to-purple), avatar positioned -bottom-8 left-6 absolute (w-16 h-16 rounded-xl bg-slate-900 border-4 border-slate-900 with gradient text initials), content area pt-12 px-6 pb-6 with name (text-lg font-semibold text-white), role (text-sm text-indigo-400), bio (text-sm text-slate-400), stats row with border-t (projects count, followers, rating separated by dividers), and social icon buttons row. Use realistic names and roles. Export default.

**Notes:**
- Unique gradient per card prevents monotony in a grid
- The avatar overlapping the banner creates visual connection between sections
- Stats row adds credibility
- Could improve: add a "follow" button, add hover effect on the banner, add skeleton loading state
