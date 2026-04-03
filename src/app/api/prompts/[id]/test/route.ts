import { NextRequest, NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth'
import { getAIProvider } from '@/adapters/ai'
import { db } from '@/lib/db'
import { handleApiError } from '@/app/api/_helpers/error-handler'

const TEST_SYSTEM_PROMPT = `You are a React developer. The user will give you a prompt describing a UI component. Your job is to produce the EXACT component described.

RULES:
- Output ONLY the React component code — no explanation, no markdown fences
- Single-file functional component with \`export default function ComponentName()\`
- Use React hooks (useState, useEffect, etc.) as needed
- Use Tailwind CSS utility classes ONLY
- Self-contained with inline mock data
- Must render on a dark background (#09090b)
- Import nothing except from 'react'`

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireRole(['ADMIN', 'REVIEWER'])
    const { id } = await params

    const prompt = await db.prompt.findUnique({
      where: { id },
      select: { content: true, title: true },
    })

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    const aiProvider = getAIProvider()
    const result = await aiProvider.generateCompletion({
      prompt: prompt.content,
      systemPrompt: TEST_SYSTEM_PROMPT,
      maxTokens: 4096,
      temperature: 0.3,
    })

    // Strip markdown fences if present
    let code = result.content
      .replace(/^```(?:tsx?|jsx?|react)?\n?/gm, '')
      .replace(/```$/gm, '')
      .trim()

    return NextResponse.json({
      code,
      usage: result.usage,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
