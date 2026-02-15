 "use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { useToast } from "./ui/ToastProvider"

export default function SignInModal({ open, onClose, onSuccess }: { open: boolean; onClose: () => void; onSuccess?: () => void }) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const toast = useToast()

  React.useEffect(() => {
    if (!open) {
      setEmail("")
      setPassword("")
      setError(null)
      setLoading(false)
    }
  }, [open])

  async function handle() {
    setLoading(true)
    setError(null)
    try {
      // try non-redirect signin first to detect success
      const res = await signIn("credentials", { redirect: false, email, password })
      setLoading(false)
      if (!res || (res as any).error) {
        // fallback to legacy login endpoint which sets cookie
        const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }), credentials: "include" })
        if (r.ok) {
          try { toast({ title: "Giriş başarılı", message: "Hoş geldiniz!", type: "success" }) } catch {}
          window.location.href = "/profile"
          return
        } else {
          const jr = await r.json().catch(()=>null)
          setError(jr?.error || "Giriş başarısız")
          return
        }
      }

      // poll for session to be available
      let ok = false
      for (let i = 0; i < 15; i++) {
        try {
          const m = await fetch("/api/auth/me", { credentials: "include" })
          if (m.ok) {
            const j = await m.json().catch(() => null)
            if (j && j.user) { ok = true; break }
          }
        } catch (e) {}
        await new Promise((r) => setTimeout(r, 200))
      }
      if (!ok) {
        // fallback to legacy login endpoint
        const r = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }), credentials: "include" })
        if (r.ok) {
          try { toast({ title: "Giriş başarılı", message: "Hoş geldiniz!", type: "success" }) } catch {}
          window.location.href = "/profile"
          return
        }
        setError("Giriş yapıldı ancak oturum doğrulanamadı. Lütfen sayfayı yenileyin.")
        return
      }
      try { toast({ title: "Giriş başarılı", message: "Hoş geldiniz!", type: "success" }) } catch {}
      onSuccess?.()
      onClose()
    } catch (e) {
      setLoading(false)
      setError("Sunucu hatası")
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-3">Giriş Yap</h3>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="mb-2">
          <label htmlFor="signin-email" className="text-sm block">E-posta</label>
          <input id="signin-email" name="email" className="rounded-md border px-3 py-2 w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mb-4">
          <label htmlFor="signin-password" className="text-sm block">Parola</label>
          <input id="signin-password" name="password" type="password" className="rounded-md border px-3 py-2 w-full" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="flex items-center justify-end gap-2">
          <button className="btn btn-ghost" onClick={onClose}>İptal</button>
          <button className="btn btn-primary" onClick={handle} disabled={loading}>{loading ? "Giriş..." : "Giriş Yap"}</button>
        </div>
      </div>
    </div>
  )
}

