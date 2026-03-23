export interface CompletionParams {
  prompt: string
  systemPrompt?: string
  maxTokens?: number
  temperature?: number
}

export interface CompletionResult {
  content: string
  usage?: { promptTokens: number; completionTokens: number }
}

export interface AIProvider {
  readonly name: string
  generateCompletion(params: CompletionParams): Promise<CompletionResult>
}
