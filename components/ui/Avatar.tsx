 "use client"

import * as React from "react"
import Image from "next/image"

type Props = {
  src?: string
  alt?: string
  size?: "sm" | "md" | "lg"
}

export default function Avatar({ src, alt = "Avatar", size = "md" }: Props) {
  const dims = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-14 w-14" : "h-10 w-10"
  return (
    <div className={`inline-flex items-center justify-center rounded-full bg-gray-100 overflow-hidden ${dims}`}>
      {src ? (
        // use Next/Image for optimization
        <Image src={src} alt={alt} width={56} height={56} className="object-cover h-full w-full" />
      ) : (
        <div className="text-sm font-semibold text-gray-700">{alt.charAt(0)}</div>
      )}
    </div>
  )
}

