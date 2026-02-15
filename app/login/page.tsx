 'use client'

import * as React from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
  const callback = params.get("callbackUrl") || "/"
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [errors, setErrors] = React.useState<{ email?: string; password?: string }>({})
  const [loading, setLoading] = React.useState(false)

  async function handle(e: React.FormEvent) {
    e.preventDefault()
    // basic client validation
    const nextErr: { email?: string; password?: string } = {}
    if (!email) nextErr.email = "E-posta gerekli"
    if (!password) nextErr.password = "Parola gerekli"
    setErrors(nextErr)
    if (Object.keys(nextErr).length > 0) return
    setLoading(true)
    // use full redirect sign-in so NextAuth can set cookies reliably
    await signIn("credentials", { redirect: true, email, password, callbackUrl: callback })
    // if redirect fails, fall back to showing error
    setLoading(false)
    alert("Giriş yönlendiriliyor... eğer sayfa değişmezse lütfen sayfayı yenileyin.")
  }

  return (
    <main className="container py-12">
      <h1 className="text-2xl font-bold mb-4">Giriş Yap</h1>
      <form onSubmit={handle} className="max-w-md space-y-4">
        <div>
          <label htmlFor="login-email" className="text-sm block mb-1">E-posta</label>
          <input id="login-email" name="email" className={`rounded-md border px-3 py-2 w-full ${errors.email ? "border-red-500" : ""}`} value={email} onChange={(e)=>setEmail(e.target.value)} />
          {errors.email && <div className="text-red-600 text-sm mt-1">{errors.email}</div>}
        </div>
        <div>
          <label htmlFor="login-password" className="text-sm block mb-1">Parola</label>
          <input id="login-password" name="password" type="password" className={`rounded-md border px-3 py-2 w-full ${errors.password ? "border-red-500" : ""}`} value={password} onChange={(e)=>setPassword(e.target.value)} />
          {errors.password && <div className="text-red-600 text-sm mt-1">{errors.password}</div>}
        </div>
        <div>
          <button className="btn btn-primary" disabled={loading}>{loading ? "Giriş..." : "Giriş Yap"}</button>
        </div>
      </form>
    </main>
  )
}

