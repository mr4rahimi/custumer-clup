import { requireAdminSession } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { AdminSettingsForm } from "@/components/admin-settings-form";

export default async function AdminSettingsPage() {
  const session = await requireAdminSession();
  const tenant = await prisma.tenant.findUniqueOrThrow({ where: { id: session.user.tenantId } });

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-xl font-bold">تنظیمات</h1>
      <AdminSettingsForm
        initialSmsApiKey={tenant.smsApiKey ?? ""}
        initialWelcomeMessage={tenant.welcomeMessage ?? ""}
      />
    </main>
  );
}
