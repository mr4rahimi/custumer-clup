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
      id: "tenant-admin",
      name: "Credentials",
      credentials: {
        username: { label: "نام کاربری", type: "text" },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const tenant = await prisma.tenant.findUnique({ where: { slug: credentials.username } });
        if (!tenant) return null;

        const admin = await prisma.adminUser.findFirst({ where: { tenantId: tenant.id } });
        if (!admin) return null;

        const valid = await bcrypt.compare(credentials.password, admin.passwordHash);
        if (!valid) return null;

        return {
          id: admin.id,
          name: admin.username,
          role: "tenant-admin",
          tenantId: tenant.id,
          tenantSlug: tenant.slug,
          tenantName: tenant.name,
        };
      },
    }),
    CredentialsProvider({
      id: "super-admin",
      name: "SuperAdminCredentials",
      credentials: {
        username: { label: "نام کاربری", type: "text" },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const validUsername = process.env.SUPER_ADMIN_USERNAME;
        const validPassword = process.env.SUPER_ADMIN_PASSWORD;
        if (!validUsername || !validPassword) return null;

        if (credentials.username !== validUsername || credentials.password !== validPassword) {
          return null;
        }

        return { id: "super-admin", name: credentials.username, role: "super-admin" };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.tenantId = user.tenantId;
        token.tenantSlug = user.tenantSlug;
        token.tenantName = user.tenantName;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role as "tenant-admin" | "super-admin";
      session.user.tenantId = token.tenantId;
      session.user.tenantSlug = token.tenantSlug;
      session.user.tenantName = token.tenantName;
      return session;
    },
  },
};
