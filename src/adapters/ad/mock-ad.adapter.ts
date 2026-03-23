import crypto from 'crypto'
import { AdProvider, AdSession, AdVerificationResult } from './ad-provider.interface'

const activeSessions = new Set<string>()

export class MockAdAdapter implements AdProvider {
  readonly name = 'mock'

  async initSession(promptId: string): Promise<AdSession> {
    const sessionId = crypto.randomUUID()
    activeSessions.add(sessionId)

    return {
      sessionId,
      adUnitId: `mock-unit-${promptId.slice(0, 8)}`,
      provider: this.name,
      clientConfig: {
        displayType: 'rewarded',
        durationMs: 5000,
        mockAd: true,
        message: 'This is a mock ad. In production, a real ad would be displayed.',
      },
    }
  }

  async verifyCompletion(
    sessionId: string,
    _callbackData?: unknown,
  ): Promise<AdVerificationResult> {
    const exists = activeSessions.has(sessionId)

    if (!exists) {
      return {
        verified: false,
        impressionId: '',
      }
    }

    activeSessions.delete(sessionId)

    return {
      verified: true,
      impressionId: `mock-imp-${crypto.randomUUID().slice(0, 8)}`,
      revenue: 0.01,
    }
  }
}
