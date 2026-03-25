# Vision Teacher Quality Control Pipeline

## 1. System Overview

The Vision Teacher QC Pipeline is an automated quality filtering system that uses a Vision-Language Model (Claude Sonnet with vision capabilities) to evaluate rendered UI component screenshots against a multi-head scoring rubric. Its purpose is to ensure that only high-quality, visually correct, and accessible prompt outputs enter the approved prompt library, while routing uncertain cases to human reviewers and rejecting clearly deficient outputs.

The pipeline operates on `previewCode` extracted from prompt drafts or approved prompts, renders that code in a sandboxed headless browser across multiple viewports, captures screenshots, and then submits those screenshots alongside the original prompt text and expected code to a VLM for structured scoring. The resulting scores feed into a statistical filtering layer that makes routing decisions.

**Pipeline Flow:**

```
Prompt Draft
  --> previewCode extraction (from PromptDraft.metadata or Prompt.metadata)
  --> Headless Rendering Sandbox (Playwright + Chromium)
  --> Screenshots (3 viewports: desktop, tablet, mobile)
  --> VLM Scoring (Claude Sonnet vision, 4-vector rubric)
  --> Statistical Filtering (percentile isolation per category)
  --> Routing Decision:
        - Auto-approve (P90+)
        - Human review (P75-P90)
        - Low priority review (P50-P75)
        - Auto-reject (<P50 or hard floor violation)
```

---

## 2. The Sandbox: Headless Rendering Environment

**Purpose:** Convert React + Tailwind code into high-fidelity PNG screenshots suitable for VLM analysis. The sandbox must produce deterministic, production-representative renders regardless of the host environment.

### 2.1 Architecture

- **Input:** `previewCode` string from `PromptDraft.metadata.previewCode` or `Prompt.metadata.previewCode`. This is a self-contained React component (JSX) that uses Tailwind CSS for styling.
- **Template:** An HTML shell that loads React 18 via CDN, Tailwind CSS via CDN, and Babel standalone for in-browser JSX transpilation.
- **Renderer:** Playwright with headless Chromium. Playwright is chosen for its deterministic rendering, multi-viewport support, and reliable screenshot API.
- **Output:** PNG screenshots at 3 viewport sizes, saved to disk and/or object storage.

### 2.2 Viewport Specifications

| Viewport | Dimensions | Device Scale Factor | Purpose |
|----------|------------|-------------------|---------|
| Desktop  | 1920 x 1080 | 2x | Primary evaluation surface. Most prompts target desktop-first layouts. |
| Tablet   | 768 x 1024  | 2x | Responsive breakpoint check. Verifies medium-width adaptations. |
| Mobile   | 375 x 812   | 3x | Mobile responsiveness. Verifies small-screen layout integrity. |

The device scale factor ensures screenshots capture sufficient detail for VLM analysis. A 1920x1080 viewport at 2x produces a 3840x2160 PNG.

### 2.3 Rendering Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Wait strategy | `networkidle` + 2000ms buffer | Ensures CDN assets (Tailwind, React, fonts) are fully loaded before capture. `networkidle` fires when no network requests for 500ms; the additional buffer handles font swap and late CSS application. |
| Background color | `#09090b` | Matches the Softset dark theme background. Components are designed against this color. |
| Font loading | Wait for `Inter` font family via `document.fonts.ready` | Inter is the primary UI font. Fall back to system font stack if Inter fails to load within 5s. |
| Error handling | Capture `console.error` events; proceed with screenshot even if the component throws a runtime error | A broken render is still useful data: the VLM will score it poorly, which is the correct outcome. Console errors are stored alongside the screenshot for debugging. |
| Timeout | 15s max per render (all viewports combined per prompt) | Prevents hung renders from blocking the pipeline. If timeout is reached, capture whatever is currently rendered. |
| JavaScript enabled | Yes | Required for React component rendering. |
| Animations | Disabled via `prefers-reduced-motion: reduce` | Prevents mid-animation captures that would produce inconsistent screenshots. |

### 2.4 Template HTML Shell

