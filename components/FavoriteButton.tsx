"use client"

import * as React from "react"
import { useToast } from "./ui/ToastProvider"

export default function FavoriteButton({ listingId }: { listingId: string }) {
  const [loading, setLoading] = React.useState(false)
  const toast = useToast()
  async function handle() {
    setLoading(true)
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
        credentials: "include",
      })
      if (res.ok) {
        toast({ title: "Favori", message: "Favorilere eklendi", type: "success" })
      } else {
        toast({ title: "Hata", message: "Favori eklenemedi", type: "error" })
      }
    } catch (e) {
      toast({ title: "Hata", message: "Ağ hatası", type: "error" })
    } finally {
      setLoading(false)
    }
  }
  return (
    <button className="btn btn-primary" onClick={handle} disabled={loading}>
      {loading ? "Ekleniyor..." : "Favorilere Ekle"}
    </button>
  )
}

