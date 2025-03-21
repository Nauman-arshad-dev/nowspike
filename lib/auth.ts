// E:\nauman\NowSpike\frontend\lib\auth.ts
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminUser = {
          username: process.env.ADMIN_USERNAME!,
          password: process.env.ADMIN_PASSWORD!,
        };

        if (
          credentials?.username === adminUser.username &&
          credentials?.password === adminUser.password
        ) {
          return { id: "1", name: "Admin" };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt" as const,
  },
};

export default NextAuth(authOptions);