"use client"

import * as React from "react"
import Skeleton from "./Skeleton"

export default function SkeletonCard({ lines = 2 }: { lines?: number }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="w-full h-40 bg-gray-100 rounded-md overflow-hidden mb-3">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
    </div>
  )
}