The HTML template is a self-contained document that bootstraps the rendering environment. The `previewCode` is injected into a designated slot and transpiled in-browser via Babel standalone.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview Render</title>

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            // Match Softset theme tokens if needed
          }
        }
      }
    }
  </script>

  <!-- Inter font -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: #09090b;
      color: #fafafa;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        transition-duration: 0.001ms !important;
      }
    }
    #root { width: 100%; max-width: 1200px; }
  </style>

  <!-- React 18 CDN -->
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

  <!-- Babel standalone for JSX transpilation -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body class="dark">
  <div id="root"></div>

  <script type="text/babel" data-presets="react">
    // __PREVIEW_CODE_INJECTION_POINT__
    {{PREVIEW_CODE}}

    // Render the default export or the first named export
    const Component = typeof App !== 'undefined' ? App
                    : typeof Default !== 'undefined' ? Default
                    : () => React.createElement('div', null, 'No component found');

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(Component));
  </script>
</body>
</html>
```

The `{{PREVIEW_CODE}}` placeholder is replaced at runtime with the actual `previewCode` string. The template attempts to render a component named `App` or `Default`, which are the conventional export names used by the prompt generation system.

### 2.5 Storage

**Local development:**

```
uploads/previews/{slug}-{timestamp}-desktop.png
uploads/previews/{slug}-{timestamp}-tablet.png
uploads/previews/{slug}-{timestamp}-mobile.png
```

Where `slug` is derived from the prompt's slug field, and `timestamp` is a Unix epoch millisecond value for uniqueness.

**Production:**

Screenshots are uploaded to S3 or Cloudflare R2 via a `StorageProvider` adapter interface. The adapter abstracts the storage backend and returns a public or signed URL.

```
s3://bucket/previews/{promptId}/{timestamp}/desktop.png
s3://bucket/previews/{promptId}/{timestamp}/tablet.png
s3://bucket/previews/{promptId}/{timestamp}/mobile.png
```

**Database records:**

Each screenshot is tracked as a `PromptPreview` record:

| Field | Desktop | Tablet | Mobile |
|-------|---------|--------|--------|
| `type` | `screenshot` | `screenshot-tablet` | `screenshot-mobile` |
| `url` | Path or URL to the PNG | Path or URL to the PNG | Path or URL to the PNG |
| `promptId` or `draftId` | FK to the source record | FK to the source record | FK to the source record |

---

## 3. Multi-Head Scoring Rubric

The VLM evaluates each screenshot across 4 independent scoring vectors. Each vector produces a score from 1 to 10 with accompanying reasoning. The vectors are designed to be orthogonal: a component can score highly on visual fidelity but poorly on accessibility, and the composite score reflects both signals.

### 3.1 Vector 1: Visual Fidelity (Weight: 0.30)

Score 1-10. Evaluates adherence to modern UI design patterns and overall visual polish.

**Criteria:**

- **Spacing consistency:** Uniform padding and margins throughout the component. No crowded or unevenly spaced elements.
- **Typography hierarchy:** Clear distinction between headings, body text, and captions. Consistent font weights and sizes within each level.
- **Color harmony:** Cohesive color palette. Proper use of contrast between foreground and background. No jarring color combinations.
- **Layout balance:** Proper alignment (grid or flexbox discipline). Intentional whitespace distribution. Clear visual flow from top to bottom and left to right.
- **Modern patterns:** Appropriate use of rounded corners, subtle shadows, gradients, and other contemporary UI conventions. Not dated or overly skeuomorphic.
- **Polish:** No rough edges, jagged borders, or inconsistent border radii. Smooth visual transitions between sections.

**Scoring Guide:**

| Score Range | Description |
|-------------|-------------|
| 9-10 | Professional-grade. Could ship in a production application today without design review. |
| 7-8 | Good quality. Minor polish improvements possible, but fundamentally sound. |
| 5-6 | Acceptable but noticeable design issues. Functional but lacks refinement. |
| 3-4 | Significant visual problems. Amateur appearance. Multiple spacing, color, or layout issues. |
| 1-2 | Broken or unusable visual design. Missing styles, chaotic layout, or completely unstyled. |

### 3.2 Vector 2: Code-Prompt Alignment (Weight: 0.25)

Score 1-10. Measures how accurately the rendered visual result reflects the original prompt's intent. This is the "did we build what was asked for?" vector.

**Criteria:**

- **Element presence:** All UI elements specified in the prompt are rendered and visible in the screenshot.
- **Style accuracy:** Colors, sizes, and visual treatments match what was described or implied in the prompt.
- **Layout match:** The spatial arrangement of elements matches the described or implied layout.
- **Interaction hints:** Interactive elements (buttons, inputs, toggles, links) are visually distinguishable and look functional even in a static screenshot.
- **Feature completeness:** No features or sections specified in the prompt are missing from the render.

**Evaluation Method:**

The VLM cross-references three artifacts to assess alignment:

1. **The prompt text** (what was asked for) - the natural language description of the desired component.
2. **The expected output code** (what was supposed to be generated) - the `previewCode` that represents the system's response to the prompt.
3. **The actual screenshot** (what was rendered) - the visual result of executing that code.

Misalignment can occur at two joints: the code may not faithfully implement the prompt (a generation quality issue), or the code may not render as expected (a rendering issue). Both are captured by this vector.

### 3.3 Vector 3: Technical Correctness (Weight: 0.25)

Score 1-10. Detects visual artifacts, rendering issues, and layout bugs visible in the screenshot.

**Criteria:**

- **No overflow:** Content stays within its container bounds. No horizontal scrollbars or content extending beyond the viewport.
- **No clipping:** Text and elements are not cut off at container edges.
- **No overlapping:** Elements are properly stacked and positioned. No unintentional z-index conflicts.
- **Responsive integrity:** Layout adapts properly across the three viewports without breaking.
- **Text legibility:** All text renders clearly and completely at its specified size. No text rendered at 0px or hidden behind other elements.
- **Image/icon rendering:** SVGs, icons, and images display correctly. No broken image placeholders or missing icon glyphs.

**Multi-viewport scoring:**

When scoring technical correctness, the VLM evaluates all three viewport screenshots and produces a weighted sub-score:

| Viewport | Weight | Rationale |
|----------|--------|-----------|
| Desktop  | 0.5 | Primary usage context for most components. |
| Tablet   | 0.3 | Important breakpoint for responsive validation. |
| Mobile   | 0.2 | Critical but narrower evaluation surface. |

```
S_technical = 0.5 * S_desktop + 0.3 * S_tablet + 0.2 * S_mobile
```

### 3.4 Vector 4: Accessibility (Weight: 0.20)

Score 1-10. Visual verification of accessibility principles based on what can be inferred from a screenshot.

**Criteria:**

- **Contrast ratios:** Text is clearly readable against its background. Approximates WCAG AA compliance (4.5:1 for normal text, 3:1 for large text) based on visual inspection.
- **Touch target sizing:** Buttons, links, and interactive elements appear to be at least 44x44px (the WCAG 2.5.5 minimum).
- **Text sizing:** Body text appears to be at least 14px. No critical information rendered in text smaller than 12px.
- **Focus indicators:** Interactive elements are visually distinguishable from static content (distinct borders, backgrounds, or other affordances).
- **Color independence:** Information is not conveyed solely by color. Icons, labels, or patterns supplement color-coded information.
- **Heading structure:** Visual hierarchy suggests proper semantic heading levels (largest/boldest text at top, progressive reduction).

**Important caveat:** This is a visual approximation, not a programmatic WCAG audit. The VLM can detect likely accessibility issues from a screenshot but cannot verify DOM structure, ARIA attributes, keyboard navigation, or screen reader compatibility. Full WCAG compliance verification requires separate tooling (e.g., axe-core) and is outside the scope of this pipeline.

### 3.5 Composite Score Calculation

The composite score is a weighted average of the four vector scores:

```
S_composite = 0.30 * S_visual + 0.25 * S_alignment + 0.25 * S_technical + 0.20 * S_accessibility
```

- **Score range:** 1.0 to 10.0
- **Precision:** Two decimal places (e.g., 7.85)

The weights reflect the relative importance of each vector for the prompt library use case: visual quality is the strongest signal (users judge prompts by appearance first), alignment and technical correctness are equally critical (a beautiful component that doesn't match the prompt or has rendering bugs is useless), and accessibility is important but receives lower weight because the visual-only assessment is inherently approximate.

### 3.6 VLM Prompt Template

The following structured prompt is sent to Claude Sonnet (vision) for each evaluation. It is designed for deterministic, structured output.

**API configuration:**
- Model: `claude-sonnet-4-20250514` (or latest Sonnet with vision)
- Temperature: `0` (deterministic output)
- Max tokens: `2048`
- System prompt: See below

**System prompt:**

```
You are a senior UI/UX quality assessor specializing in React component evaluation. You analyze rendered screenshots of UI components and score them on a standardized rubric. You are precise, consistent, and calibrated. Your scores should reflect what a professional design reviewer would assess.

