export type Article = {
  id: string
  title: string
  body: string
  createdAt: string
}

export type Comment = {
  id: string
  articleId: string
  userId: string
  authorName?: string
  authorAvatar?: string
  text: string
  createdAt: string
}

const ARTICLES: Article[] = [
  { id: "a1", title: "2024 Türkiye İkinci El Piyasası", body: "Güncel piyasa trendleri ve analizler...", createdAt: new Date().toISOString() },
  { id: "a2", title: "En Dayanıklı Modeller", body: "Kronik sorun analizleri ve ipuçları...", createdAt: new Date().toISOString() },
]

const COMMENTS: Comment[] = []

export function listArticles() { return ARTICLES }
export function getArticle(id: string) { return ARTICLES.find(a=>a.id===id) || null }
export function listComments(articleId: string) { return COMMENTS.filter(c=>c.articleId===articleId) }
export function createComment(articleId: string, userId: string, authorName:string|undefined, authorAvatar:string|undefined, text:string) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2,6)}`
  const c = { id, articleId, userId, authorName, authorAvatar, text, createdAt: new Date().toISOString() }
  COMMENTS.push(c)
  return c
}

