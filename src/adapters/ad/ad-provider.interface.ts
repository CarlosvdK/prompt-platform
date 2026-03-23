export interface AdSession {
  sessionId: string
  adUnitId: string
  provider: string
  clientConfig: Record<string, unknown>
}

export interface AdVerificationResult {
  verified: boolean
  impressionId: string
  revenue?: number
}

export interface AdProvider {
  readonly name: string
  initSession(promptId: string): Promise<AdSession>
  verifyCompletion(sessionId: string, callbackData?: unknown): Promise<AdVerificationResult>
}
