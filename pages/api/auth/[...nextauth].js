import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      async authorize(credentials) {
        try {
          const response = await fetch(`${process.env.URL}/api/users/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          })

          const data = await response.json()

          if (response.status !== 200)
            return Promise.reject(new Error(data.message))

          return data
        } catch (error) {
          console.log(error)
        }
      },
    }),
  ],
  pages: {
    signIn: "/users/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.user.email = token.user.email
      session.user.name = token.user.name
      session.user.role = token.user.role

      return session
    },
  },
  session: {
    maxAge: 0.5 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions)
