import crypto from 'crypto'
import { db } from '@/lib/db'
import { NotFoundError, ValidationError } from '@/lib/errors'
import { UNLOCK_TOKEN_EXPIRY_MS } from '@/lib/constants'
import { getAdProvider } from '@/adapters/ad'
import { logAction } from './audit.service'
import { UnlockSession } from '@/types'

// In-memory session store for MVP.
// TODO: Replace with Redis for production use.
interface SessionData {
  promptId: string
  userId?: string
  adSessionId: string
  provider: string
  createdAt: number
}

const sessionStore = new Map<string, SessionData>()

// Clean up expired sessions periodically
function cleanupExpiredSessions() {
  const now = Date.now()
  for (const [key, session] of sessionStore) {
    if (now - session.createdAt > UNLOCK_TOKEN_EXPIRY_MS) {
      sessionStore.delete(key)
    }
  }
}

export async function initiateUnlock(
  promptId: string,
  userId?: string,
): Promise<UnlockSession> {
  // Validate prompt exists and is published
  const prompt = await db.prompt.findUnique({
    where: { id: promptId },
    select: { id: true, status: true },
  })
  if (!prompt) throw new NotFoundError('Prompt')
  if (prompt.status !== 'PUBLISHED') {
    throw new ValidationError('Prompt is not published')
  }

  // Clean up old sessions
  cleanupExpiredSessions()

  // Initialize ad session
  const adProvider = getAdProvider()
  const adSession = await adProvider.initSession(promptId)

  // Store session data
  const sessionId = crypto.randomUUID()
  sessionStore.set(sessionId, {
    promptId,
    userId,
    adSessionId: adSession.sessionId,
    provider: adSession.provider,
    createdAt: Date.now(),
  })

  return {
    sessionId,
    promptId,
    adConfig: {
      adUnitId: adSession.adUnitId,
      provider: adSession.provider,
      ...adSession.clientConfig,
    },
  }
}

export async function verifyUnlock(
  sessionId: string,
  promptId: string,
  userId?: string,
  ipHash?: string,
): Promise<string> {
  const session = sessionStore.get(sessionId)
  if (!session) {
    throw new ValidationError('Invalid or expired unlock session')
  }

  if (session.promptId !== promptId) {
    throw new ValidationError('Session does not match prompt')
  }

  // Verify ad completion
  const adProvider = getAdProvider()
  const verification = await adProvider.verifyCompletion(session.adSessionId)

  if (!verification.verified) {
    throw new ValidationError('Ad verification failed')
  }

  // Create unlock event and ad event in a transaction
  const [unlockEvent, prompt] = await db.$transaction([
    db.unlockEvent.create({
      data: {
        promptId,
        userId: userId ?? session.userId,
        method: 'ad',
        ipHash,
        adEvent: {
          create: {
            provider: session.provider,
            adUnitId: `mock-unit-${promptId.slice(0, 8)}`,
            impressionId: verification.impressionId,
            completed: true,
            revenue: verification.revenue,
          },
        },
      },
    }),
    db.prompt.update({
      where: { id: promptId },
      data: { unlockCount: { increment: 1 } },
      select: { content: true },
    }),
  ])

  // Remove used session
  sessionStore.delete(sessionId)

  await logAction({
    userId: userId ?? session.userId,
    promptId,
    action: 'prompt.unlocked',
    details: {
      unlockEventId: unlockEvent.id,
      method: 'ad',
      impressionId: verification.impressionId,
    },
  })

  return prompt.content
}

export async function checkUnlockStatus(
  promptId: string,
  userId?: string,
  ipHash?: string,
): Promise<boolean> {
  if (!userId && !ipHash) return false

  const where: Record<string, unknown> = { promptId }
  if (userId) {
    where.userId = userId
  } else if (ipHash) {
    where.ipHash = ipHash
  }

  const unlock = await db.unlockEvent.findFirst({
    where,
    select: { id: true },
  })

  return unlock !== null
}
