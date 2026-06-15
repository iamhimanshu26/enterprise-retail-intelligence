import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const DEMO_USER: User = {
  id: '1',
  email: 'executive@retailcorp.com',
  name: 'Sarah Chen',
  role: 'Chief Data Officer',
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        await new Promise((resolve) => setTimeout(resolve, 800))
        if (email === 'executive@retailcorp.com' && password === 'Enterprise2026!') {
          const token = 'demo-jwt-token-phase-0'
          localStorage.setItem('accessToken', token)
          set({ user: DEMO_USER, accessToken: token, isAuthenticated: true })
          return true
        }
        return false
      },
      logout: () => {
        localStorage.removeItem('accessToken')
        set({ user: null, accessToken: null, isAuthenticated: false })
      },
    }),
    { name: 'auth-storage' },
  ),
)
