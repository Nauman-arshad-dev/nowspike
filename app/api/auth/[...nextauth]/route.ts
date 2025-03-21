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
          username: "admin",
          password: "Mirza_483", // Change this to a strong, unique password!
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
    strategy: "jwt" as const, // Type assertion to ensure literal "jwt"
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };