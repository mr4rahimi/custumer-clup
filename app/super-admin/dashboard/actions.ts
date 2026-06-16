"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdminSession } from "@/lib/require-super-admin";
import { prisma } from "@/lib/prisma";

export async function toggleTenantActive(formData: FormData) {
  await requireSuperAdminSession();

  const tenantId = formData.get("tenantId")?.toString();
  const nextActive = formData.get("nextActive") === "true";
  if (!tenantId) return;

  await prisma.tenant.update({ where: { id: tenantId }, data: { isActive: nextActive } });
  revalidatePath("/super-admin/dashboard");
}
