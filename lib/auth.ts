import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@travel.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        // Hardcoded admin fallback since we don't have a database
        if (
          credentials.email === "admin@travel.com" &&
          credentials.password === (process.env.ADMIN_PASSWORD || "adminpassword")
        ) {
          return {
            id: "hardcoded-admin-id",
            name: "Aesthete Editorial",
            email: "admin@travel.com",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
            role: "ADMIN",
          } as any;
        }

        throw new Error("Incorrect email or password");
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin-access",
  },
  secret: process.env.NEXTAUTH_SECRET || "default_auth_secret_key_12345",
};
