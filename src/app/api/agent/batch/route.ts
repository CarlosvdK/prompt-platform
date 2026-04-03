import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireRole } from '@/lib/auth'
import { batchGenerate, listAgentConfigs } from '@/services/agent.service'
import { handleApiError } from '@/app/api/_helpers/error-handler'

const batchSchema = z.object({
  agentIds: z.array(z.string()).optional().default([]),
  topic: z.string().max(500).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(['ADMIN'])
    const body = await request.json()
    const data = batchSchema.parse(body)
    const runs = await batchGenerate(data.agentIds, user.id, data.topic)
    return NextResponse.json({ success: true, runs: runs.map((r) => ({ id: r.id, skill: r.skill })) }, { status: 201 })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function GET() {
  try {
    await requireRole(['ADMIN'])
    const configs = listAgentConfigs()
    return NextResponse.json(configs)
  } catch (error) {
    return handleApiError(error)
  }
}
