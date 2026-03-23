import { AIProvider } from './ai-provider.interface'
import { MockAIAdapter } from './mock-ai.adapter'

export function getAIProvider(): AIProvider {
  const provider = process.env.AI_PROVIDER ?? 'mock'

  switch (provider) {
    case 'mock':
      return new MockAIAdapter()
    default:
      throw new Error(`Unknown AI provider: ${provider}`)
  }
}

export type { AIProvider, CompletionParams, CompletionResult } from './ai-provider.interface'
