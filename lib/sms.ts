import type { Tenant } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function sendSms(tenant: Tenant, to: string, text: string) {
  const apiKey = tenant.smsApiKey || process.env.MELI_PAYAMAK_API_KEY;

  if (!apiKey) {
    await prisma.smsLog.create({
      data: { tenantId: tenant.id, phone: to, message: text, status: "NO_API_KEY" },
    });
    return { success: false };
  }

  let success = false;
  try {
    const res = await fetch(`https://api.melipayamak.com/api/send/simple/${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from: tenant.smsSender ?? "", to, text }),
    });
    const data = await res.json().catch(() => null);
    success = res.ok && !data?.status;
  } catch {
    success = false;
  }

  await prisma.smsLog.create({
    data: { tenantId: tenant.id, phone: to, message: text, status: success ? "SENT" : "FAILED" },
  });

  return { success };
}
