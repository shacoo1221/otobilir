"use client"

import * as React from "react"
import { useRouter } from "next/navigation"

export default function OwnerActions({ listingId, ownerId }: { listingId: string; ownerId?: string }) {
  const [isOwner, setIsOwner] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const router = useRouter()

  React.useEffect(() => {
    let mounted = true
    async function check() {
      try {
        const res = await fetch("/api/auth/me")
        const j = await res.json()
        if (!mounted) return
        setIsOwner(!!(j.user && ownerId && j.user.id === ownerId))
      } catch {
        if (!mounted) return
        setIsOwner(false)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    check()
    return () => { mounted = false }
  }, [ownerId])

  if (loading) return null
  if (!isOwner) return null

  return (
    <div className="flex items-center gap-2">
      <a href={`/listings/${listingId}/edit`} className="btn btn-ghost">Düzenle</a>
      <button className="btn btn-ghost" onClick={async () => {
        if (!confirm("İlan silinsin mi?")) return
        const res = await fetch(`/api/listings/${listingId}?id=${listingId}`, { method: "DELETE" })
        if (res.ok) router.push("/listings/manage")
        else alert("Silme başarısız")
      }}>Sil</button>
    </div>
  )
}

