import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { AdminLoginForm } from "@/components/admin-login-form";

export default async function AdminLoginPage() {
  const headersList = await headers();
  const slug = headersList.get("x-tenant-slug");
  const tenant = slug ? await prisma.tenant.findUnique({ where: { slug } }) : null;

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <h1 className="mb-6 text-center text-xl font-bold">
          {tenant ? `ورود ادمین — ${tenant.name}` : "ورود به پنل کسب‌وکار"}
        </h1>
        <AdminLoginForm />
      </div>
    </main>
  );
}
