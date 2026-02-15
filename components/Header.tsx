'use client'

import Link from 'next/link'
import { Button } from './ui'
import Avatar from './ui/Avatar'
import SearchAutocomplete from './SearchAutocomplete'
import { useAuth } from './AuthProvider'
import { useRouter } from 'next/navigation'

export default function Header() {
  // use next-auth session
  const router = useRouter()
  const { data: session, status } = require("next-auth/react").useSession()
  const user = session?.user
  const logout = async () => {
    const { signOut } = require("next-auth/react")
    await signOut({ redirect: false })
    router.refresh()
  }
  return (
    <header className="border-b bg-white">
      <div className="container flex items-center justify-between py-4">
        <div className="flex items-center gap-4">
          <img src="/logo.svg" alt="OTOBİLİR" className="logo" />
          {/* small mascot next to logo */}
          <img src="/bilgin.svg" alt="Bilgin" className="mascot hidden sm:inline-block" />
        </div>

        <div className="flex-1 px-4">
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <SearchAutocomplete id="header-search" placeholder="Hangi arabayı merak ediyorsun?" onSelect={(car)=>{router.push(`/compare?left=${encodeURIComponent(`${car.make}|${car.model}|${car.year}`)}`)}} />
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-3">
          {!user ? (
            <>
              <Link href={`/login?callbackUrl=/profile`}><Button variant="ghost">Giriş Yap</Button></Link>
              <Link href={`/register?callbackUrl=/profile`}><Button variant="primary">Kayıt Ol</Button></Link>
            </>
          ) : (
            <>
              <Link href="/profile"><Button variant="ghost">{user.name || "Profil"}</Button></Link>
              <Button variant="ghost" onClick={async () => { await logout(); router.refresh() }}>Çıkış</Button>
              <Avatar src={user.avatar} alt={user.name} size="md" />
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

