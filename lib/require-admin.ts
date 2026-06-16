import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export async function requireAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "tenant-admin" || !session.user.tenantId) {
    redirect("/admin/login");
  }
  return session as typeof session & {
    user: NonNullable<typeof session>["user"] & { tenantId: string; tenantSlug: string; tenantName: string };
  };
}
