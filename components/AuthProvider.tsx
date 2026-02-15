"use client"

import * as React from "react"

type User = { id: string; name: string; email: string; avatar?: string } | null

const AuthContext = React.createContext<{
  user: User
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}>({
  user: null,
  loading: true,
  login: async () => false,
  logout: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    let mounted = true
    async function fetchMe() {
      try {
        const res = await fetch("/api/auth/me")
        const data = await res.json()
        if (!mounted) return
        setUser(data.user)
      } catch (err) {
        setUser(null)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchMe()
    return () => {
      mounted = false
    }
  }, [])

  async function login(email: string, password: string) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok && data.user) {
        setUser(data.user)
        return true
      }
      return false
    } catch (err) {
      return false
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return React.useContext(AuthContext)
}

