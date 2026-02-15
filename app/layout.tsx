import './globals.css'
import { ReactNode } from 'react'
import NextAuthProvider from '../components/NextAuthProvider'
import ToastProvider from '@/components/ui/ToastProvider'
import PageTransition from '@/components/PageTransition'

export const metadata = {
  title: 'OTOBİLİR',
  description: 'Otomobili, Otobilir.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <NextAuthProvider>
          <ToastProvider>
            <PageTransition>
              <div className="min-h-screen">
                {children}
              </div>
            </PageTransition>
          </ToastProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}

