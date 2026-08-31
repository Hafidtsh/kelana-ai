const API_URL = process.env.NEXT_PUBLIC_API_URL

export interface AuthUser {
  id: number
  name: string
  email: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: AuthUser
}

// ── Token storage (localStorage) ──────────────────────────────
const TOKEN_KEY = "kelana_token"
const USER_KEY  = "kelana_user"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function getUser(): AuthUser | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try { return JSON.parse(raw) as AuthUser } catch { return null }
}

function saveSession(data: AuthResponse): void {
  localStorage.setItem(TOKEN_KEY, data.access_token)
  localStorage.setItem(USER_KEY, JSON.stringify(data.user))
  // Also set a cookie so Next.js middleware can read it
  document.cookie = `kelana_token=${data.access_token}; path=/; max-age=${60 * 60 * 24}; SameSite=Strict`
}

export function clearSession(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  // Expire the cookie
  document.cookie = "kelana_token=; path=/; max-age=0; SameSite=Strict"
}

// ── Auth header helper ─────────────────────────────────────────
export function authHeaders(): HeadersInit {
  const token = getToken()
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" }
}

// ── API calls ─────────────────────────────────────────────────
export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.detail ?? "Registrasi gagal")
  }
  const data: AuthResponse = await res.json()
  saveSession(data)
  return data
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => null)
    throw new Error(err?.detail ?? "Login gagal")
  }
  const data: AuthResponse = await res.json()
  saveSession(data)
  return data
}

export function logout(): void {
  clearSession()
}
