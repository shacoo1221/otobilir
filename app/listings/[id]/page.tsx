import * as React from "react"
import { getListing } from "@/lib/listings"
import dynamic from "next/dynamic"

const FavoriteButton = dynamic(() => import("@/components/FavoriteButton"), { ssr: false })

type Props = { params: { id: string } }

export default function Page({ params }: Props) {
  const data = getListing(params.id)
  if (!data) {
    return <main className="container py-12">Seçilen ilan bulunamadı.</main>
  }

  return (
    <main className="container py-12">
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.image || "/images/placeholder.svg"} alt={data.title} className="w-full h-64 object-cover rounded-md" />
          </div>
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold">{data.title}</h1>
            <div className="text-sm text-gray-600">{data.make} {data.model} • {data.year}</div>
            <div className="mt-4">
              <strong>Fiyat: </strong> {typeof data.priceTL === "number" ? `${data.priceTL.toLocaleString("tr-TR")} ₺` : "-"}
            </div>
            <div className="mt-4">
              <p>{data.description}</p>
            </div>

            <div className="mt-4 flex items-center gap-3">
            {
              // FavoriteButton is a client component, import dynamically
            }
            <div>
              <FavoriteButton listingId={data.id} />
            </div>
              <div />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

