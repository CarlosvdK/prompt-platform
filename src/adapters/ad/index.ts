import { AdProvider } from './ad-provider.interface'
import { MockAdAdapter } from './mock-ad.adapter'

export function getAdProvider(): AdProvider {
  const provider = process.env.AD_PROVIDER ?? 'mock'

  switch (provider) {
    case 'mock':
      return new MockAdAdapter()
    default:
      throw new Error(`Unknown ad provider: ${provider}`)
  }
}

export type { AdProvider, AdSession, AdVerificationResult } from './ad-provider.interface'
