"use client"

import * as React from "react"
import { useSession } from "next-auth/react"
import Skeleton from "./ui/Skeleton"

export default function SavedComparisonsList() {
  const { data: session } = useSession()
  const [items, setItems] = React.useState<any[] | null>(null)

  React.useEffect(() => {
    let mounted = true
    async function load() {
      const res = await fetch("/api/saved-comparisons", { credentials: "include" })
      if (!res.ok) return
      const j = await res.json()
      if (!mounted) return
      setItems(j.saved || [])
    }
    if (session) load()
    else setItems([])
    function onUpdate() { if (session) load() }
    window.addEventListener("savedComparisonsUpdated", onUpdate)
    return () => { mounted = false }
    window.removeEventListener("savedComparisonsUpdated", onUpdate)
  }, [session])

  if (items === null) {
    return (
      <div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 skeleton-circle" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 skeleton-circle" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 skeleton-circle" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  if (items.length === 0) return <div>Henüz kaydedilmiş karşılaştırma yok.</div>

  return (
    <ul className="space-y-2">
      {items.map((s) => (
        <li key={s.id} className="flex items-center justify-between">
          <a href={`/compare?left=${encodeURIComponent(s.left)}&right=${encodeURIComponent(s.right)}`} className="text-primary">
            {s.left.split("|").slice(0,2).join(" ")} vs {s.right.split("|").slice(0,2).join(" ")}
          </a>
          <button className="btn btn-ghost" onClick={async ()=> {
            const res = await fetch(`/api/saved-comparisons?id=${s.id}`, { method: "DELETE" })
            if (res.ok) {
              setItems((it)=>it.filter(x=>x.id!==s.id))
            } else alert("Kaldırılamadı")
          }}>Kaldır</button>
        </li>
      ))}
    </ul>
  )
}