You will receive:
1. The original prompt that described what the component should be
2. The code that was generated in response to that prompt
3. Screenshots of the rendered component at up to 3 viewport sizes

You must return a JSON object with scores and reasoning for each evaluation vector. Be specific in your reasoning — reference concrete visual elements you observe in the screenshot.
```

**User message template:**

```
Evaluate this rendered UI component.

## Original Prompt

The user requested the following component:

<prompt>
{prompt_content}
</prompt>

## Generated Code

The following code was generated in response:

<code>
{preview_code}
</code>

## Rendered Screenshots

The following screenshots show the rendered result at different viewport sizes.

[Image 1: Desktop viewport (1920x1080 @2x)]
[Image 2: Tablet viewport (768x1024 @2x)]
[Image 3: Mobile viewport (375x812 @3x)]

## Scoring Instructions

Score this component on 4 vectors, each from 1 to 10. For each vector, provide a score and 2-3 sentences of specific reasoning referencing what you observe in the screenshots.

### Vector 1: Visual Fidelity (Weight: 0.30)
Evaluate spacing consistency, typography hierarchy, color harmony, layout balance, modern design patterns, and overall polish.
- 9-10: Professional-grade, production-ready
- 7-8: Good quality, minor polish improvements possible
- 5-6: Acceptable but noticeable design issues
- 3-4: Significant visual problems
- 1-2: Broken or unusable visual design

