 "use client"

import * as React from "react"
import SignInModal from "./SignInModal"
import { useSession, signIn } from "next-auth/react"
import { useToast } from "./ui/ToastProvider"

export default function CompareSaveControls({ left, right }: { left?: string | null; right?: string | null }) {
  const { data: session, status } = useSession()
  const toast = useToast()
  const [sessionChecked, setSessionChecked] = React.useState<boolean | null>(null)
  const [showModal, setShowModal] = React.useState(false)
  const [sessionUser, setSessionUser] = React.useState<any>(null)
  const [pendingSave, setPendingSave] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [msg, setMsg] = React.useState<string | null>(null)

  // if session becomes available, close modal and proceed with pending actions
  React.useEffect(() => {
    if (session && session.user) {
      setShowModal(false)
      setSessionUser(session.user)
      setSessionChecked(true)
      if (pendingSave) {
        setPendingSave(false)
        doSave()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  async function doSave() {
    if (!left || !right) {
      alert("İki araç da seçili olmalı")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/saved-comparisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ left, right }),
        credentials: "include",
      })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (res.status === 401) {
          setMsg("Giriş gerekli")
          setTimeout(() => setMsg(null), 2000)
        } else {
          setMsg(j?.error || "Kaydedilemedi")
          setTimeout(() => setMsg(null), 2500)
        }
      } else {
        setMsg("Karşılaştırma kaydedildi")
        try { toast({ title: "Kaydedildi", message: "Karşılaştırma kaydedildi.", type: "success" }) } catch {}
        // notify listeners (profile list) to reload
        try { window.dispatchEvent(new CustomEvent("savedComparisonsUpdated")) } catch {}
        setTimeout(() => setMsg(null), 2500)
      }
    } catch (e) {
      console.error(e)
      setMsg("Sunucu hatası")
      setTimeout(() => setMsg(null), 2500)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    // prefer client session if available
    if (status === "loading") {
      // wait a tick for session to load
      await new Promise((res) => setTimeout(res, 250))
    }
    if (session && session.user) {
      await doSave()
      return
    }

    // fallback: try /api/auth/me
    try {
    const r = await fetch("/api/auth/me", { credentials: "include" })
      const j = await r.json()
      setSessionChecked(!!j.user)
      setSessionUser(j.user)
      if (!j.user) {
        // try cookie fallback (legacy otobilir_user)
        try {
          const cookies = Object.fromEntries(document.cookie.split(";").map(c => {
            const [k, ...rest] = c.trim().split("=")
            return [k, rest.join("=")]
          }))
          const userId = cookies["otobilir_user"]
          if (userId) {
            // assume logged in via legacy cookie
            setSessionUser({ id: userId })
            setSessionChecked(true)
            await doSave()
            return
          }
        } catch (err) {
          // ignore
        }

        // open modal and mark that user intended to save
        setPendingSave(true)
        setShowModal(true)
        return
      }
      await doSave()
    } catch (e) {
      // open modal if anything fails
      setPendingSave(true)
      setShowModal(true)
    }
  }

  return (
    <>
    <div className="mt-4 flex items-center gap-3">
      <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
        {loading ? "Kaydediliyor..." : "Karşılaştırmayı Kaydet"}
      </button>
      {msg && <div className="text-green-700 font-semibold">{msg}</div>}
    </div>
    <SignInModal open={showModal} onClose={() => { setShowModal(false); setPendingSave(false) }} onSuccess={async ()=> {
      // after successful sign-in, refresh session check and proceed if user wanted to save
      const r = await fetch("/api/auth/me", { credentials: "include" })
      const j = await r.json()
      setSessionChecked(!!j.user)
      setSessionUser(j.user)
      if (pendingSave) {
        setPendingSave(false)
        await doSave()
      }
    }} />
    </>
  )
}

