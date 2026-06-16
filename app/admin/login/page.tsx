import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { AdminLoginForm } from "@/components/admin-login-form";

export default async function AdminLoginPage() {
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

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <h1 className="mb-6 text-center text-xl font-bold">ورود ادمین — {tenant.name}</h1>
        <AdminLoginForm tenantSlug={tenant.slug} />
      </div>
    </main>
  );
}
