import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { clearAttempts, isRateLimited, recordAttempt } from "@/lib/rate-limit";

const LOGIN_ATTEMPT_LIMIT = 5;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const rateLimitKey = `login:${email.toLowerCase()}`;
        if (isRateLimited(rateLimitKey, LOGIN_ATTEMPT_LIMIT)) {
          // Same generic outcome as bad credentials — doesn't reveal that the
          // account is being throttled.
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          recordAttempt(rateLimitKey, LOGIN_WINDOW_MS);
          return null;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) {
          recordAttempt(rateLimitKey, LOGIN_WINDOW_MS);
          return null;
        }

        clearAttempts(rateLimitKey);
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) token.id = user.id as string;
      if (user || trigger === "update") {
        const [seller, dbUser] = await Promise.all([
          prisma.seller.findUnique({ where: { userId: token.id as string } }),
          prisma.user.findUnique({ where: { id: token.id as string } }),
        ]);
        token.sellerId = seller?.id ?? null;
        token.sellerVerificationStatus = seller?.verificationStatus ?? null;
        token.isAdmin = dbUser?.isAdmin ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.sellerId = (token.sellerId as string | null) ?? null;
        session.user.sellerVerificationStatus = (token.sellerVerificationStatus as string | null) ?? null;
        session.user.isAdmin = Boolean(token.isAdmin);
      }
      return session;
    },
  },
});
