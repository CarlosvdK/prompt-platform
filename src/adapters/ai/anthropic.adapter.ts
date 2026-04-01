import Anthropic from '@anthropic-ai/sdk'
import type { AIProvider, CompletionParams, CompletionResult } from './ai-provider.interface'

export class AnthropicAdapter implements AIProvider {
  readonly name = 'anthropic'
  private client: Anthropic

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY environment variable is required')
    this.client = new Anthropic({ apiKey })
  }

  async generateCompletion(params: CompletionParams): Promise<CompletionResult> {
    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: params.maxTokens ?? 4096,
      system: params.systemPrompt ?? '',
      messages: [{ role: 'user', content: params.prompt }],
      temperature: params.temperature ?? 0.7,
    })

    const textBlock = response.content.find((block) => block.type === 'text')

    return {
      content: textBlock?.text ?? '',
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
      },
    }
  }
}
