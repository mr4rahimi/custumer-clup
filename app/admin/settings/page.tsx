import { headers } from "next/headers";
import { requireAdminSession } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { AdminSettingsForm } from "@/components/admin-settings-form";
import { CopyableLink } from "@/components/copyable-link";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "yourdomain.ir";

export default async function AdminSettingsPage() {
  const session = await requireAdminSession();
  const tenant = await prisma.tenant.findUniqueOrThrow({ where: { id: session.user.tenantId } });

  const headersList = await headers();
  const host = headersList.get("host") ?? "";
  const isDev = process.env.NODE_ENV !== "production";
  const protocol = host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https";

  const dialUrl = isDev
    ? `${protocol}://${host}/dial?tenant=${tenant.slug}`
    : `https://${tenant.slug}.${ROOT_DOMAIN}/dial`;

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-xl font-bold">تنظیمات</h1>

      <div className="flex max-w-md flex-col gap-2">
        <h2 className="font-semibold">لینک صفحه ورود شماره (کیوسک)</h2>
        <p className="text-sm text-neutral-500">
          این لینک عمومی است؛ آن را روی تبلت یا دستگاه فروشگاه باز بگذارید تا با چند ضربه شماره مشتری ثبت شود.
        </p>
        <CopyableLink url={dialUrl} />
      </div>

      <AdminSettingsForm
        initialSmsApiKey={tenant.smsApiKey ?? ""}
        initialWelcomeMessage={tenant.welcomeMessage ?? ""}
      />
    </main>
  );
}
