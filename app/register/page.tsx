"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"

export default function RegisterPage() {
  const router = useRouter()
  const params = useSearchParams()
  const callback = params?.get("callbackUrl") || "/"
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [errors, setErrors] = React.useState<{ name?: string; email?: string; password?: string }>({})
  const [loading, setLoading] = React.useState(false)

  async function handle(e: React.FormEvent) {
    e.preventDefault()
    const nextErr: { name?: string; email?: string; password?: string } = {}
    if (!name || name.trim().length < 2) nextErr.name = "İsim en az 2 karakter olmalı"
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) nextErr.email = "Geçerli e-posta girin"
    if (!password || password.length < 4) nextErr.password = "Parola en az 4 karakter olmalı"
    setErrors(nextErr)
    if (Object.keys(nextErr).length > 0) return
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j?.error || "Register failed")
      // auto sign-in and poll for session readiness
      const s = await signIn("credentials", { redirect: false, email, password })
      setLoading(false)
      if (!s || (s as any).error) {
        router.push("/login")
        return
      }
      // poll /api/auth/me until user appears (max ~3s)
      let ok = false
      for (let i = 0; i < 15; i++) {
        try {
          const m = await fetch("/api/auth/me", { credentials: "include" })
          if (m.ok) {
            const jj = await m.json().catch(() => null)
            if (jj && jj.user) {
              ok = true
              break
            }
          }
        } catch (e) {}
        await new Promise((r) => setTimeout(r, 200))
      }
      if (ok) router.push(callback)
      else router.push("/login")
    } catch (err: any) {
      setLoading(false)
      alert(err.message || "Kayıt başarısız")
    }
  }

  return (
    <main className="container py-12">
      <h1 className="text-2xl font-bold mb-4">Kayıt Ol</h1>
      <form onSubmit={handle} className="max-w-md space-y-4">
        <div>
          <label htmlFor="register-name" className="text-sm block mb-1">İsim</label>
          <input id="register-name" name="name" className={`rounded-md border px-3 py-2 w-full ${errors.name ? "border-red-500" : ""}`} value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
        </div>
        <div>
          <label htmlFor="register-email" className="text-sm block mb-1">E-posta</label>
          <input id="register-email" name="email" className={`rounded-md border px-3 py-2 w-full ${errors.email ? "border-red-500" : ""}`} value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
        </div>
        <div>
          <label htmlFor="register-password" className="text-sm block mb-1">Parola</label>
          <input id="register-password" name="password" type="password" className={`rounded-md border px-3 py-2 w-full ${errors.password ? "border-red-500" : ""}`} value={password} onChange={(e) => setPassword(e.target.value)} />
          {errors.password && <div className="text-red-600 text-sm mt-1">{errors.password}</div>}
        </div>
        <div>
          <button className="btn btn-primary" disabled={loading}>{loading ? "Kayıt..." : "Kayıt Ol"}</button>
        </div>
      </form>
    </main>
  )
}

