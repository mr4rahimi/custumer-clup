import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AuthProvider } from "@/components/session-provider";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <AuthProvider>
      {session?.user && <AdminNav tenantName={session.user.tenantName} />}
      {children}
    </AuthProvider>
  );
}
