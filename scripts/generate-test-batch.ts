import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
config({ path: '.env.local' })

const prisma = new PrismaClient()

async function main() {
  // Dynamically import after env is loaded
  const { AGENT_CONFIGS, getRandomTopic, getRandomPalette, buildSystemPrompt } = await import('../src/config/agents')
  const { AnthropicAdapter } = await import('../src/adapters/ai/anthropic.adapter')

  const ai = new AnthropicAdapter()

  // Get admin user
  const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' } })
  if (!admin) throw new Error('No admin user found')

  // Run all 6 agents + 4 extra random ones = 10 total
  const runs = [
    ...AGENT_CONFIGS,
    ...AGENT_CONFIGS.slice(0, 4), // repeat first 4 for extras
  ]

  console.log(`Starting ${runs.length} agent runs...\n`)

  for (let i = 0; i < runs.length; i++) {
    const agentConfig = runs[i]
    const palette = getRandomPalette()
    const topic = getRandomTopic(agentConfig)

    console.log(`[${i + 1}/${runs.length}] ${agentConfig.name} — "${topic}" (${palette.name} palette)`)

    try {
      // Create agent run record
      const run = await prisma.agentRun.create({
        data: {
          skill: agentConfig.id,
          input: { topic, category: agentConfig.categorySlug } as any,
          status: 'RUNNING',
          initiatedBy: admin.id,
          startedAt: new Date(),
        },
      })

      // Build prompt
      const systemPrompt = buildSystemPrompt(agentConfig, palette)
      const userPrompt = `Create a UI component prompt for: "${topic}"\nCategory: ${agentConfig.categorySlug}\nMake it visually impressive, production-ready, and unique.`

      // Call Claude
      const result = await ai.generateCompletion({
        prompt: userPrompt,
        systemPrompt,
        maxTokens: 4096,
        temperature: 0.7,
      })

      // Parse response
      let parsed: any
      try {
        const jsonStr = result.content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        parsed = JSON.parse(jsonStr)
      } catch {
        console.log(`  ⚠ Failed to parse JSON, using raw content`)
        parsed = {
          title: `Generated: ${topic}`,
          description: `AI-generated component for ${topic}`,
          content: result.content,
        }
      }

      // Build metadata
      const metadata: Record<string, unknown> = { colorPalette: palette.id }
      if (parsed.previewCode) metadata.previewCode = parsed.previewCode
      if (parsed.tags) metadata.tags = parsed.tags
      if (parsed.categorySlug) metadata.categorySlug = parsed.categorySlug

      // Create draft
      const draft = await prisma.promptDraft.create({
        data: {
          agentRunId: run.id,
          title: parsed.title ?? `Generated: ${topic}`,
          description: parsed.description ?? '',
          content: parsed.content ?? result.content,
          type: 'CODE',
          metadata: metadata as any,
        },
      })

      // Update run to completed
      await prisma.agentRun.update({
        where: { id: run.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          output: { draftId: draft.id, usage: result.usage } as any,
        },
      })

      console.log(`  ✓ Draft created: "${parsed.title}" (${result.usage.promptTokens + result.usage.completionTokens} tokens)`)
    } catch (err: any) {
      console.log(`  ✗ Failed: ${err.message}`)
    }
  }

  // Summary
  const draftCount = await prisma.promptDraft.count()
  const runCount = await prisma.agentRun.count({ where: { status: 'COMPLETED' } })
  console.log(`\nDone! ${runCount} completed runs, ${draftCount} total drafts.`)
  console.log(`Go to http://localhost:3001/admin/agents to see results.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
