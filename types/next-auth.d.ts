import type { DefaultSession } from "next-auth";

export type AdminRole = "tenant-admin" | "super-admin";

declare module "next-auth" {
  interface User {
    role: AdminRole;
    tenantId?: string;
    tenantSlug?: string;
    tenantName?: string;
  }

  interface Session {
    user: DefaultSession["user"] & {
      role: AdminRole;
      tenantId?: string;
      tenantSlug?: string;
      tenantName?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: AdminRole;
    tenantId?: string;
    tenantSlug?: string;
    tenantName?: string;
  }
}
