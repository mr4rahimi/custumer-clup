import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { DialPad } from "@/components/dial-pad";

export default async function DialPage() {
  const headersList = await headers();
  const slug = headersList.get("x-tenant-slug");
  const tenant = slug ? await prisma.tenant.findUnique({ where: { slug } }) : null;

  if (!tenant) {
    return (
      <main className="flex flex-1 items-center justify-center p-6 text-center">
        <p className="text-lg text-neutral-500">کسب‌وکاری برای این آدرس پیدا نشد.</p>
      </main>
    );
  }

  if (!tenant.isActive) {
    return (
      <main className="flex flex-1 items-center justify-center p-6 text-center">
        <p className="text-lg text-neutral-500">این کسب‌وکار هنوز فعال نشده است.</p>
      </main>
    );
  }

  return <DialPad tenantName={tenant.name} />;
}
