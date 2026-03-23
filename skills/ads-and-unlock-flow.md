# Ads and Unlock Flow

## Overview

The unlock flow is the core monetization mechanism. Users browse and preview prompts for free, then watch/interact with an ad to unlock the full prompt content. The architecture uses an adapter pattern so ad providers can be swapped without changing business logic.

## Unlock Session Flow

```
1. User clicks "Unlock" on a prompt detail page
         |
2. Client sends POST /api/prompts/[id]/unlock/request
         |
3. Server creates an UnlockEvent (status: pending)
   Server selects ad provider via adapter
   Server returns ad configuration to client
         |
4. Client renders ad using provider SDK
   User watches/interacts with ad
         |
5. Ad provider calls completion callback
   OR client sends POST /api/prompts/[id]/unlock/verify
   with provider-specific completion token
         |
6. Server verifies ad completion with provider
   Server creates AdEvent record
   Server generates unlock token (signed JWT or HMAC)
   Server returns unlock token + full prompt content
         |
7. Client stores unlock token in localStorage
   Client displays full prompt content
         |
8. On subsequent visits, client sends unlock token
   Server verifies token and serves content without ad
```

## Adapter Pattern

### Ad Provider Interface

```typescript
// src/lib/adapters/ad-provider.ts

export interface AdConfig {
  provider: string
  adUnitId: string
  format: 'rewarded-video' | 'interstitial' | 'interactive'
  clientConfig: Record<string, unknown>  // Provider-specific SDK config
}

export interface AdCompletionResult {
  verified: boolean
  impressionId: string
  revenue: number | null
  metadata: Record<string, unknown>
}

export interface AdProvider {
  name: string
  getAdConfig(promptId: string): Promise<AdConfig>
  verifyCompletion(token: string): Promise<AdCompletionResult>
}
```

### Mock Adapter (Development)

For local development and testing, a mock adapter simulates the ad flow:

```typescript
// src/lib/adapters/mock-ad-provider.ts

export const mockAdProvider: AdProvider = {
  name: 'mock',

  async getAdConfig(promptId: string): Promise<AdConfig> {
    return {
      provider: 'mock',
      adUnitId: 'mock-unit',
      format: 'rewarded-video',
      clientConfig: {
        duration: 3000,  // 3-second simulated ad
        skipAfter: 1000,
      },
    }
  },

  async verifyCompletion(token: string): Promise<AdCompletionResult> {
    return {
      verified: token === 'mock-completion-token',
      impressionId: `mock-${Date.now()}`,
      revenue: 0.005,
      metadata: {},
    }
  },
}
```

### Provider Selection

The active ad provider is determined by environment variable:

```bash
AD_PROVIDER=mock       # Development
AD_PROVIDER=google     # Google AdSense/AdMob
AD_PROVIDER=unity      # Unity Ads
```

A factory function resolves the provider:

```typescript
export function getAdProvider(): AdProvider {
  const providerName = process.env.AD_PROVIDER || 'mock'
  switch (providerName) {
    case 'mock': return mockAdProvider
    case 'google': return googleAdProvider
    case 'unity': return unityAdProvider
    default: throw new AppError('INVALID_AD_PROVIDER', `Unknown provider: ${providerName}`)
  }
}
```

## Rate Limiting Per IP

Unlock requests are rate-limited to prevent abuse:

- **10 unlock requests per minute per IP.** Exceeding this returns 429 Too Many Requests.
- **50 unlock requests per hour per IP.** Catches slower automated abuse.
- **IP addresses are hashed** before storage (SHA-256 with a server-side salt). Raw IPs are never persisted.

Implementation approach:
- Use an in-memory store (Map or Redis) for rate limit counters.
- Key: `unlock:${hashedIp}:${windowKey}`
- Sliding window algorithm preferred over fixed windows.

## Abuse Prevention

### Ad Completion Spoofing

- Never trust the client alone for ad completion. Always verify with the ad provider's server-side API.
- The mock adapter in development accepts a known token, but real providers use cryptographic verification.

### Automated Unlocking

- Rate limiting catches high-frequency automation.
- Consider adding a simple proof-of-work or CAPTCHA challenge if abuse patterns emerge.
- Monitor for unusual patterns: same IP unlocking hundreds of prompts, or unlocks with no corresponding ad impressions.

### Token Replay

- Unlock tokens should include the promptId, a timestamp, and be signed with a server secret.
- Tokens expire after a configurable period (default: 30 days).
- Each token is valid for exactly one prompt.

## Revenue Tracking

Every successful unlock creates two records:

1. **UnlockEvent** -- tracks that the prompt was unlocked, by whom, and via what method.
2. **AdEvent** -- tracks the ad impression, provider, estimated revenue, and completion status.

Revenue reporting queries join these tables to calculate:
- Revenue per prompt.
- Revenue per category.
- Revenue per time period.
- Ad completion rate (completions / requests).
- Revenue per provider (when multiple providers are active).

## How to Add a New Ad Provider

1. Create a new file: `src/lib/adapters/[provider-name]-ad-provider.ts`.
2. Implement the `AdProvider` interface (getAdConfig, verifyCompletion).
3. Add the provider to the factory function's switch statement.
4. Add the provider's SDK script to the unlock page client component.
5. Add the provider name to `.env.example` with documentation.
6. Add environment variables for the provider's API keys.
7. Test locally by setting `AD_PROVIDER=[provider-name]`.
8. Write integration tests that mock the provider's verification API.
9. Update `memory/decisions-log.md` with the rationale for the new provider.

## Client-Side Unlock Component

The unlock button is a client component that:

1. Checks localStorage for an existing valid unlock token.
2. If found and valid, displays the full content immediately.
3. If not found, shows the "Unlock" button.
4. On click, fetches ad config from the API.
5. Renders the ad using the provider's client SDK.
6. On ad completion, sends the completion token to the verify endpoint.
7. Stores the returned unlock token in localStorage.
8. Reveals the full prompt content.

The component should handle all error states: ad load failure, verification failure, network errors, rate limiting.
