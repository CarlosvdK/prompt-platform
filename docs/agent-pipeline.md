# Agent Pipeline

## Overview

The agent pipeline enables AI-powered prompt generation at scale. Admins trigger agent runs with specific skills and parameters. The agent executes the skill using an AI provider, generates one or more prompt drafts, and those drafts enter the review pipeline. Agents can never publish directly.

## Generation Flow

```
1. Admin triggers run
   POST /api/agent-runs { skill: "prompt-generation", input: { ... } }
         |
2. Create AgentRun record (status: QUEUED)
         |
3. Background execution begins
   AgentRun status -> RUNNING
   AgentRun.startedAt -> now()
         |
4. Resolve AI provider via adapter factory
   aiProvider = getAiProvider()  // based on AI_PROVIDER env var
         |
5. Execute skill
   skill.execute(input, aiProvider)
         |
6. Skill produces structured output
   { drafts: [{ title, description, content, type, metadata, previews }] }
         |
7. Create PromptDraft records for each draft
   Each draft linked to the AgentRun
         |
8. Create or update Prompt records from drafts
   Set status to DRAFT
         |
9. Update AgentRun
   status -> COMPLETED
   output -> skill output
   completedAt -> now()
         |
10. Drafts are now available for review submission
```

### Error Handling

If any step fails:
- AgentRun status -> FAILED
- AgentRun.error -> error message
- AgentRun.completedAt -> now()
- Any partially created drafts are retained (not deleted) for debugging.
- AuditLog entry: `AGENT_RUN_FAILED`

## AI Provider Adapter

### Interface

```typescript
export interface AiGenerationRequest {
  systemPrompt: string
  userPrompt: string
  maxTokens?: number
  temperature?: number
  responseFormat?: 'text' | 'json'
}

export interface AiGenerationResponse {
  content: string
  tokensUsed: number
  model: string
  finishReason: string
}

export interface AiProvider {
  name: string
  generate(request: AiGenerationRequest): Promise<AiGenerationResponse>
}
```

### Mock Provider

For development and testing, the mock provider returns predefined responses:

```typescript
export const mockAiProvider: AiProvider = {
  name: 'mock',
  async generate(request: AiGenerationRequest): Promise<AiGenerationResponse> {
    return {
      content: JSON.stringify({
        title: 'Mock Generated Prompt',
        description: 'A mock prompt for development.',
        content: 'This is the mock prompt content.',
        type: 'TEXT',
        metadata: { models: ['gpt-4'] },
      }),
      tokensUsed: 100,
      model: 'mock-model',
      finishReason: 'stop',
    }
  },
}
```

### Adding a Real Provider

1. Create `src/lib/adapters/[provider]-ai-provider.ts`.
2. Implement the `AiProvider` interface.
3. Add to the factory function:
   ```typescript
   export function getAiProvider(): AiProvider {
     switch (process.env.AI_PROVIDER) {
       case 'mock': return mockAiProvider
       case 'openai': return openaiProvider
       case 'anthropic': return anthropicProvider
       default: throw new AppError(...)
     }
   }
   ```
4. Add API key environment variables to `.env.example`.
5. Update `memory/decisions-log.md`.

## Skills

Skills are the instructions that guide what an agent generates. Each skill defines:

- **System prompt:** Sets the AI's role and constraints for generation.
- **User prompt template:** The parameterized instruction filled with input values.
- **Output parsing:** How to extract structured data from the AI's response.
- **Validation:** Zod schemas that validate the parsed output.

### Skill Registry

Skills are registered in a central map:

```typescript
// src/lib/services/agent-skills.ts

export const skillRegistry: Record<string, AgentSkill> = {
  'prompt-generation': promptGenerationSkill,
  'preview-generation': previewGenerationSkill,
  'prompt-improvement': promptImprovementSkill,
}

export interface AgentSkill {
  name: string
  description: string
  inputSchema: ZodSchema
  execute(input: unknown, aiProvider: AiProvider): Promise<SkillOutput>
}
```

### Prompt Generation Skill

Generates new prompt drafts based on a topic, category, and target audience.

**Input:**
```typescript
{
  topic: string         // "Email marketing subject lines"
  category: string      // Category slug
  type: PromptType      // TEXT, CODE, etc.
  count: number         // How many drafts to generate (1-5)
  targetAudience: string // "Marketers"
}
```

**Output:** Array of PromptDraft-shaped objects.

### Preview Generation Skill

Generates preview content for an existing prompt by running the prompt against the AI with sample inputs.

**Input:**
```typescript
{
  promptId: string      // Existing prompt to generate previews for
  sampleInputs: string[] // 1-3 example inputs to use
}
```

**Output:** Array of preview content strings.

## Logging and Traceability

Every agent run is fully traceable:

1. **AgentRun record** -- who triggered it, what skill, what input, what output, timing, status.
2. **PromptDraft records** -- each draft links back to the AgentRun that produced it.
3. **AuditLog entries** -- `AGENT_RUN_TRIGGERED`, `AGENT_RUN_COMPLETED`, `AGENT_RUN_FAILED`.

This chain enables:
- Debugging: when a draft has issues, trace back to the skill and input.
- Quality monitoring: track approval rates per skill to identify underperforming skills.
- Cost tracking: sum tokensUsed across runs to monitor AI API costs.

## Retry Strategy

### Automatic Retries

Failed runs are not automatically retried. The admin reviews the error and decides whether to retry.

**Rationale:** Automatic retries could waste AI API credits on systematic failures (bad input, rate limits, etc.). Manual retry gives the admin a chance to fix the input or address the root cause.

### Manual Retry

Admins can trigger a new run with the same or modified parameters. The original failed run is preserved for reference.

### Idempotency

Skills should be designed to be safely re-run. Running the same skill with the same input should produce new drafts (not duplicates of previously created drafts). Each run creates distinct PromptDraft records.

## Concurrency

- Only one agent run executes at a time per skill (to avoid overwhelming the AI provider).
- QUEUED runs are processed in order (FIFO).
- If multiple runs are queued, they execute sequentially.
- Future optimization: parallel execution with per-provider rate limiting.

## How to Add a New Generation Skill

1. Define the skill's purpose and expected output format.
2. Create input and output Zod schemas.
3. Write the system prompt and user prompt template.
4. Implement the `AgentSkill` interface.
5. Add the skill to the `skillRegistry`.
6. Write tests for the skill's output parsing and validation.
7. Test the skill with the mock AI provider first.
8. Test with a real AI provider and review the output quality.
9. Document the skill in `skills/` directory if it has operational implications.
