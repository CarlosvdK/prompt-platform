export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiErrorResponse {
  error: string
  code?: string
  details?: unknown
}

export interface UnlockSession {
  sessionId: string
  promptId: string
  adConfig: Record<string, unknown>
}

export interface UnlockToken {
  token: string
  promptId: string
  expiresAt: Date
}

export interface AuditFilters {
  userId?: string
  promptId?: string
  action?: string
  page?: number
  limit?: number
}