### Vector 2: Code-Prompt Alignment (Weight: 0.25)
Evaluate whether all specified elements are present, styles match the prompt, layout matches, interactive elements are distinguishable, and no features are missing.
- 9-10: Perfect match to prompt intent
- 7-8: Mostly matches, minor omissions
- 5-6: Partial match, some features missing or incorrect
- 3-4: Significant deviation from prompt
- 1-2: Bears little resemblance to what was requested

### Vector 3: Technical Correctness (Weight: 0.25)
Evaluate across all viewports for overflow, clipping, overlapping, responsive integrity, text legibility, and icon/image rendering. Weight desktop 50%, tablet 30%, mobile 20%.
- 9-10: No rendering issues across all viewports
- 7-8: Minor issues in one viewport
- 5-6: Noticeable issues in multiple viewports
- 3-4: Significant rendering problems
- 1-2: Component fails to render or is completely broken

### Vector 4: Accessibility (Weight: 0.20)
Visually assess contrast ratios, touch target sizing (>=44px), text sizing (>=14px body), focus indicators, color independence, and heading structure.
- 9-10: Excellent visual accessibility indicators
- 7-8: Good accessibility, minor concerns
- 5-6: Some accessibility issues visible
- 3-4: Multiple accessibility problems
- 1-2: Severe accessibility failures

## Required Output Format

Return ONLY valid JSON with no additional text:

