"use client"

import * as React from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function ListingForm({ initial = {}, editId = "" }: { initial?: any; editId?: string }) {
  const router = useRouter()
  const { user, loading: authLoading } = (globalThis as any).__NEXT_AUTH ? (globalThis as any).__NEXT_AUTH : { user: null, loading: false }
  // useAuth client hook not available in server component; will fallback to simple check via fetch on mount
  const [loggedIn, setLoggedIn] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    let mounted = true
    async function check() {
      try {
        const res = await fetch("/api/auth/me")
        const d = await res.json()
        if (!mounted) return
        setLoggedIn(!!d.user)
      } catch {
        if (!mounted) return
        setLoggedIn(false)
      }
    }
    check()
    return () => { mounted = false }
  }, [])

  if (loggedIn === null) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          <div className="w-40 h-6"><div className="skeleton h-6 w-full" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><div className="skeleton h-10 w-full" /></div>
            <div><div className="skeleton h-10 w-full" /></div>
          </div>
          <div className="skeleton h-40 w-full" />
        </div>
      </div>
    )
  }

  if (!loggedIn) {
    return <div className="p-6">İlan oluşturmak için lütfen <a href="/login" className="text-primary">giriş yapın</a>.</div>
  }
  const [title, setTitle] = React.useState(initial.title || "")
  const [make, setMake] = React.useState(initial.make || "")
  const [model, setModel] = React.useState(initial.model || "")
  const [year, setYear] = React.useState(initial.year || "")
  const [priceTL, setPriceTL] = React.useState(initial.priceTL || "")
  const [segment, setSegment] = React.useState(initial.segment || "")
  const [body, setBody] = React.useState(initial.body || "")
  const [fuel, setFuel] = React.useState(initial.fuel || "")
  const [transmission, setTransmission] = React.useState(initial.transmission || "")
  const [image, setImage] = React.useState(initial.image || "/images/placeholder.svg")
  const [description, setDescription] = React.useState(initial.description || "")
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = { title, make, model, year, priceTL, segment, body, fuel, transmission, image, description }
      if (editId) {
        const res = await fetch(`/api/listings/${editId}?id=${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to update")
        router.push("/listings/manage")
      } else {
        const res = await fetch("/api/listings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error("Failed to create")
        const data = await res.json()
        router.push("/listings/manage")
      }
    } catch (err) {
      alert("Kaydetme başarısız")
    } finally {
      setLoading(false)
    }
  }

  // simple image preview from input URL
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      <div>
        <label htmlFor="listing-image-file" className="text-sm block mb-1">Görsel Yükle (opsiyonel)</label>
        <input
          id="listing-image-file"
          name="imageFile"
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const f = e.target.files?.[0]
            if (!f) return
            const reader = new FileReader()
            reader.onload = async () => {
              const dataUrl = reader.result as string
              try {
                const res = await fetch("/api/upload", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ filename: f.name, dataUrl }),
                })
                const j = await res.json()
                if (res.ok && j.url) setImage(j.url)
                else alert("Yükleme başarısız")
              } catch {
                alert("Yükleme hatası")
              }
            }
            reader.readAsDataURL(f)
          }}
        />
      </div>
      <div className="grid grid-cols-1 gap-3">
        <label htmlFor="listing-title" className="text-sm">Başlık</label>
        <input id="listing-title" name="title" className="rounded-md border px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="listing-make" className="text-sm">Marka</label>
          <input id="listing-make" name="make" className="rounded-md border px-3 py-2" value={make} onChange={(e) => setMake(e.target.value)} />
        </div>
        <div>
          <label htmlFor="listing-model" className="text-sm">Model</label>
          <input id="listing-model" name="model" className="rounded-md border px-3 py-2" value={model} onChange={(e) => setModel(e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="listing-year" className="text-sm">Yıl</label>
          <input id="listing-year" name="year" type="number" className="rounded-md border px-3 py-2" value={year} onChange={(e) => setYear(e.target.value)} />
        </div>
        <div>
          <label htmlFor="listing-price" className="text-sm">Fiyat (TL)</label>
          <input id="listing-price" name="priceTL" type="number" className="rounded-md border px-3 py-2" value={priceTL} onChange={(e) => setPriceTL(Number(e.target.value))} />
        </div>
      </div>

      <div>
        <label htmlFor="listing-image-url" className="text-sm">Görsel URL (geçici)</label>
        <input id="listing-image-url" name="image" className="rounded-md border px-3 py-2" value={image} onChange={(e) => setImage(e.target.value)} />
          <div className="mt-2">
          <ImageWithSkeleton src={image} alt="preview" width={320} height={200} className="w-full max-w-sm rounded-md border object-cover" />
        </div>
      </div>

      <div>
        <label htmlFor="listing-description" className="text-sm">Açıklama</label>
        <textarea id="listing-description" name="description" className="rounded-md border px-3 py-2 w-full" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? (editId ? "Güncelleniyor..." : "Kaydediliyor...") : (editId ? "Güncelle" : "İlanı Oluştur")}
        </button>
        {editId && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={async () => {
              if (!confirm("İlan silinsin mi?")) return
              const res = await fetch(`/api/listings/${editId}?id=${editId}`, { method: "DELETE" })
              if (res.ok) location.href = "/listings/manage"
              else alert("Silme başarısız")
            }}
          >
            İlanı Sil
          </button>
        )}
      </div>
    </form>
  )
}

