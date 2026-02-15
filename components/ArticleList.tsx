 "use client"

import * as React from "react"
import SkeletonCard from "./ui/SkeletonCard"

export default function ArticleList() {
  const [articles, setArticles] = React.useState<any[] | null>(null)

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch("/api/articles")
        const j = await res.json()
        if (!mounted) return
        setArticles(j || [])
      } catch {
        if (!mounted) return
        setArticles([])
      }
    })()
    return () => { mounted = false }
  }, [])

  if (articles === null) {
    return (
      <section className="container py-8">
        <h2 className="text-2xl font-bold mb-4">Araç Haberleri & Analizler</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>
    )
  }

  return (
    <section className="container py-8">
      <h2 className="text-2xl font-bold mb-4">Araç Haberleri & Analizler</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((a) => (
          <article key={a.id} className="card">
            <h3 className="text-lg font-semibold">{a.title}</h3>
            <p className="text-sm text-gray-600 mt-2">{a.body.slice(0, 160)}...</p>
            <div className="mt-3">
              <a href={`/articles/${a.id}`} className="text-primary">Devamını oku →</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

