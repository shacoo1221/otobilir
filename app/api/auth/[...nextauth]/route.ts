import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { authenticate, findUserByEmail } from "@/lib/users"

// Keep authOptions local (don't export) to avoid app-route type export conflicts during build
const authOptions: any = {
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
          // debug logging for failed signins
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
        // ensure id/email/name are preserved in token for later requests
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
        // fallback to token.sub and token.email/name if user object is absent
        session.user = { id: (token as any).sub, email: (token as any).email || null, name: (token as any).name || null }
      }
      return session
    },
  },
  // Cookie and security settings - production-ready defaults
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
  debug: process.env.NODE_ENV !== "production",
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

