import { prisma } from "@/lib/prisma";

export async function getTenantFromHeaders(headers: Headers) {
  const slug = headers.get("x-tenant-slug");
  if (!slug) return null;
  return prisma.tenant.findUnique({ where: { slug } });
}
