"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import ListingForm from "@/components/ListingForm"

export default function EditListingPage() {
  const params = useParams() as { id: string }
  const id = params?.id
  const router = useRouter()
  const [loading, setLoading] = React.useState(true)
  const [forbidden, setForbidden] = React.useState(false)
  const [initial, setInitial] = React.useState<any>(null)

  React.useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const res = await fetch(`/api/listings/${id}?id=${id}`)
        if (!res.ok) {
          setInitial(null)
          setForbidden(true)
          return
        }
        const data = await res.json()
        // check owner
        const me = await fetch("/api/auth/me")
        const meJ = await me.json()
        if (!meJ.user || meJ.user.id !== data.ownerId) {
          setForbidden(true)
          return
        }
        if (mounted) setInitial(data)
      } catch (err) {
        setForbidden(true)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id])

  if (loading) {
    return (
      <main className="container py-12">
        <div className="space-y-4">
          <div className="skeleton h-8 w-1/3" />
          <div className="skeleton h-48 w-full rounded-md" />
          <div className="grid grid-cols-2 gap-4">
            <div className="skeleton h-10 w-full" />
            <div className="skeleton h-10 w-full" />
          </div>
        </div>
      </main>
    )
  }
  if (forbidden) return <main className="container py-12">Bu ilanı düzenleme yetkiniz yok veya ilan bulunamadı.</main>

  return (
    <main className="container py-12">
      <h1 className="text-2xl font-bold mb-6">İlanı Düzenle</h1>
      <ListingForm initial={initial} editId={id} />
    </main>
  )
}