{
  "visual_fidelity": {
    "score": <number 1-10>,
    "reasoning": "<2-3 sentences>"
  },
  "code_prompt_alignment": {
    "score": <number 1-10>,
    "reasoning": "<2-3 sentences>"
  },
  "technical_correctness": {
    "score": <number 1-10>,
    "reasoning": "<2-3 sentences>",
    "viewport_scores": {
      "desktop": <number 1-10>,
      "tablet": <number 1-10>,
      "mobile": <number 1-10>
    }
  },
  "accessibility": {
    "score": <number 1-10>,
    "reasoning": "<2-3 sentences>"
  },
  "composite": <number, computed as 0.30*visual + 0.25*alignment + 0.25*technical + 0.20*accessibility>,
  "summary": "<1 sentence overall assessment>",
  "critical_issues": ["<list any deal-breaker issues, or empty array>"]
}
```

The `critical_issues` array provides an escape hatch for the VLM to flag problems that might not be fully captured by the numeric scores (e.g., "component renders a blank white screen" or "text is in a foreign language not matching the prompt").

---

## 4. Filter Logic: 90th Percentile Isolation

The filtering layer converts raw VLM scores into routing decisions. It combines absolute thresholds (hard floors) with relative thresholds (percentile gates) to account for both minimum quality standards and within-batch quality distribution.

### 4.1 Batch Processing

The pipeline operates on batches rather than individual prompts. A batch is a set of prompts generated together, typically within the same category.

**Batch processing steps:**

1. **Generate:** Create N prompts per category. Recommended batch size: 50-100 per category. Smaller batches produce less stable percentile calculations.
2. **Render:** Pass all prompts through the headless rendering sandbox. Capture 3 screenshots per prompt (desktop, tablet, mobile). Total: 3N screenshots per batch.
3. **Score:** Submit all screenshot sets to the VLM for scoring. Each prompt produces one `QualityScore` record with 4 vector scores and a composite.
4. **Compute statistics:** Calculate per-category percentiles from the batch's composite scores.
5. **Route:** Apply hard floors and percentile gates to determine each prompt's disposition.

### 4.2 Statistical Thresholds

**Hard Floor (absolute minimum quality):**

These thresholds apply regardless of percentile ranking. A prompt that violates a hard floor is auto-rejected even if it would otherwise rank highly within a weak batch.

| Condition | Action | Rationale |
|-----------|--------|-----------|
| Any single vector score < 5/10 | Auto-reject | A score below 5 on any vector indicates a fundamental quality failure that cannot be offset by other vectors. |
| Composite score < 6.0 | Auto-reject | Below 6.0 composite indicates the prompt is below acceptable quality on average across all vectors. |
| Any `critical_issues` flagged by VLM | Route to human review (minimum) | Critical issues override percentile-based auto-approve. |

**Percentile Gates (relative, per-category, recalculated per batch):**

After hard floor filtering, remaining prompts are ranked by composite score within their category and routed based on percentile position.

| Percentile Range | Action | Description |
|------------------|--------|-------------|
| >= P90 | Auto-approve | Top 10% of the batch. These prompts enter the approved queue without human intervention. |
| P75 - P90 | Human review (high priority) | Strong quality. Likely approvable, but benefits from human validation. |
| P50 - P75 | Human review (low priority) | Acceptable quality. Review if reviewer capacity allows. |
| < P50 | Auto-reject | Below median for the batch. Logged with VLM reasoning for analysis but not queued for review. |

### 4.3 Percentile Calculation

Percentiles are computed independently for each category within each batch.

```python
import numpy as np

def compute_thresholds(scores_by_category: dict[str, list[float]]) -> dict:
    """
    Args:
        scores_by_category: { "category_slug": [composite_score, ...], ... }

    Returns:
        { "category_slug": { "p90": float, "p75": float, "p50": float }, ... }
    """
    thresholds = {}
    for category, scores in scores_by_category.items():
        thresholds[category] = {
            "p90": np.percentile(scores, 90),
            "p75": np.percentile(scores, 75),
            "p50": np.percentile(scores, 50),
            "count": len(scores),
            "mean": np.mean(scores),
            "std": np.std(scores),
        }
    return thresholds
```

The `mean` and `std` values are stored for monitoring. A batch with unusually low mean or high standard deviation suggests either a generation quality regression or a rubric calibration issue.

### 4.4 Cold Start

Until sufficient historical data exists, percentile-based auto-approval is unsafe because the thresholds are unstable.

**Cold start rules:**

| Condition | Behavior |
|-----------|----------|
| < 30 scored prompts in category | No percentile calculation. All non-hard-floor-rejected prompts go to human review. |
| 30-99 scored prompts in category | Percentiles computed but auto-approve disabled. Auto-reject for < P50 is active. P50+ goes to human review. |
| >= 100 scored prompts in category | Full percentile gating active. Auto-approve for P90+ enabled. |

Thresholds from previous batches are used as priors but are recalculated with each new batch. A rolling window of the most recent 500 scores per category is used for percentile calculation once sufficient data exists, preventing early low-quality scores from permanently skewing thresholds.

### 4.5 Calibration Against Human Scores

The VLM scoring system must be continuously validated against human judgment to ensure it remains calibrated.

**Calibration data source:** When a human reviewer scores a prompt (via `ReviewDecision.score` and vector-level scores if available), that score is compared to the VLM's score for the same prompt.

**Metrics tracked:**

```
For each vector v in {visual, alignment, technical, accessibility}:
  MAE_v = mean(|VLM_score_v - Human_score_v|) over all doubly-scored prompts
  Bias_v = mean(VLM_score_v - Human_score_v)  // positive = VLM overscores
