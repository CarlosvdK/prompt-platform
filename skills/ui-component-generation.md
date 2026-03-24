# UI Component Generation Skill

## Overview

The UI Component Generation skill produces prompts for Softset that, when given to any large language model (GPT-4, Claude, Gemini, Llama), produce identical React + Tailwind CSS components. Each generated prompt is a self-contained specification that deterministically describes a single UI component.

## Generation Process

1. **Input**: A category slug and optional variation description (e.g., "Glassmorphism login with social buttons" in the "authentication" category).
2. **System Prompt**: The AI is instructed to act as a UI component prompt engineer with strict formatting and content rules.
3. **AI Completion**: The provider generates a JSON response containing the prompt text and a reference implementation.
4. **Draft Creation**: The response is parsed and stored as a `PromptDraft` with type `CODE`, linked to an `AgentRun`.
5. **Review**: Drafts appear in the admin panel for human review before publishing.

## Output Format

The AI must return valid JSON with exactly these fields:

```json
{
  "title": "Component Name",
  "description": "One sentence describing what this component is and does",
  "content": "The full detailed prompt (300-600 words) with exact specifications",
  "previewCode": "The complete React+Tailwind component code the prompt should produce"
}
```

| Field         | Type   | Description                                                              |
| ------------- | ------ | ------------------------------------------------------------------------ |
| `title`       | string | Human-readable component name (e.g., "Glassmorphism Login Card")         |
| `description` | string | Single sentence summarizing the component                                |
| `content`     | string | The prompt text a user pastes into any LLM to reproduce the component    |
| `previewCode` | string | Reference React+Tailwind implementation stored in draft metadata         |

The `previewCode` is stored in `PromptDraft.metadata.previewCode` and optionally rendered as a `PromptPreview` of type `code_render`.

## Prompt Writing Principles

### Cross-LLM Consistency

The prompts we generate must produce near-identical output regardless of which LLM executes them. To achieve this:

- **Be explicit, not implicit.** Never say "use a nice blue" — say `bg-blue-600 text-white`.
- **Specify every visual property.** Colors, spacing, border radius, font size, font weight, shadow — leave nothing to interpretation.
- **Include the full expected code.** The prompt should contain the complete reference component so the LLM can match it exactly.
- **Use deterministic language.** "Create a component that renders..." not "Design something that looks like..."
- **Avoid subjective terms.** Replace "elegant" with concrete specifications: `rounded-2xl shadow-xl bg-white/10 backdrop-blur-md`.

### Prompt Structure

A well-structured prompt follows this order:

1. **Opening directive** — Tell the LLM exactly what to produce (a single-file React component).
2. **Component description** — What the component is and does in 1-2 sentences.
3. **Layout specification** — Container dimensions, flex/grid layout, positioning.
4. **Visual specification** — Colors, gradients, borders, shadows, backdrop filters.
5. **Typography** — Font sizes, weights, colors, line heights for each text element.
6. **Interactive states** — Hover, focus, active, disabled states with exact classes.
7. **Content** — Exact placeholder text, icon names, and data to display.
8. **Reference code** — The complete expected output as a code block.

## Component Structure Requirements

Every generated component must follow these rules:

- **Single file** — One `.tsx` file with no external dependencies beyond React, Tailwind CSS, and optionally `lucide-react` for icons.
- **Default export** — `export default function ComponentName() { ... }`
- **Tailwind only** — All styling via utility classes. No inline styles, no CSS modules, no styled-components.
- **Self-contained** — No API calls, no context providers, no router dependencies. Static or locally-stated data only.
- **Accessible** — Include `aria-label` on interactive elements, proper semantic HTML (`<nav>`, `<main>`, `<button>`).
- **Responsive** — Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) where appropriate.

## Common Patterns and Techniques

### Glassmorphism
```
bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl
```

### Gradient Text
```
bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent
```

### Hover Lift Effect
```
transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg
```

### Dark Card on Dark Background
```
bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg
```

### Animated Gradient Border
Use a wrapper div with `bg-gradient-to-r` and `p-[1px]` with an inner div using the solid background color.

### Skeleton Loading
```
animate-pulse bg-zinc-700/50 rounded-md
```

## Quality Checklist

Before a draft is approved, verify:

- [ ] The `content` field is 300-600 words with exact Tailwind class specifications
- [ ] The `previewCode` compiles without errors as a standalone React component
- [ ] All colors are specified as Tailwind classes, not hex/rgb values
- [ ] The component uses `export default function`
- [ ] No external dependencies beyond React, Tailwind, and lucide-react
- [ ] Interactive elements have hover/focus states defined
- [ ] The prompt includes the complete reference code block
- [ ] The title is descriptive and unique within its category
- [ ] The description is a single clear sentence
- [ ] Spacing and dimensions use Tailwind classes (not arbitrary values where possible)
- [ ] The component renders correctly at common viewport widths (mobile, tablet, desktop)

## Running Generation

### Single generation via API

Trigger through the admin panel or POST to `/api/agent/generate` with:

```json
{
  "skill": "ui-component-generation",
  "input": {
    "topic": "Glassmorphism login with social buttons",
    "category": "authentication"
  }
}
```

### Batch generation via CLI

```bash
pnpm generate:prompts -- --category authentication --count 5
```

This creates 5 drafts for the "authentication" category using predefined component variations. Set `AI_PROVIDER=anthropic` and `ANTHROPIC_API_KEY` in your environment before running.
