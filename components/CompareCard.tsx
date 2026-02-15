"use client"

import * as React from "react"
import Select from "./ui/Select"
import Image from "next/image"
import ImageWithSkeleton from "./ImageWithSkeleton"

type CarOption = {
  make: string
  model: string
  year: string
  image: string
}

type Props = {
  title: string
  value: { make?: string; model?: string; year?: string }
  onChange: (next: { make?: string; model?: string; year?: string }) => void
  makes: string[]
  models: string[]
  years: string[]
  image?: string
}

export default function CompareCard({ title, value, onChange, makes, models, years, image }: Props) {
  return (
    <div className="card shadow-md p-0 overflow-hidden w-full">
      <div className="relative">
        <div className="bg-purple-600 h-44 w-full" />
        <div className="absolute left-0 right-0 -bottom-8 flex items-center justify-center pointer-events-none">
          <div className="w-72 h-32 relative">
            {image ? (
              <div className="relative w-full h-full">
                <ImageWithSkeleton src={image} alt="car" fill className="object-contain" />
              </div>
            ) : (
              <div className="text-gray-400">Görsel yok</div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 pt-10 space-y-3">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>

        <div className="space-y-3">
        <Select
          label="Marka"
          value={value.make || ""}
          onChange={(v) => onChange({ ...value, make: v })}
          options={makes.map((m) => ({ value: m, label: m }))}
          placeholder="Marka seçin"
        />

        <Select
          label="Model"
          value={value.model || ""}
          onChange={(v) => onChange({ ...value, model: v })}
          options={models.map((m) => ({ value: m, label: m }))}
          placeholder="Model seçin"
        />

        <Select
          label="Yıl"
          value={value.year || ""}
          onChange={(v) => onChange({ ...value, year: v })}
          options={years.map((y) => ({ value: y, label: y }))}
          placeholder="Yıl seçin"
        />
      </div>
    </div>
  </div>
  )
}

