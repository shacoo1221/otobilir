"use client"

import React from "react"

export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 transition-transform transform hover:-translate-y-1 hover:shadow-lg">
      {children}
    </div>
  )
}

