import { AIProvider, CompletionParams, CompletionResult } from './ai-provider.interface'

export class MockAIAdapter implements AIProvider {
  readonly name = 'mock'

  async generateCompletion(params: CompletionParams): Promise<CompletionResult> {
    const topic = this.extractTopic(params.prompt)

    const content = this.generateMockPrompt(topic)
    const promptTokens = Math.ceil(params.prompt.length / 4)
    const completionTokens = Math.ceil(content.length / 4)

    // Simulate a small delay to mimic API latency
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      content,
      usage: {
        promptTokens,
        completionTokens,
      },
    }
  }

  private extractTopic(prompt: string): string {
    const topicMatch = prompt.match(/topic[:\s]+["']?([^"'\n,]+)/i)
    if (topicMatch) return topicMatch[1].trim()

    const aboutMatch = prompt.match(/about\s+(.+?)[\.\n]/i)
    if (aboutMatch) return aboutMatch[1].trim()

    return 'general assistant'
  }

  private generateMockPrompt(topic: string): string {
    return JSON.stringify(
      {
        title: `Expert ${topic} Assistant`,
        description: `A carefully crafted prompt for ${topic} tasks. This prompt guides the AI to provide detailed, accurate, and well-structured responses related to ${topic}.`,
        content: [
          `You are an expert assistant specializing in ${topic}.`,
          '',
          '## Core Instructions',
          `- Provide accurate, detailed information about ${topic}`,
          '- Structure your responses clearly with headings and bullet points when appropriate',
          '- If you are unsure about something, say so rather than guessing',
          '- Cite sources or reasoning when making claims',
          '',
          '## Response Format',
          '1. Start with a brief summary of your answer',
          '2. Provide detailed explanation with examples',
          '3. End with actionable next steps or recommendations',
          '',
          '## Constraints',
          '- Keep responses concise but comprehensive',
          '- Use simple language unless technical terminology is necessary',
          "- Always consider the user's skill level and adjust accordingly",
        ].join('\n'),
      },
      null,
      2,
    )
  }
}
