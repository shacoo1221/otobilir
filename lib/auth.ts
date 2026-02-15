import CredentialsProvider from "next-auth/providers/credentials"
import { authenticate } from "@/lib/users"

// Centralized auth options for NextAuth and server-side session checks
export const authOptions: any = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null
        try {
          // eslint-disable-next-line no-console
          console.log("[auth] authorize attempt", { email: credentials.email })
        } catch {}
        const user = authenticate(credentials.email, credentials.password)
        if (user) {
          return { id: user.id, name: user.name, email: user.email }
        }
        return null
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.user = user
        token.sub = (user as any).id || token.sub
        token.email = (user as any).email || token.email
        token.name = (user as any).name || token.name
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && (token as any).user) {
        session.user = (token as any).user
      } else if (token && (token as any).sub) {
        session.user = { id: (token as any).sub, email: (token as any).email || null, name: (token as any).name || null }
      }
      return session
    },
  },
  // production-ready cookie settings
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Host-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret",
  debug: process.env.NODE_ENV === "development",
}

