import { UserRole } from '@prisma/client'

export interface SessionUser {
  id: string
  email: string
  name: string | null
  image: string | null
  role: UserRole
}

// Extend next-auth types
declare module 'next-auth' {
  interface Session {
    user: SessionUser
  }
  interface User {
    role: UserRole
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
  }
}
