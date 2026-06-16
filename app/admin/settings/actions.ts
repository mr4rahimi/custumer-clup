"use server";

import { z } from "zod";
import { requireAdminSession } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  smsApiKey: z.string().trim().optional(),
  welcomeMessage: z.string().trim().optional(),
});

export type UpdateSettingsResult = { success: boolean; error?: string };

export async function updateSettings(
  _prevState: UpdateSettingsResult,
  formData: FormData
): Promise<UpdateSettingsResult> {
  const session = await requireAdminSession();

  const parsed = schema.safeParse({
    smsApiKey: formData.get("smsApiKey")?.toString(),
    welcomeMessage: formData.get("welcomeMessage")?.toString(),
  });

  if (!parsed.success) {
    return { success: false, error: "ورودی نامعتبر است" };
  }

  await prisma.tenant.update({
    where: { id: session.user.tenantId },
    data: {
      smsApiKey: parsed.data.smsApiKey || null,
      welcomeMessage: parsed.data.welcomeMessage || null,
    },
  });

  return { success: true };
}