```

**Calibration rules:**

| Condition | Action |
|-----------|--------|
| MAE > 1.5 on any vector | Flag vector for rubric refinement. Pause auto-approve until resolved. |
| Bias > +1.0 on any vector | VLM is systematically overscoring. Tighten scoring criteria in VLM prompt for that vector. |
| Bias < -1.0 on any vector | VLM is systematically underscoring. Relax scoring criteria in VLM prompt for that vector. |
| MAE > 2.0 on composite | Halt auto-approve entirely. Full recalibration required. |

---

## 5. Data Model: QualityScore

The `QualityScore` model stores all scoring results, whether from the VLM or from human reviewers.

```prisma
model QualityScore {
  id                 String   @id @default(cuid())

  // Polymorphic reference: either a published prompt or a draft
  promptId           String?
  prompt             Prompt?  @relation(fields: [promptId], references: [id])
  draftId            String?
  draft              PromptDraft? @relation(fields: [draftId], references: [id])

  // Individual vector scores (1.0 - 10.0)
  scoreVisual        Float    // Visual Fidelity
  scoreAlignment     Float    // Code-Prompt Alignment
  scoreTechnical     Float    // Technical Correctness
  scoreAccessibility Float    // Accessibility

  // Weighted composite (1.0 - 10.0)
  compositeScore     Float

  // Percentile rank within the scoring batch/category (0.0 - 100.0)
  // Null if insufficient data for percentile calculation
  percentile         Float?

  // Scorer identification
  // Format: 'vlm-claude-sonnet-4-20250514' for VLM scores
  //         'human-{userId}' for human reviewer scores
  scoredBy           String

  // VLM reasoning per vector (JSON blob)
  // Structure: {
  //   visual_fidelity: { reasoning: string },
  //   code_prompt_alignment: { reasoning: string },
  //   technical_correctness: { reasoning: string, viewport_scores: { desktop, tablet, mobile } },
  //   accessibility: { reasoning: string },
  //   summary: string,
  //   critical_issues: string[]
  // }
  reasoning          Json?

  // Screenshot URLs used for this scoring (JSON blob)
  // Structure: { desktop: string, tablet: string, mobile: string }
  screenshotUrls     Json?

  // Batch identifier: links scores from the same generation/scoring run
  batchId            String?

  // Routing decision made based on this score
  // Values: 'auto-approved', 'human-review', 'low-priority-review', 'auto-rejected'
  routingDecision    String?

  // Category of the prompt at time of scoring (denormalized for query performance)
  category           String?

  createdAt          DateTime @default(now())

  @@index([promptId])
  @@index([draftId])
  @@index([compositeScore])
  @@index([scoredBy])
  @@index([batchId])
  @@index([category, compositeScore])
  @@index([category, createdAt])
}
```

**Key design decisions:**

- `promptId` and `draftId` are both nullable to support scoring at either stage of the prompt lifecycle.
- `scoredBy` uses a string format rather than a foreign key to accommodate both VLM and human scorers without a polymorphic relationship.
- `reasoning` is stored as JSON rather than a related table because it is always read alongside the score and never queried independently.
- `category` is denormalized from the prompt to enable efficient per-category percentile queries without joins.
- The `[category, compositeScore]` compound index supports the percentile calculation query pattern.

---

## 6. Human Review Feedback Loop

The human review process serves dual purposes: it validates individual prompts that fall in the review band, and it generates calibration data that improves the VLM scoring system over time.

### 6.1 Score Reconciliation

When a human reviewer scores a prompt that also has a VLM score, the system performs automatic reconciliation.

**Reconciliation process:**

1. Retrieve the VLM `QualityScore` for the prompt.
2. Retrieve the human `QualityScore` (created from the `ReviewDecision`).
3. Compute per-vector deltas:
   ```
   delta_visual     = |VLM.scoreVisual - Human.scoreVisual|
   delta_alignment  = |VLM.scoreAlignment - Human.scoreAlignment|
   delta_technical  = |VLM.scoreTechnical - Human.scoreTechnical|
   delta_access     = |VLM.scoreAccessibility - Human.scoreAccessibility|
   delta_composite  = |VLM.compositeScore - Human.compositeScore|
   ```
4. If any single-vector delta exceeds 2.0, flag the pair as a **disagreement** for investigation.
5. Store deltas in a running calibration log.

**Disagreement investigation:** When a delta > 2 disagreement is flagged, the prompt, its screenshots, and both scores are surfaced in an admin dashboard for a senior reviewer to adjudicate. The adjudication result informs rubric refinement.

### 6.2 Rubric Refinement Triggers

The system monitors calibration metrics and triggers refinement actions when systematic issues are detected.

| Pattern Detected | Trigger Condition | Refinement Action |
|-----------------|-------------------|-------------------|
| VLM overscoring (overall) | Mean bias > +1.5 across 50+ comparisons | Add stricter language to VLM prompt. Raise the bar in scoring guide descriptions. |
| VLM underscoring (overall) | Mean bias < -1.5 across 50+ comparisons | Soften scoring language. Adjust scoring guide to be more generous at each level. |
| VLM overscoring on specific vector | Per-vector bias > +1.0 | Add vector-specific tightening language. Include negative examples for that vector. |
| Category-specific bias | Bias > +/-1.5 for a specific category | Add category-specific scoring instructions to the VLM prompt (e.g., "For dashboard components, pay particular attention to data density and information hierarchy"). |
| High variance | Per-vector standard deviation of deltas > 2.0 | VLM scoring is inconsistent. Review prompt for ambiguity. Add more specific criteria and examples. |

Rubric refinements are versioned. When the VLM prompt is updated, the `scoredBy` field reflects the new version (e.g., `vlm-claude-sonnet-4-20250514-v2`), enabling before/after comparison of calibration metrics.

### 6.3 Bootstrapping Timeline

The pipeline transitions through phases as calibration data accumulates. Each phase unlocks more automation.

| Phase | Scored Prompts (per category) | VLM Behavior | Human Behavior | Expected Duration |
|-------|-------------------------------|--------------|----------------|-------------------|
| **Phase 0: Data Collection** | 0 - 100 | Scoring enabled, results logged only. No routing decisions from VLM. | All prompts go through manual review. Reviewers provide per-vector scores. | 1-2 weeks |
| **Phase 1: Shadow Mode** | 100 - 500 | VLM scoring active. Routing suggestions generated but not enforced. | Human reviews all prompts. VLM suggestions shown alongside for comparison. | 2-4 weeks |
| **Phase 2: Assisted Rejection** | 500 - 1,000 | VLM auto-rejects < P50 prompts. P50+ goes to human review. | Humans review P50+ prompts. Spot-check 10% of auto-rejections. | 2-4 weeks |
| **Phase 3: Full Gating** | 1,000+ | VLM auto-approves P90+, auto-rejects < P50. P50-P90 to human review. | Humans review P50-P90 band. Spot-check 5% of auto-approvals. | Ongoing |
| **Phase 4: Spot-Check Mode** | 5,000+ | Full autonomous routing. All percentile gates active. | Humans spot-check 10% random sample across all routing decisions. Focus on disagreement investigation. | Ongoing |

Phase transitions are gated on calibration metrics: a phase advances only when the MAE per vector is below 1.5 and the composite MAE is below 1.0 for the most recent 100 comparisons.

---

## 7. Operational Considerations

### 7.1 Cost Estimation

| Component | Per-prompt Cost | Notes |
|-----------|----------------|-------|
| Headless rendering (3 viewports) | ~$0.001 | Playwright compute on a standard server. Dominated by CDN fetch time, not compute. |
| VLM scoring (Claude Sonnet vision) | ~$0.01 - $0.03 | Input: 3 screenshots (~500KB total as base64) + prompt text + code (~2K tokens). Output: ~500 tokens. Priced at Sonnet vision rates. |
| Storage (3 PNGs) | ~$0.0001 | ~200KB per screenshot, S3/R2 storage is negligible. |
| **Total per prompt** | **~$0.013 - $0.033** | |
| **Batch of 100 prompts** | **~$1.30 - $3.30** | |

At scale, the primary cost driver is VLM scoring. Screenshot size can be optimized (JPEG instead of PNG, lower resolution) to reduce input token costs if needed.

### 7.2 Latency

| Stage | Per-prompt Latency | Notes |
|-------|-------------------|-------|
| Template injection + page load | ~2s | CDN fetches for React, Tailwind, fonts. |
| Render stabilization (networkidle + buffer) | ~3s | Waiting for fonts, CSS application, React hydration. |
| Screenshot capture (3 viewports) | ~1s | Playwright viewport resize + screenshot is fast. |
| VLM API call | ~8-12s | Depends on input size and API load. Vision calls are slower than text-only. |
| Score parsing + storage | <0.5s | JSON parse + database write. |
| **Total per prompt (sequential)** | **~15s** | |

**Batch parallelization:**

| Concurrency | Batch of 100 | Notes |
|-------------|-------------|-------|
| 1 (sequential) | ~25 minutes | Not recommended. |
| 5 | ~5 minutes | Recommended default. Balances throughput with API rate limits. |
| 10 | ~2.5 minutes | May hit Playwright memory limits on smaller instances. |
| 20 | ~1.5 minutes | Requires dedicated rendering infrastructure. May hit API rate limits. |

Rendering and scoring can be pipelined: as soon as a prompt's screenshots are captured, its VLM scoring can begin while the next prompt renders. This reduces effective latency by ~30%.

### 7.3 Error Handling

| Error Condition | Detection | Response | Retry Policy |
|----------------|-----------|----------|--------------|
| **Render timeout** (>15s) | Playwright timeout event | Capture whatever is currently rendered. Flag as `render_timeout` in metadata. | No retry. Screenshot of partial render is still scored (VLM will give it a low technical score). |
| **Render crash** (Chromium crash) | Playwright `page.on('crash')` | Log the crash. No screenshot captured. | Retry once with a fresh browser context. If second attempt fails, skip scoring and route to manual review. |
| **CDN unavailable** (React/Tailwind fail to load) | `console.error` for failed script loads | Screenshot will show unstyled or blank content. Flag as `cdn_failure`. | Retry once after 30s. If persistent, alert ops team — likely an infrastructure issue. |
| **VLM API timeout** (>30s) | HTTP timeout | Log the timeout. | Retry up to 2 times with exponential backoff (30s, 60s). After 3 failures, route prompt to manual review without a VLM score. |
| **VLM rate limit** (429) | HTTP 429 response | Queue the request for later processing. | Exponential backoff starting at the `Retry-After` header value. |
| **VLM response parse failure** (invalid JSON) | JSON.parse throws | Log the raw VLM response for investigation. | Retry once with a stricter prompt suffix: "Remember: return ONLY valid JSON." If second attempt fails, route to manual review. |
| **VLM score out of range** (<1 or >10) | Validation check | Clamp to [1, 10] range. Log the anomaly. | No retry. Clamped score is used. |
| **Storage write failure** | S3/R2 API error | Retry upload. Screenshots are also on local disk as fallback. | Retry up to 3 times. If persistent, continue with local file paths. |

### 7.4 Monitoring and Alerting

The following metrics should be tracked and alerted on:

| Metric | Alert Threshold | Indicates |
|--------|----------------|-----------|
| Mean composite score (per category, rolling 7d) | Drop > 1.0 from baseline | Generation quality regression or rubric drift. |
| VLM scoring latency (p95) | > 20s | API performance degradation. |
| Render failure rate | > 5% of batch | Infrastructure issue or code generation regression. |
| VLM parse failure rate | > 2% of batch | VLM prompt needs adjustment. |
| Auto-reject rate (per category) | > 60% of batch | Category may need generation prompt improvements. |
| Human-VLM disagreement rate | > 20% of reviewed prompts | Rubric calibration needed. |
