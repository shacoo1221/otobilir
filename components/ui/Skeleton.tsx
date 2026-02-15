"use client"

import * as React from "react"

export default function Skeleton({ className = "", circle = false }: { className?: string; circle?: boolean }) {
  return (
    <div
      aria-hidden
      className={`skeleton ${circle ? "skeleton-circle" : "skeleton-rect"} ${className}`}
    />
  )
}

