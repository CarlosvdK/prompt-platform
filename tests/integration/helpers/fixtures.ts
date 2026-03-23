// Test data factories
import { PromptStatus, PromptType, UserRole } from '@prisma/client'

export function createTestUser(overrides?: Partial<any>) {
  return {
    email: `test-${Date.now()}@example.com`,
    name: 'Test User',
    role: UserRole.USER,
    ...overrides,
  }
}

export function createTestPrompt(overrides?: Partial<any>) {
  return {
    title: 'Test Prompt',
    slug: `test-prompt-${Date.now()}`,
    description: 'A test prompt for testing purposes',
    content: 'This is the full test prompt content',
    type: PromptType.TEXT,
    status: PromptStatus.DRAFT,
    ...overrides,
  }
}

export function createTestCategory(overrides?: Partial<any>) {
  return {
    name: 'Test Category',
    slug: `test-category-${Date.now()}`,
    ...overrides,
  }
}
