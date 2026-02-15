 'use client'

import Card from "./ui/Card"
import Badge from "./ui/Badge"
import ImageWithSkeleton from "./ImageWithSkeleton"

type Props = {
  image?: string
  model: string
  price: string
  score: string
  marketStatus: string
}

export default function ShowcaseCard({ image, model, price, score, marketStatus }: Props) {
  return (
    <Card>
      <div className="h-44 w-full bg-gray-100 rounded-md overflow-hidden flex items-center justify-center relative">
        {image ? (
          <ImageWithSkeleton src={image} alt={model} className="object-cover h-full w-full" width={800} height={300} />
        ) : (
          <div className="text-gray-400">Resim</div>
        )}
      </div>
      <div className="mt-3">
        <div className="text-sm text-gray-500">{model}</div>
        <div className="text-lg font-bold mt-1">{price}</div>
        <div className="mt-3 flex items-center gap-2">
          <Badge>{`Otobilir ${score}`}</Badge>
          <span className="px-2 py-1 text-sm rounded bg-emerald-50 text-emerald-700">{marketStatus}</span>
        </div>
      </div>
    </Card>
  )
}

