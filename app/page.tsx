import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { LandingClient } from "@/components/landing-client";
import { PlatformLanding } from "@/components/platform-landing";

export default async function Home() {
  const headersList = await headers();
  const slug = headersList.get("x-tenant-slug");

  if (!slug) {
    return <PlatformLanding />;
  }

  const tenant = await prisma.tenant.findUnique({ where: { slug } });

  if (!tenant) {
    return (
      <main className="flex flex-1 items-center justify-center p-6 text-center">
        <p className="text-lg text-neutral-500">کسب‌وکاری برای این آدرس پیدا نشد.</p>
      </main>
    );
  }

  return <LandingClient tenantName={tenant.name} />;
}
