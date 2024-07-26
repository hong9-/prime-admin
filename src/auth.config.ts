import credentials from "next-auth/providers/credentials"
import type { NextAuthConfig } from "next-auth"
 
// Notice this is only an object, not a full Auth.js instance
export default {
  session: {
    strategy: "jwt"
  },
  secret: "AUTH_SECRET",
  trustHost: true,
  providers: [credentials],
} satisfies NextAuthConfig