# Dynamic Temporal LoRA Pipeline — Architecture Specification

> **Status:** Draft
> **Last Updated:** 2026-03-25
> **Owner:** Softset Engineering

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Temporal Weighting Strategy](#2-temporal-weighting-strategy)
3. [LoRA Management Layer](#3-lora-management-layer)
4. [Golden Dataset Benchmark — "Invariant Suite"](#4-golden-dataset-benchmark--invariant-suite)
5. [Training Data Construction](#5-training-data-construction)
6. [Learning from Manual Review — Bootstrapping](#6-learning-from-manual-review--bootstrapping)
7. [Monitoring & Alerting](#7-monitoring--alerting)
8. [Infrastructure Requirements](#8-infrastructure-requirements)

---

## 1. System Overview

A continual learning system that incorporates the latest UI design trends into Softset's prompt generation model while preventing catastrophic forgetting. The system learns from human review decisions and VLM quality scores, applies temporal weighting to favor recent trends, and uses a Golden Dataset benchmark to ensure core competencies never regress.

### Key Design Goals

- **Daily model updates** reflecting current UI trends
- **No regression** on core/timeless UI patterns
- **Human review decisions** as the primary training signal
- **Automated evaluation gating** before any model update ships

### Pipeline Flow

```
Human Reviews + VLM Scores
        |
        v
  Temporal Weighting
        |
        v
  Training Dataset Construction
        |
        v
  LoRA Fine-tuning
        |
        v
  Golden Dataset Evaluation
        |
        v
  Gate Check
        |
   +----+----+
   |         |
Deploy    Rollback
```

Each stage is described in detail in the sections that follow.

---

## 2. Temporal Weighting Strategy

The core insight: not all training data is equally relevant. A prompt approved yesterday reflects current trends more accurately than one approved three months ago. Temporal weighting encodes this directly into the training loss.

### 2.1 Decay Function

The weight of a data point decreases exponentially with age:

```
W(t) = e^{-lambda * (T - t)}
```

Where:

| Symbol | Meaning |
|--------|---------|
| `T` | Current time (epoch seconds / 86400, i.e., in days) |
| `t` | Data point creation time (same units) |
| `lambda` | Decay rate controlling the half-life |
| `W(t)` | Weight applied to the data point's loss contribution |

**Half-life relationship:**

```
t_{1/2} = ln(2) / lambda ~= 0.693 / lambda
```

A data point at exactly one half-life old contributes 50% of its original weight. At two half-lives, 25%. This provides a smooth, well-understood decay curve.

### 2.2 Tuning lambda

Different UI categories evolve at different rates. A login form looks roughly the same as it did two years ago; a landing page hero section follows quarterly design trends. We assign different decay rates accordingly.

| lambda Value | Half-life | Use Case |
|---|---|---|
| 0.01 | 69 days | Core stability (forms, auth, tables) |
| 0.03 | 23 days | Balanced (cards, headers, dashboards) |
| 0.05 | 14 days | Trend-sensitive (animations, backgrounds, landing pages) |
| 0.10 | 7 days | Fast trends (experimental, seasonal) |

#### Per-Category lambda Assignment

**Stable (lambda = 0.01):**

| Category | Rationale |
|---|---|
| Forms & Inputs | Form patterns rarely change; accessibility and usability dominate |
| Authentication | Login/signup is standardized across the industry |
| Tables & Lists | Data display is functional, not trendy |
| Checkout & Payments | Compliance-driven, conservative by necessity |

**Balanced (lambda = 0.03):**

| Category | Rationale |
|---|---|
| Cards & Tiles | Subtle style shifts over time (shadows, borders, spacing) |
| Headers & Navigation | Responsive patterns evolve slowly |
| Dashboards | Layout trends shift roughly quarterly |
| Footers | Minimal trend influence |
| Modals & Overlays | Dialog patterns are stable but styling shifts |

**Trend-sensitive (lambda = 0.05):**

| Category | Rationale |
|---|---|
| Landing Pages | Hero design trends shift monthly (bento, asymmetric, 3D) |
| Animations & Effects | Motion trends are highly cyclical |
| Backgrounds & Patterns | Gradient/glassmorphism trends are volatile |

### 2.3 Weighted Loss Function

During fine-tuning, each training sample's loss contribution is scaled by its temporal weight:

```
L_total = sum_i [ W(t_i) * L(x_i, y_i) ]
```

Where `L(x_i, y_i)` is the standard cross-entropy loss for sample `i`.

**Normalization:** Weights are normalized per-batch to prevent gradient scale issues:

```
W_norm(t_i) = W(t_i) / max(W(t_j) for j in batch)
```

This ensures the maximum weight in any batch is always 1.0, preventing the effective learning rate from changing as the dataset ages.

### 2.4 Trend Detection

Track the distribution of composite quality scores over sliding windows to detect emerging or fading trends:

- **7-day window:** "this week's quality"
- **30-day window:** "this month's quality"

**Detection rules:**

| Condition | Interpretation | Action |
|---|---|---|
| 7-day mean drops below 30-day mean by > 1 sigma | Potential trend shift; model output drifting from reviewer expectations | Flag for investigation |
| 7-day mean rises above 30-day mean by > 1 sigma | New trend emerging; model is catching up | Temporarily increase lambda to accelerate learning |

This allows the system to self-adjust: when trends shift rapidly, the decay rate increases to downweight stale data faster.

---

## 3. LoRA Management Layer

### 3.1 Primary Strategy: Rolling Single LoRA

For the initial system, a single LoRA adapter is updated daily. This keeps the architecture simple and the training pipeline deterministic.

**Architecture:**

```
Base Model (frozen)
  +-- LoRA Adapter (rank 16, alpha 32)
        +-- Updated daily with weighted dataset
```

#### Daily Update Cycle

| Time (UTC) | Step |
|---|---|
| 00:00 | Collect all new review decisions from past 24h |
| 00:05 | Construct weighted training dataset (all approved prompts, weighted by W(t)) |
| 00:15 | Fine-tune LoRA adapter (1 epoch over weighted dataset) |
| 00:45 | Run Golden Dataset evaluation |
| 01:00 | Gate check: deploy or rollback |
| 01:05 | Archive previous checkpoint |

#### LoRA Hyperparameters

| Parameter | Value | Notes |
|---|---|---|
| Rank (r) | 16 | Balance between capacity and efficiency |
| Alpha (alpha) | 32 | Effective scaling = alpha/r = 2.0 |
| Dropout | 0.05 | Light regularization |
| Target modules | q_proj, v_proj | Attention layers only |
| Learning rate | 2e-5 | With cosine schedule |
| Warmup | 10% of steps | Prevents early instability |
| Batch size | 4 | With gradient accumulation of 8 (effective 32) |
| Max sequence length | 4096 | Covers all prompt + code output |

#### Checkpoint Management

- **Daily:** Keep last 7 daily checkpoints (rolling window)
- **Weekly:** Merge the best-performing checkpoint of the week into a "weekly base"
- **Monthly:** Archive weekly bases for long-term rollback capability
- **Naming convention:** `lora-YYYY-MM-DD-HHmm` (e.g., `lora-2026-03-25-0045`)

### 3.2 Future: Mixture of Experts (MoE) Approach

The single-LoRA approach works well when categories have similar quality profiles. As the system matures, category-specific divergence may warrant specialization.

**When to transition:** Monitor the ratio of between-category variance to within-category variance:

```
F = sigma_between_categories / sigma_within_categories
```

If `F > 2.0` consistently (measured over 30+ days), categories are diverging enough that a single adapter cannot serve them all well. At that point, transition to MoE.

**MoE Architecture:**

```
Router (category-based, deterministic)
  |
  +-- LoRA_stable    --> Forms, Auth, Tables, Checkout
  |
  +-- LoRA_balanced  --> Cards, Headers, Dashboards, Footers, Modals
  |
  +-- LoRA_trending  --> Landing Pages, Animations, Backgrounds
```

**Key design decisions:**

- **Routing:** Deterministic by category slug. No learned router is needed because the category is known at request time.
- **Shared base:** General component structure, Tailwind syntax, React patterns (encoded in frozen base model).
- **Specialized adapters:** Category-specific styling, layout patterns, trend adaptation.
- **Cross-pollination:** 10% of each adapter's training data comes from categories assigned to other adapters. This prevents complete specialization and maintains the model's ability to generalize.

### 3.3 Rollback Protocol

Rollback is the safety net. The system must be able to revert to a known-good state within minutes.

**Automatic rollback triggers:**

| Condition | Severity | Action |
|---|---|---|
| Golden Dataset pass@1 < 99% | Warning | Rollback to previous day's checkpoint |
| Golden Dataset pass@1 < 97% | Critical | Rollback to last weekly base + alert engineering |
| Any single category pass@1 < 95% | Critical | Rollback + investigate category-specific regression |

**Manual rollback command:**

```
pnpm lora:rollback -- --to <checkpoint-id>
```

**Rollback verification:** After any rollback, the Golden Dataset evaluation runs again to confirm the restored checkpoint meets all gate criteria.

---

## 4. Golden Dataset Benchmark — "Invariant Suite"

The Golden Dataset is the most important safeguard in the system. It represents 500 prompts covering timeless, fundamental UI patterns that must always produce high-quality output regardless of trend shifts.

If a model update passes the Golden Dataset, we have high confidence it has not forgotten how to generate core UI components. If it fails, we know immediately and roll back before any user is affected.

### 4.1 Composition

500 prompts distributed across all 12 categories:

| Category | Count | Example Prompts |
|---|---|---|
| Landing Pages | 50 | Classic centered hero, Split hero with image, Feature grid below fold, Testimonials section, CTA with email signup |
| Headers & Navigation | 40 | Sticky top navbar, Sidebar with sections, Mobile hamburger menu, Breadcrumb trail, Search header |
| Cards & Tiles | 50 | Product card with image, Profile card with avatar, Pricing card, Blog post card, Stat card with icon |
| Forms & Inputs | 50 | Email/password login, Multi-step wizard, Contact form with validation, Search with filters, File upload |
| Authentication | 40 | Full-page login, Split-screen signup, OTP code input, Password reset, Social login buttons |
| Checkout & Payments | 30 | 3-tier pricing table, Shopping cart, Credit card form, Order summary, Subscription toggle |
| Animations & Effects | 40 | Skeleton loader, Spinner, Fade-in on scroll, Button hover effect, Loading progress bar |
| Backgrounds & Patterns | 30 | Linear gradient, Radial gradient, Dot grid, Mesh gradient, Noise texture |
| Footers | 30 | 4-column with links, Minimal centered, Newsletter signup, With social icons, With app download |
| Dashboards | 50 | 4-stat card row, Sidebar + content, Data chart placeholder, Activity feed, Settings page |
| Modals & Overlays | 40 | Confirmation dialog, Image lightbox, Toast notification, Cookie banner, Command palette |
| Tables & Lists | 50 | Sortable data table, Simple list, Expandable rows, Kanban columns, Timeline view |

### 4.2 Invariant Properties

Each Golden Dataset prompt is annotated with invariant properties that MUST hold after every model update. These are not aspirational targets — they are hard requirements.

#### Structural Invariants

- All elements specified in the prompt are present in the rendered output
- Layout matches the described arrangement (e.g., "sidebar left, content right")
- No elements overflow the viewport at the target resolution

#### Visual Invariants

- Composite VLM score >= 7.0
- No single vector score < 5.0 (no dimension can be catastrophically bad)
- Dark theme variants render correctly when specified

#### Responsive Invariants

- Desktop layout (1280px) renders without horizontal scroll
- Mobile layout (375px) stacks appropriately
- No text smaller than 12px on mobile viewports

### 4.3 Evaluation Protocol

#### Daily Evaluation (Automated)

1. **Generate:** Run all 500 prompts through the candidate model
2. **Render:** Produce 1,500 screenshots (500 prompts x 3 viewports: 375px, 768px, 1280px)
3. **Score:** Evaluate all screenshots with VLM scoring pipeline
4. **Compute:** Calculate per-category pass@1 (% of prompts with composite >= 7.0)

#### Pass@k Metrics

| Metric | Definition | Purpose |
|---|---|---|
| pass@1 | Single generation meets threshold | Primary gate metric |
| pass@3 | At least 1 of 3 generations meets threshold | Variance measurement; if pass@3 >> pass@1, the model is inconsistent |

#### Gate Criteria

```
IF min(pass@1 across all categories) >= 0.99:
    DEPLOY new checkpoint

ELIF min(pass@1 across all categories) >= 0.97:
    DEPLOY with WARNING
    Increase monitoring frequency to hourly
    Alert on-call engineer

ELSE:
    ROLLBACK to previous checkpoint
    ALERT engineering team
    Block next day's training until investigated
```

### 4.4 Suite Maintenance

The Golden Dataset must itself be maintained to remain relevant:

- **Quarterly review** by the human review team
- **Additions:** New "timeless" patterns are added as they stabilize (a pattern must persist for 6+ months before qualifying)
- **Removals:** Patterns that become truly obsolete are removed (rare — most UI fundamentals persist indefinitely)
- **Versioning:** `invariant-suite-v1.0`, `invariant-suite-v1.1`, etc.
- **Change limit:** Never modify more than 5% of the suite in a single update (25 prompts max)
- **Backward compatibility:** When updating the suite, re-evaluate the current production model against the new suite before enforcing it

---

## 5. Training Data Construction

Training data is constructed from three signal types, each providing different learning value.

### 5.1 Positive Signals (Approved Prompts)

Approved prompts are the primary training signal. They represent what the model should produce.

```
For each approved prompt p:
    training_sample = {
        input:    generation_request (category, variation, instructions),
        output:   prompt_content + previewCode,
        weight:   W(t_p) * composite_score_p / 10.0,
        category: p.category.slug,
    }
```

The weight combines temporal decay with quality: a recently approved, high-scoring prompt gets the highest weight. An old, barely-passing prompt gets very low weight.

### 5.2 Negative Signals (Rejected Prompts)

Rejected prompts teach the model what NOT to produce. They carry lower weight because the learning signal is noisier — a rejection might stem from subtle issues that are hard to learn from.

```
For each rejected prompt p:
    negative_sample = {
        input:            generation_request,
        output:           prompt_content (what NOT to produce),
        weight:           W(t_p) * 0.3,
        category:         p.category.slug,
        rejection_reason: review_decision.notes,
    }
```

When both an approved and rejected prompt exist for similar inputs, use **DPO (Direct Preference Optimization)** to learn from the contrast directly. DPO is more sample-efficient than learning from positives and negatives independently.

### 5.3 Instruction-Following Signals (Needs-Changes Prompts)

These are the highest-value training samples because they contain explicit human feedback on what to improve.

```
For each needs-changes prompt p:
    instruction_sample = {
        input:       generation_request,
        bad_output:  original_prompt_content,
        feedback:    review_decision.notes,
        good_output: revised_prompt_content (if re-submitted and later approved),
        weight:      W(t_p) * 0.5,
    }
```

When a revised version was later approved, this creates a before/after pair with human-written instructions for the transformation — ideal for instruction tuning.

### 5.4 Dataset Balancing

Unbalanced datasets cause the model to over-optimize for popular categories at the expense of rare ones.

**Balancing rules:**

- **Maximum representation:** No category should exceed 20% of the total dataset
- **Minimum viable count:** At least 50 samples per category before including that category in fine-tuning
- **Underrepresentation handling:** Oversample underrepresented categories with augmentation (paraphrase the instructions using a separate LLM call)
- **Priority ordering:** Instruction-following samples > positive samples > negative samples (when deciding what to include under budget constraints)

---

## 6. Learning from Manual Review — Bootstrapping

The system starts with full human oversight and gradually automates as confidence in VLM scoring grows. Each phase has explicit entry criteria and safety checks.

### 6.1 Phase 0: Pure Human Review (0-100 scored prompts)

**Entry criteria:** System launch.

- All prompts go through human review
- Reviewers score on 4 vectors (1-5 scale, mapped to 2-10 for VLM compatibility)
- No automated decisions of any kind
- **Goal:** Build baseline score distributions per category

**Exit criteria:** 100+ prompts scored by humans across at least 8 categories.

### 6.2 Phase 1: VLM + Human (100-500 scored prompts)

**Entry criteria:** Phase 0 complete.

- VLM scoring enabled alongside human review (dual scoring)
- Compare VLM vs. human scores for every prompt
- Track inter-rater agreement using Cohen's kappa
- Refine VLM scoring prompt based on systematic disagreements
- **Goal:** Calibrate VLM to match human judgment

**Exit criteria:** Cohen's kappa >= 0.7 for composite score, VLM-Human MAE < 1.5 on all vectors.

### 6.3 Phase 2: VLM Auto-Reject (500-1,000 scored prompts)

**Entry criteria:** Phase 1 calibration targets met.

- VLM auto-rejects prompts below P50 composite (clearly bad output)
- Human reviews everything at P50 and above
- Begin LoRA fine-tuning with temporally weighted data
- Run Golden Dataset evaluation daily
- **Goal:** Reduce human review volume by ~50%

**Exit criteria:** 1,000+ scored prompts, VLM auto-reject false-positive rate < 5%.

### 6.4 Phase 3: VLM Auto-Approve (1,000+ scored prompts)

**Entry criteria:** Phase 2 complete with low false-positive rate.

- VLM auto-approves prompts at P90+ composite (clearly excellent output)
- Human reviews the P75-P90 range (the "interesting" middle)
- VLM auto-rejects below P50
- P50-P75 reviewed if human capacity allows, otherwise queued
- **Goal:** Focus human attention on the most informative edge cases

**Exit criteria:** 5,000+ scored prompts, VLM decisions match human decisions >= 95% of the time.

### 6.5 Phase 4: Spot-Check (5,000+ scored prompts)

**Entry criteria:** Phase 3 agreement targets met.

- VLM handles all routing decisions autonomously
- Human spot-checks a 10% random sample for quality assurance
- Human effort focused on edge cases, rubric refinement, and Golden Dataset maintenance
- Track drift metrics between human and VLM scores on the spot-check sample
- **Goal:** Fully automated pipeline with human oversight

**Ongoing monitoring:** If VLM-Human agreement on spot-checks drops below 90%, revert to Phase 3 until re-calibrated.

---

## 7. Monitoring & Alerting

### 7.1 Daily Metrics Dashboard

The following metrics are tracked and visualized daily:

| Metric | Visualization | Purpose |
|---|---|---|
| Golden Dataset pass@1 per category | Line chart (trend over time) | Core regression detection |
| Mean composite score per category | 7-day rolling average line chart | Quality trend tracking |
| VLM vs. Human score correlation | Scatter plot with regression line | Calibration monitoring |
| Training data volume per category | Stacked bar chart | Dataset balance tracking |
| Rejection rate trend | Line chart | Should decrease over time as model improves |
| Lambda effective values | Table with sparklines | Trend sensitivity tracking |

### 7.2 Alerts

| Condition | Severity | Action |
|---|---|---|
| pass@1 < 99% any category | Warning | Investigate; consider rollback |
| pass@1 < 97% any category | Critical | Auto-rollback; alert engineering team |
| VLM-Human MAE > 2.0 on any vector | Warning | Rubric review needed; possible VLM drift |
| Generation failure rate > 10% | Warning | Check AI provider health and rate limits |
| Review backlog > 100 prompts | Info | Consider raising auto-approve threshold |
| Training data < 50 samples for any category | Info | Flag category for manual data collection |
| Checkpoint size anomaly (> 2x normal) | Warning | Investigate potential training corruption |

### 7.3 Quarterly Review

A structured quarterly review ensures the system stays aligned with evolving requirements:

1. **Trend analysis:** Analyze category-level quality trends over the past quarter
2. **Lambda tuning:** Update lambda values based on observed trend velocity (if a "stable" category started shifting, increase its lambda)
3. **MoE assessment:** Evaluate category divergence ratio (F-statistic) to determine if MoE transition is warranted
4. **Golden Dataset refresh:** Add/remove prompts as needed (within the 5% change limit)
5. **VLM calibration:** Review VLM scoring prompt against latest human judgments
6. **Infrastructure review:** Assess compute costs, training times, and scaling needs

---

## 8. Infrastructure Requirements

### 8.1 Compute

| Resource | Spec | Usage | Estimated Cost |
|---|---|---|---|
| LoRA fine-tuning | 1x A100 (40GB) or equivalent | ~30 min/day | ~$1.50/day (spot) |
| Screenshot rendering | CPU-only (Playwright) | Parallelizable across workers | Existing infrastructure |
| VLM scoring | Claude Sonnet API | ~500 evaluations/day for Golden Dataset | ~$15/day |
| Training data construction | CPU + memory | ~5 min/day | Negligible |

### 8.2 Storage

| Asset | Size | Retention |
|---|---|---|
| Daily LoRA checkpoints | ~500MB each | 7 days rolling (3.5GB) |
| Weekly base checkpoints | ~500MB each | 4 weeks rolling (2GB) |
| Monthly archives | ~500MB each | Indefinite |
| Screenshots | ~6MB per prompt (3 viewports) | 30 days rolling |
| Training datasets | ~100MB per daily dataset | 30 days rolling |
| **Total active storage** | **~10GB** | |

### 8.3 Orchestration

| Component | Implementation | Notes |
|---|---|---|
| Daily training pipeline | Cron job (00:00 UTC) | Sequential: collect, build, train, evaluate, gate |
| Screenshot rendering | Queue-based (existing agent queue) | Fan-out for parallelism |
| Golden Dataset evaluation | Triggered after training completes | Webhook callback on completion |
| Monitoring dashboard | Extension of existing admin panel | New tab/page for LoRA metrics |
| Rollback mechanism | CLI command + automated trigger | Must complete in < 5 minutes |

### 8.4 Dependencies

- **Base model:** Frozen foundation model (provider-hosted or self-hosted)
- **LoRA framework:** PEFT (HuggingFace) or equivalent
- **VLM scoring:** Claude Sonnet via API (as defined in Vision Teacher Pipeline)
- **Screenshot rendering:** Playwright (as defined in Agent Pipeline)
- **Review system:** Approval workflow (as defined in Approval Workflow doc)

---

## Appendix A: Glossary

| Term | Definition |
|---|---|
| **LoRA** | Low-Rank Adaptation — a parameter-efficient fine-tuning method that adds small trainable matrices to frozen model layers |
| **Catastrophic forgetting** | The tendency of neural networks to lose previously learned capabilities when trained on new data |
| **DPO** | Direct Preference Optimization — a training method that learns from pairs of preferred/dispreferred outputs |
| **Golden Dataset** | A fixed set of evaluation prompts representing timeless UI patterns |
| **pass@k** | The probability that at least 1 of k generated samples passes the quality threshold |
| **Temporal weight** | A multiplier applied to training samples based on their age, favoring recent data |
| **MoE** | Mixture of Experts — an architecture where different specialized sub-models handle different input types |
| **VLM** | Vision-Language Model — a model that can analyze images and produce text descriptions/scores |

## Appendix B: Related Documents

- [Agent Pipeline](./agent-pipeline.md) — Screenshot rendering and prompt generation pipeline
- [Vision Teacher Pipeline](./vision-teacher-pipeline.md) — VLM scoring system
- [Approval Workflow](./approval-workflow.md) — Human review process
- [Data Model](./data-model.md) — Database schema for prompts, reviews, and scores
- [Technical Architecture](./technical-architecture.md) — Overall system architecture
