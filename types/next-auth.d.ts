import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    tenantId: string;
    tenantSlug: string;
    tenantName: string;
  }

  interface Session {
    user: DefaultSession["user"] & {
      tenantId: string;
      tenantSlug: string;
      tenantName: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    tenantId?: string;
    tenantSlug?: string;
    tenantName?: string;
  }
}
