import { getArticle, listComments } from "@/lib/articles"
import Comments from "@/components/Comments"

type Props = { params: { id: string } }

export default function ArticlePage({ params }: Props) {
  const article = getArticle(params.id)
  if (!article) return <main className="container py-12">Makale bulunamadı.</main>

  const comments = listComments(article.id)

  return (
    <main className="container py-12">
      <article className="card">
        <h1 className="text-2xl font-bold">{article.title}</h1>
        <p className="mt-4 text-gray-700">{article.body}</p>
      </article>

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Yorumlar</h2>
        <Comments articleId={article.id} initialComments={comments} />
      </section>
    </main>
  )
}

