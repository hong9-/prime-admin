import authConfig from "auth.config";
import NextAuth from "next-auth"

console.log('middleware!!!', authConfig);

export const { auth: middleware } = NextAuth(authConfig);
