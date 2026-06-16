import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export async function requireSuperAdminSession() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "super-admin") {
    redirect("/super-admin/login");
  }
  return session;
}
