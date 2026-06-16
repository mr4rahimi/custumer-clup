import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { LandingClient } from "@/components/landing-client";

export default async function Home() {
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

  return <LandingClient tenantName={tenant.name} />;
}
