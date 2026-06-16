import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AuthProvider } from "@/components/session-provider";
import { AdminNav } from "@/components/admin-nav";
import { LogoutButton } from "@/components/logout-button";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "tenant-admin" || !session.user.tenantId) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  const tenant = await prisma.tenant.findUnique({ where: { id: session.user.tenantId } });

  if (!tenant?.isActive) {
    return (
      <AuthProvider>
        <main className="flex flex-1 items-center justify-center p-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <p className="text-lg font-semibold">پنل شما در حال حاضر غیرفعال می‌باشد</p>
            <p className="text-sm text-neutral-500">
              پس از بررسی و تایید توسط مدیر سایت، دسترسی به پنل برای شما فعال خواهد شد.
            </p>
            <LogoutButton callbackUrl="/admin/login" />
          </div>
        </main>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <AdminNav tenantName={tenant.name} />
      {children}
    </AuthProvider>
  );
}
