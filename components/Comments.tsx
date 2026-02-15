 "use client"

import * as React from "react"
import { useSession, signIn } from "next-auth/react"
import SignInModal from "./SignInModal"

export default function Comments({ articleId, initialComments = [] }: { articleId: string; initialComments?: any[] }) {
  const [comments, setComments] = React.useState(initialComments)
  const [text, setText] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const { data: session } = useSession()
  const [showModal, setShowModal] = React.useState(false)
  const [pendingSubmit, setPendingSubmit] = React.useState(false)

  React.useEffect(() => {
    if (session && session.user) {
      setShowModal(false)
      if (pendingSubmit) {
        setPendingSubmit(false)
        // submit the comment after login
        (async () => {
          if (text.trim()) {
            await submit()
          }
        })()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session])

  async function load() {
    const res = await fetch(`/api/articles/${articleId}/comments?id=${articleId}`)
    if (!res.ok) return
    const data = await res.json()
    setComments(data)
  }

  React.useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function submit() {
    if (!text.trim()) return alert("Yorum boş olamaz")
    if (!session) {
      setPendingSubmit(true)
      setShowModal(true)
      return
    }
    setLoading(true)
    const res = await fetch(`/api/articles/${articleId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId, text }),
      credentials: "include",
    })
    setLoading(false)
    if (!res.ok) {
      if (res.status === 401) {
        const ok = confirm("Giriş gerekli. Giriş yapmak ister misiniz?")
        if (ok) signIn()
      } else {
        alert("Yorum gönderilemedi")
      }
      return
    }
    const j = await res.json()
    // reload comments to ensure consistent data
    await load()
    setText("")
  }

  return (
    <div>
      <div className="mb-4">
        <textarea className="w-full rounded-md border p-2" rows={3} value={text} onChange={(e) => setText(e.target.value)} />
        <div className="mt-2">
          <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading ? "Gönderiliyor..." : "Yorum Yap"}</button>
        </div>
      </div>

      <div className="space-y-4">
        {comments.length === 0 && <div className="text-gray-600">Henüz yorum yok.</div>}
        {comments.map((c: any) => (
          <div key={c.id} className="card">
            <div className="text-sm font-semibold">{c.authorName || c.userId || "Kullanıcı"}</div>
            <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleString()}</div>
            <div className="mt-2">{c.text}</div>
          </div>
        ))}
      </div>
      <SignInModal open={showModal} onClose={()=>{ setShowModal(false); setPendingSubmit(false) }} onSuccess={async ()=> {
        // after successful login, if user was trying to submit a comment, submit it
        await load()
        if (pendingSubmit) {
          setPendingSubmit(false)
          await submit()
        }
      }} />
    </div>
  )
}

