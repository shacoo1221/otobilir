 "use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { useSession } from "next-auth/react"
import Avatar from "@/components/ui/Avatar"

const SavedComparisonsList = dynamic(() => import("@/components/SavedComparisonsList"), { ssr: false })

export default function ProfilePage() {
  const { data: session } = useSession()
  const [profile, setProfile] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [form, setForm] = React.useState<{ name: string; age: string; gender: string; bio: string; phone?: string; avatar?: string }>({ name: "", age: "", gender: "", bio: "", phone: "", avatar: "" })
  const [uploadProgress, setUploadProgress] = React.useState<number | null>(null)
  const [errors, setErrors] = React.useState<{ [k: string]: string }>({})
  const [favorites, setFavorites] = React.useState<any[] | null>(null)
  const router = useRouter()
  const [success, setSuccess] = React.useState<string | null>(null)

  React.useEffect(() => {
    let mounted = true
    async function loadProfile() {
      const res = await fetch("/api/profile", { credentials: "include" })
      const j = await res.json()
      if (!mounted) return
      // if server returns no profile but session exists, fill from session fallback
      if (!j.profile && session && session.user) {
        setProfile(null)
        setForm({
          name: session.user.name || "",
          age: "",
          gender: "",
          bio: "",
          phone: "",
          avatar: (session.user as any)?.avatar || "",
        })
      } else {
        setProfile(j.profile)
        // update form to reflect saved values (keep age as string)
        setForm({
          name: j.profile?.name || "",
          age: j.profile?.age != null ? String(j.profile.age) : "",
          gender: j.profile?.gender || "",
          bio: j.profile?.bio || "",
          phone: j.profile?.phone || "",
          avatar: j.profile?.avatar || "",
        })
      }
      setLoading(false)
    }
    loadProfile();
    // attempt to sync otobilir_user cookie after sign-in if session exists
    (async () => {
      try {
        await fetch("/api/auth/sync-cookie", { credentials: "include" })
      } catch {}
    })()
    // load favorites
    ;(async () => {
      try {
        const r = await fetch("/api/favorites", { credentials: "include" })
        const j = await r.json()
        if (!mounted) return
        setFavorites(j.favorites || [])
      } catch {
        if (!mounted) return
        setFavorites([])
      }
    })()
    return () => { mounted = false }
  // re-run when session changes so fallback name is applied after login/register
  }, [session])

  // localStorage key helpers to persist profile client-side until user explicitly updates
  function localKey() {
    const uid = (session && (session as any).user && ((session as any).user.id || (session as any).user.email)) || "otobilir_anonymous"
    return `otobilir_profile_${uid}`
  }

  // on initial load, if server returned no profile try load from localStorage
  React.useEffect(() => {
    if (!loading && !profile) {
      try {
        const key = localKey()
        const raw = localStorage.getItem(key)
        if (raw) {
          const p = JSON.parse(raw)
          setForm({
            name: p.name || "",
            age: p.age != null ? String(p.age) : "",
            gender: p.gender || "",
            bio: p.bio || "",
            phone: p.phone || "",
            avatar: p.avatar || "",
          })
        }
      } catch (e) {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, profile])

  async function save() {
    // basic validation
    const nextErrors: { [k: string]: string } = {}
    if (!form.name || form.name.trim().length < 2) nextErrors.name = "İsim en az 2 karakter olmalı"
    if (form.age === "" || Number.isNaN(Number(form.age))) nextErrors.age = "Yaş geçerli bir sayı olmalı"
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    try {
      const res = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, age: form.age === "" ? null : Number(form.age), gender: form.gender, bio: form.bio, phone: (form as any).phone || "", avatar: (form as any).avatar || null }), credentials: "include" })
      const j = await res.json()
      console.log("PUT /api/profile status", res.status, j)
      if (!res.ok) {
        // if unauthorized and we have session user id, try dev-save fallback (dev only)
        if (res.status === 401 && session && (session as any).user?.id) {
          try {
            const devRes = await fetch("/api/profile/dev-save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: (session as any).user.id, name: form.name, age: Number(form.age), gender: form.gender, bio: form.bio, phone: (form as any).phone || "" }) })
            const dj = await devRes.json()
            if (devRes.ok) {
              setProfile(dj.profile)
              setForm({
                name: dj.profile?.name || "",
                age: dj.profile?.age != null ? String(dj.profile.age) : "",
                gender: dj.profile?.gender || "",
                bio: dj.profile?.bio || "",
                phone: dj.profile?.phone || "",
                avatar: dj.profile?.avatar || "",
              })
              setSuccess("Profil kaydedildi (dev-fallback)")
              setTimeout(() => {
                setSuccess(null)
                window.location.href = "/"
              }, 600)
              return
            } else {
              alert(dj?.error || "Profil kaydedilemedi (dev-fallback)")
              return
            }
          } catch (err) {
            console.error("dev-save failed", err)
            alert("Yetkilendirme hatası ve dev-fallback başarısız")
            return
          }
        }
        alert(j?.error || "Profil kaydedilemedi")
      } else {
        setProfile(j.profile)
        // refresh favorites (in case user info changed)
        try {
          const r = await fetch("/api/favorites", { credentials: "include" })
          const jf = await r.json()
          setFavorites(jf.favorites || [])
        } catch (e) {
          console.error("Failed to refresh favorites", e)
        }
        // show inline success and redirect to homepage
        setSuccess("Profil kaydedildi")
        // small delay so user sees the success message, then go home
        setTimeout(async () => {
          console.log("Attempting router.push to /")
          try {
            await router.push("/")
            console.log("router.push resolved")
          } finally {
            setSuccess(null)
          }
          // if router didn't navigate after a short timeout, force navigation
          setTimeout(() => {
            if (typeof window !== "undefined" && window.location.pathname !== "/") {
              window.location.href = "/"
            }
          }, 800)
        }, 600)
        // persist updated profile client-side as fallback
        try {
          const key = localKey()
          localStorage.setItem(key, JSON.stringify({
            name: j.profile?.name || "",
            age: j.profile?.age != null ? String(j.profile.age) : "",
            gender: j.profile?.gender || "",
            bio: j.profile?.bio || "",
            phone: j.profile?.phone || "",
            avatar: j.profile?.avatar || "",
          }))
        } catch (e) {}
      }
    } catch (e) {
      alert("Kaydetme sırasında bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <main className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="mb-4">
              <div className="skeleton h-6 w-1/3 mb-3" />
              <div className="skeleton h-10 w-full mb-3" />
              <div className="skeleton h-10 w-full mb-3" />
              <div className="skeleton h-24 w-full mb-3" />
            </div>
          </div>
          <div className="card">
            <div className="skeleton h-6 w-1/3 mb-3" />
            <div className="skeleton h-10 w-full mb-3" />
            <div className="skeleton h-10 w-full mb-3" />
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="container py-12">
      <h1 className="text-2xl font-bold mb-4">Profilim</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div>
          <label htmlFor="profile-name" className="text-sm block">İsim</label>
            <input
              id="profile-name"
              name="name"
              className={`rounded-md border px-3 py-2 w-full ${errors.name ? "border-red-500" : ""}`}
              value={form.name}
              onChange={(e)=>setForm({...form, name: e.target.value})}
              onKeyDown={(e) => { if (e.key === "Enter") e.preventDefault() }}
            />
            {errors.name && <div className="text-red-600 text-sm mt-1">{errors.name}</div>}
          </div>
          <div className="mt-3">
            <label htmlFor="profile-age" className="text-sm block">Yaş</label>
            <input
              id="profile-age"
              name="age"
              type="number"
              className={`rounded-md border px-3 py-2 w-full ${errors.age ? "border-red-500" : ""}`}
              value={form.age as any}
              onChange={(e)=> {
                // allow only digits
                const v = e.target.value.replace(/[^\d]/g, "")
                setForm({...form, age: v})
              }}
            />
            {errors.age && <div className="text-red-600 text-sm mt-1">{errors.age}</div>}
          </div>
          <div className="mt-3">
            <label htmlFor="profile-gender" className="text-sm block">Cinsiyet</label>
            <select id="profile-gender" name="gender" className="rounded-md border px-3 py-2 w-full" value={form.gender} onChange={(e)=>setForm({...form, gender: e.target.value})}>
              <option value="">Seçiniz</option>
              <option value="Erkek">Erkek</option>
              <option value="Kadın">Kadın</option>
              <option value="Diğer">Diğer</option>
            </select>
          </div>
          <div className="mt-3">
            <label htmlFor="profile-phone" className="text-sm block">Telefon (opsiyonel)</label>
            <input
              id="profile-phone"
              name="phone"
              className="rounded-md border px-3 py-2 w-full"
              value={(form as any).phone || ""}
              onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/[^0-9+() -]/g, "") })}
            />
          </div>
          <div className="mt-3">
            <label htmlFor="profile-bio" className="text-sm block">Hakkımda</label>
            <textarea
              id="profile-bio"
              name="bio"
              className="rounded-md border px-3 py-2 w-full"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              style={{ resize: "vertical", maxHeight: 300, overflow: "auto", width: "100%" }}
            />
            {/* helper text removed */}
          </div>
          <div className="mt-3">
            <button className="btn btn-primary" onClick={save}>Kaydet</button>
          </div>
          <div className="mt-4">
            <label htmlFor="avatar-file" className="text-sm block mb-1">Profil Fotoğrafı Yükle</label>
            <input
              id="avatar-file"
              name="avatar"
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={async (e) => {
                const f = e.target.files?.[0]
                if (!f) return

                // Client-side validation
                const ALLOWED = ["image/jpeg", "image/png", "image/webp"]
                const MAX_BYTES = 5 * 1024 * 1024 // 5MB
                if (!ALLOWED.includes(f.type)) {
                  return alert("Sadece JPG, PNG veya WEBP dosyalarına izin verilir.")
                }
                if (f.size > MAX_BYTES) {
                  return alert("Dosya çok büyük. Maksimum 5MB izin verilir.")
                }

                const reader = new FileReader()
                reader.onerror = () => {
                  setUploadProgress(null)
                  alert("Dosya okuma hatası")
                }
                reader.onprogress = (ev) => {
                  if (ev.lengthComputable) {
                    const pct = Math.round((ev.loaded / ev.total) * 100)
                    setUploadProgress(pct)
                  }
                }
                reader.onload = async () => {
                  const dataUrl = reader.result as string
                  setUploadProgress(60)
                  try {
                    const res = await fetch("/api/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: f.name, dataUrl }) })
                    const j = await res.json()
                    if (!res.ok) {
                      setUploadProgress(null)
                      return alert(j?.error || "Yükleme başarısız")
                    }
                    setForm((prev) => ({ ...prev, avatar: j.url }))
                    try {
                      const r = await fetch("/api/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, age: form.age === "" ? null : Number(form.age), gender: form.gender, bio: form.bio, phone: (form as any).phone || "", avatar: j.url }), credentials: "include" })
                      if (r.ok) {
                        setSuccess("Profil fotoğrafı güncellendi")
                        try {
                          const key = localKey()
                          localStorage.setItem(key, JSON.stringify({
                            name: form.name || "",
                            age: form.age || "",
                            gender: form.gender || "",
                            bio: form.bio || "",
                            phone: (form as any).phone || "",
                            avatar: j.url,
                          }))
                        } catch (err) {}
                        setTimeout(()=>setSuccess(null),2000)
                      } else {
                        const err = await r.json().catch(()=>({}))
                        alert(err?.error || "Profil güncellenemedi")
                      }
                    } catch (err) {
                      console.error(err)
                      alert("Profil güncellenirken hata")
                    }
                  } catch (err) {
                    setUploadProgress(null)
                    alert("Yükleme hatası")
                  } finally {
                    setUploadProgress(null)
                  }
                }
                reader.readAsDataURL(f)
              }}
            />
            {(form as any).avatar && (
              <div className="mt-2" style={{ maxWidth: 140 }}>
                <Avatar src={(form as any).avatar} alt="avatar" size="sm" />
              </div>
            )}
          </div>
          {success && <div className="mt-3 text-green-700 font-semibold">{success}</div>}
        </div>

        <div className="card">
          <h3 className="font-semibold mb-3">Favoriler</h3>
          <div>
            {favorites === null ? (
              <div>Yükleniyor...</div>
            ) : favorites.length === 0 ? (
              <div>Henüz favori yok.</div>
            ) : (
              <ul className="space-y-2">
                {favorites.map((f: any) => (
                  <li key={f.id} className="flex items-center justify-between">
                    <a href={`/listings/${f.id}`} className="flex items-center gap-3">
                      <img src={f.image || "/images/placeholder.svg"} alt={f.title || "listing"} className="w-14 h-10 object-cover rounded-md border" />
                      <div>
                        <div className="font-semibold">{f.title || `${f.make} ${f.model}`}</div>
                        <div className="text-sm text-gray-600">{f.priceTL ? `${f.priceTL} ₺` : ""}</div>
                      </div>
                    </a>
                    <button
                      className="btn btn-ghost"
                      onClick={async () => {
                        const res = await fetch(`/api/favorites?id=${f.id}`, { method: "DELETE" })
                        if (res.ok) {
                          const j = await res.json()
                          setFavorites(j.favorites || [])
                        } else alert("Kaldırılamadı")
                      }}
                    >
                      Kaldır
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="card mt-4">
          <h3 className="font-semibold mb-3">Kaydedilmiş Karşılaştırmalar</h3>
          <div>
            {/* client component */}
            <SavedComparisonsList />
          </div>
        </div>
      </div>
    </main>
  )
}

