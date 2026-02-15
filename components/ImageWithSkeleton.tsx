"use client"

import * as React from "react"
import Image from "next/image"
import Skeleton from "./ui/Skeleton"

export default function ImageWithSkeleton({ src, alt, className, width, height, fill }: any) {
  const [loaded, setLoaded] = React.useState(false)
  return (
    <div className={`relative w-full h-full ${className || ""}`}>
      {!loaded && <Skeleton className="absolute inset-0" />}
      <Image
        src={src}
        alt={alt}
        {...(fill ? { fill: true } : { width: width || 300, height: height || 200 })}
        className={`object-cover ${loaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        onLoadingComplete={() => setLoaded(true)}
      />
    </div>
  )
}

