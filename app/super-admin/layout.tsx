import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuthProvider } from "@/components/session-provider";
import { SuperAdminNav } from "@/components/super-admin-nav";

export default async function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <AuthProvider>
      {session?.user?.role === "super-admin" && <SuperAdminNav />}
      {children}
    </AuthProvider>
  );
}
