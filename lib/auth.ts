import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "نام کاربری", type: "text" },
        password: { label: "رمز عبور", type: "password" },
        tenantSlug: { label: "tenantSlug", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password || !credentials?.tenantSlug) {
          return null;
        }

        const tenant = await prisma.tenant.findUnique({ where: { slug: credentials.tenantSlug } });
        if (!tenant) return null;

        const admin = await prisma.adminUser.findUnique({
          where: { username_tenantId: { username: credentials.username, tenantId: tenant.id } },
        });
        if (!admin) return null;

        const valid = await bcrypt.compare(credentials.password, admin.passwordHash);
        if (!valid) return null;

        return {
          id: admin.id,
          name: admin.username,
          tenantId: tenant.id,
          tenantSlug: tenant.slug,
          tenantName: tenant.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.tenantId = user.tenantId;
        token.tenantSlug = user.tenantSlug;
        token.tenantName = user.tenantName;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.tenantId = token.tenantId as string;
      session.user.tenantSlug = token.tenantSlug as string;
      session.user.tenantName = token.tenantName as string;
      return session;
    },
  },
};
