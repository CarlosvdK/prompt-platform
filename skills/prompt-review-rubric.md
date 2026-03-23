# Prompt Review Rubric

This rubric is used by human reviewers (and referenced by review-assist agents) to evaluate prompts before they are approved for publication.

## Scoring System

Each criterion is scored 1 to 5:

| Score | Meaning |
|---|---|
| 1 | Unacceptable -- fundamental problems |
| 2 | Poor -- significant issues that must be addressed |
| 3 | Acceptable -- meets minimum bar, minor improvements possible |
| 4 | Good -- solid quality, small polish opportunities |
| 5 | Excellent -- publication-ready, exemplary quality |

### Approval Rules

- **Minimum average score to approve:** 3.0 across all criteria.
- **Auto-reject:** Any single criterion scored below 2.
- **Conditional approval:** Average >= 3.0 but one or more criteria at exactly 2 triggers NEEDS_CHANGES status with specific feedback.

## Criteria

### 1. Quality (Grammar, Structure, Completeness)

| Score | Description |
|---|---|
| 1 | Riddled with grammar errors, incoherent structure, clearly incomplete |
| 2 | Multiple grammar issues, disorganized, missing significant sections |
| 3 | Minor grammar issues, logical structure, all required sections present |
| 4 | Clean grammar, well-organized, comprehensive |
| 5 | Polished prose, elegant structure, thorough and complete |

**What to check:**
- Spelling and grammar in title, description, and prompt content.
- Logical flow of instructions (does one step naturally lead to the next?).
- All required fields are filled (title, description, content, category, tags, type).

### 2. Clarity (Unambiguous Instructions, Clear Purpose)

| Score | Description |
|---|---|
| 1 | Purpose is unclear, instructions are contradictory or confusing |
| 2 | Purpose is vaguely stated, several ambiguous instructions |
| 3 | Purpose is clear, instructions are mostly unambiguous |
| 4 | Purpose is immediately obvious, instructions are precise |
| 5 | Crystal clear purpose, zero ambiguity, a reader could not misinterpret |

**What to check:**
- Can you understand the prompt's purpose within the first sentence?
- Are placeholders clearly marked and explained?
- Would two different users interpret the instructions the same way?

### 3. Usefulness (Solves Real Problem, Practical Value)

| Score | Description |
|---|---|
| 1 | No practical application, trivially achievable without a prompt |
| 2 | Marginal utility, most users would not find this helpful |
| 3 | Useful for a defined audience, saves meaningful time or effort |
| 4 | Broadly useful, clearly saves significant time or produces better results |
| 5 | Exceptionally valuable, addresses a common pain point with an elegant solution |

**What to check:**
- Does this prompt do something that would take meaningful effort without it?
- Is the target audience large enough to justify catalog space?
- Would you (or someone you know) actually use this?

### 4. Safety (No Harmful Content, No Jailbreaks, No PII Exposure)

| Score | Description |
|---|---|
| 1 | Contains harmful instructions, facilitates jailbreaks, or exposes PII patterns |
| 2 | Borderline content, could be used for harmful purposes with minor modification |
| 3 | No safety concerns, standard content |
| 4 | Includes explicit safety guardrails in the prompt itself |
| 5 | Proactively addresses potential misuse with built-in safeguards |

**What to check:**
- Does the prompt instruct the AI to bypass safety filters?
- Could the output contain or generate personally identifiable information?
- Could this prompt be used to generate harmful, illegal, or discriminatory content?
- Does it attempt to override AI system instructions?
- See `skills/safety-and-policy.md` for the full policy.

### 5. Output Consistency (Produces Reliable Results Across Runs)

| Score | Description |
|---|---|
| 1 | Output varies wildly between runs, unpredictable quality |
| 2 | Significant variation in structure or quality between runs |
| 3 | Generally consistent output with minor variation |
| 4 | Highly consistent output, predictable structure and quality |
| 5 | Near-identical structure and quality across runs, robust against input variation |

**What to check:**
- Run the prompt 3 times with the same input. Are the outputs structurally similar?
- Run the prompt with 2 different inputs. Does it handle both well?
- Does the prompt use techniques that promote consistency (explicit format instructions, examples, step-by-step structure)?

### 6. Duplication Check (Not Too Similar to Existing Prompts)

| Score | Description |
|---|---|
| 1 | Near-duplicate of an existing published prompt |
| 2 | Very similar to existing prompt with only superficial differences |
| 3 | Covers similar territory but has a distinct approach or angle |
| 4 | Clearly differentiated from existing prompts in the same category |
| 5 | Fills a genuine gap in the catalog, no similar prompts exist |

**What to check:**
- Search the existing catalog by category and tags.
- Compare title and description to existing prompts.
- If similar prompts exist, does this one offer a meaningfully different approach?

### 7. Preview Quality (Previews Accurately Represent Output)

| Score | Description |
|---|---|
| 1 | No preview provided, or preview is fabricated/unrepresentative |
| 2 | Preview exists but is misleading or very low quality |
| 3 | Preview accurately represents the prompt's output |
| 4 | Preview is well-formatted and clearly demonstrates value |
| 5 | Preview is compelling, accurate, and makes the value proposition obvious |

**What to check:**
- Does the preview match what the prompt actually produces?
- Is the preview length appropriate (30-50% of typical full output)?
- Is the preview formatted correctly?
- Would this preview convince a user to unlock?

### 8. Category and Tag Completeness

| Score | Description |
|---|---|
| 1 | Wrong category, no tags |
| 2 | Questionable category choice, insufficient tags (fewer than 3) |
| 3 | Correct category, adequate tags (3-5) |
| 4 | Correct category, good tag coverage (5-7), tags aid discoverability |
| 5 | Perfect category fit, comprehensive tags (6-8), includes both broad and niche terms |

**What to check:**
- Is the category the best fit from the available taxonomy?
- Are tags relevant and varied (not all synonyms)?
- Would a user searching for this type of prompt find it via these tags?

### 9. Metadata Accuracy (Correct Type, Model Compatibility)

| Score | Description |
|---|---|
| 1 | Wrong type, no model compatibility specified |
| 2 | Type is questionable, model compatibility is incomplete or wrong |
| 3 | Type is correct, at least one compatible model specified |
| 4 | Type is correct, multiple compatible models accurately specified |
| 5 | Type is correct, comprehensive model compatibility with version notes |

**What to check:**
- Is the prompt type (TEXT, CODE, SYSTEM_PROMPT, CHAIN, IMAGE) accurate?
- Has the prompt actually been tested with the listed models?
- Are there models that would work but are not listed?

## Review Decision Template

When submitting a review, use this structure:

```
Action: APPROVED | REJECTED | NEEDS_CHANGES | ESCALATED

Scores:
- Quality: X/5
- Clarity: X/5
- Usefulness: X/5
- Safety: X/5
- Output Consistency: X/5
- Duplication: X/5
- Preview Quality: X/5
- Category/Tags: X/5
- Metadata: X/5
Average: X.X/5

Notes:
[Specific, actionable feedback. For NEEDS_CHANGES, list exactly what must be fixed.]
```

## Escalation Criteria

Escalate to a senior reviewer or admin when:
- Safety score is 1 or 2 and you are unsure about the policy interpretation.
- The prompt is in a sensitive category (health, legal, financial advice).
- You suspect the prompt was plagiarized.
- The prompt quality is borderline and you want a second opinion.
