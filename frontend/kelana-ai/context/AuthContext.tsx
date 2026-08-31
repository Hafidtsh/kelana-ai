"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import {
  AuthUser,
  AuthResponse,
  getUser,
  getToken,
  login as loginService,
  register as registerService,
  logout as logoutService,
} from "@/services/AuthService"

// ── Types ──────────────────────────────────────────────────────
interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

// ── Context ────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | null>(null)

// ── Provider ───────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser]   = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate session from localStorage on first mount
  useEffect(() => {
    const storedUser  = getUser()
    const storedToken = getToken()
    if (storedUser && storedToken) {
      setUser(storedUser)
      setToken(storedToken)
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const data: AuthResponse = await loginService(email, password)
    setUser(data.user)
    setToken(data.access_token)
    router.push("/")
  }, [router])

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const data: AuthResponse = await registerService(name, email, password)
      setUser(data.user)
      setToken(data.access_token)
      router.push("/")
    },
    [router],
  )

  const logout = useCallback(() => {
    logoutService()
    setUser(null)
    setToken(null)
    router.push("/login")
  }, [router])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>")
  return ctx
}
