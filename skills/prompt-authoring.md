# Prompt Authoring Guide

This guide defines how to create high-quality prompt content for the Prompt Platform catalog. It applies to both human authors and AI agents generating prompt drafts.

## Prompt Structure

Every prompt in the catalog consists of three parts:

### 1. System Instruction

The foundational context that sets the AI's role, constraints, and behavior. Not all prompt types require a system instruction (e.g., simple text prompts may omit it), but when present it should:

- Define the AI's role clearly ("You are a senior code reviewer...")
- Set behavioral boundaries ("Only suggest improvements, do not rewrite the code")
- Specify output format if relevant ("Respond in markdown with headers for each section")
- Establish tone and style ("Use a professional but approachable tone")

### 2. User Instruction

The template or formula that the end user fills in or uses directly. This is the core of the prompt and should:

- Use clear placeholder syntax: `[YOUR TOPIC]`, `[PASTE CODE HERE]`, `[DESCRIBE YOUR SITUATION]`
- Be self-contained -- the user should not need external context to use it
- Include step-by-step instructions if the prompt involves a multi-part task
- Specify what the user needs to provide vs what the AI generates

### 3. Examples (When Applicable)

One or two concrete examples of the prompt in use, showing:
- A filled-in version of the user instruction
- The expected AI output (abbreviated if long)
- This helps users understand exactly what they will get

## Metadata Requirements

Every prompt must include:

| Field | Required | Description |
|---|---|---|
| `title` | Yes | Clear, descriptive title (5-15 words). Describes what the prompt does. |
| `description` | Yes | 1-3 sentence summary of the prompt's purpose and output. |
| `category` | Yes | One primary category from the defined taxonomy. |
| `tags` | Yes | 3-8 tags for discoverability. Mix of broad and specific. |
| `type` | Yes | One of: `TEXT`, `CODE`, `SYSTEM_PROMPT`, `CHAIN`, `IMAGE`. |
| `metadata.models` | Yes | Compatible models (e.g., `["gpt-4", "claude-3", "gemini-pro"]`). |
| `metadata.difficulty` | No | `beginner`, `intermediate`, `advanced`. |
| `metadata.estimatedTokens` | No | Approximate token usage for one completion. |

## What Makes a Good Prompt

### Clarity
- The purpose is obvious within the first sentence.
- Instructions are unambiguous -- there is only one way to interpret them.
- Placeholders are clearly marked and explained.

### Specificity
- The prompt targets a specific task, not a vague capability.
- Good: "Generate a weekly meal plan for [DIETARY RESTRICTION] with shopping list"
- Bad: "Help me with cooking"

### Completeness
- The prompt produces a useful, complete output on its own.
- It does not require follow-up prompts to be useful.
- If the task is inherently multi-step, the prompt handles all steps.

### Reusability
- The prompt works across different inputs without modification to the template.
- Placeholders cover the variable parts; the structure handles the rest.

### Output Quality
- The prompt produces well-formatted, structured output.
- It specifies format expectations (markdown, JSON, bullet points, etc.).

## Common Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Vague instructions | "Write something good about X" | Specify what "good" means: structure, length, tone, audience |
| Missing context | Assumes the AI knows the user's situation | Add context fields as placeholders |
| Over-constraining | So many rules the AI cannot produce useful output | Prioritize the 3-5 most important constraints |
| No format specification | Output is unpredictable | Specify format: "Respond as a numbered list with..." |
| Prompt injection vulnerability | Contains instructions that could be overridden | Avoid patterns like "ignore previous instructions" |
| Too broad | Tries to do everything in one prompt | Split into focused prompts or use CHAIN type |
| Duplicate content | Covers the same ground as an existing catalog prompt | Search existing prompts before creating |

## Preview Content Requirements

Every prompt must have at least one preview that demonstrates its output. Previews are what users see before unlocking.

### Preview Guidelines

- **Accuracy:** The preview must represent what the prompt actually produces. Do not fabricate impressive-looking output that the prompt cannot reliably generate.
- **Length:** Previews should be substantial enough to demonstrate value but not so long they eliminate the need to unlock. Aim for 30-50% of a typical full output.
- **Formatting:** Preserve the formatting of the actual output (markdown headers, code blocks, lists).
- **Variety:** For prompts with variable inputs, show a preview with a specific, relatable example input.
- **Truncation:** If showing a partial output, end at a natural break point and indicate continuation with "..." or a visual indicator.

### Preview Types

- `text` -- Rendered markdown preview of the prompt's output.
- `code` -- Syntax-highlighted code output.
- `image` -- Screenshot or generated image preview.
- `comparison` -- Before/after showing the prompt's improvement.

## Category Taxonomy

Use the established categories. If a prompt does not fit any existing category, flag it for taxonomy review rather than forcing a fit.

Common categories: Writing, Code, Marketing, Education, Business, Creative, Research, Data Analysis, Design, Productivity.

## Quality Checklist Before Submission

- [ ] Title is descriptive and under 15 words
- [ ] Description explains what the prompt does and what output to expect
- [ ] System instruction (if present) is clear and well-bounded
- [ ] User instruction uses clear placeholder syntax
- [ ] At least one example is provided
- [ ] At least one preview is attached
- [ ] Category is appropriate
- [ ] 3-8 relevant tags are assigned
- [ ] Type is correctly set
- [ ] Model compatibility is specified
- [ ] Prompt has been tested with at least two different inputs
- [ ] Output is consistent across multiple runs
