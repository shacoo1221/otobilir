import { use } from "react"
import { listAll } from "@/lib/listings"

async function fetchListings() {
  // server-side: read from internal store directly to avoid absolute URL issues during build
  return listAll()
}

export default function ManagePage() {
  const listings = use(fetchListings())

  return (
    <main className="container py-12">
      <h1 className="text-2xl font-bold mb-6">İlanlarım</h1>
      <div className="grid grid-cols-1 gap-4">
        {listings.length === 0 && <div className="text-gray-600">Henüz ilan yok.</div>}
        {listings.map((l: any) => (
          <div key={l.id} className="card flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.image || "/images/placeholder.svg"} alt={l.title} className="w-36 h-24 object-cover rounded-md" />
            <div className="flex-1">
              <div className="font-semibold">{l.title}</div>
              <div className="text-sm text-gray-600">{l.make} {l.model} • {l.year}</div>
            </div>
            <div>
              <a href={`/listings/${l.id}`} className="btn btn-ghost mr-2">Görüntüle</a>
              <button
                className="btn btn-ghost"
                onClick={async () => {
                  if (!confirm("İlan silinsin mi?")) return
                  const res = await fetch(`/api/listings/${l.id}?id=${l.id}`, { method: "DELETE" })
                  if (res.ok) location.reload()
                  else alert("Silme başarısız")
                }}
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

