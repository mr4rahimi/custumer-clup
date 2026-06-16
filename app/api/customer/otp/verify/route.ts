import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getTenantFromHeaders } from "@/lib/tenant";
import { redis } from "@/lib/redis";
import { otpRedisKey } from "@/lib/otp";
import { sendSms } from "@/lib/sms";
import { prisma } from "@/lib/prisma";
import { signCustomerToken } from "@/lib/customer-token";

const bodySchema = z.object({
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل نامعتبر است"),
  code: z.string().length(5, "کد تایید باید ۵ رقم باشد"),
});

export async function POST(request: NextRequest) {
  const tenant = await getTenantFromHeaders(request.headers);
  if (!tenant) {
    return NextResponse.json({ error: "کسب‌وکار یافت نشد" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "بدنه درخواست نامعتبر است" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }

  const { phone, code } = parsed.data;
  const key = otpRedisKey(tenant.id, phone);
  const storedCode = await redis.get(key);

  if (!storedCode || storedCode !== code) {
    return NextResponse.json({ error: "کد تایید نامعتبر یا منقضی شده است" }, { status: 400 });
  }

  await redis.del(key);

  let customer = await prisma.customer.findUnique({
    where: { phone_tenantId: { phone, tenantId: tenant.id } },
  });

  const isNewCustomer = !customer;
  if (!customer) {
    customer = await prisma.customer.create({
      data: { phone, tenantId: tenant.id },
    });
  }

  if (isNewCustomer) {
    const welcomeText = tenant.welcomeMessage || `به باشگاه مشتریان ${tenant.name} خوش آمدید!`;
    await sendSms(tenant, phone, welcomeText);
  }

  const token = await signCustomerToken({ customerId: customer.id, tenantId: tenant.id });

  return NextResponse.json({
    token,
    customer: {
      id: customer.id,
      phone: customer.phone,
      points: customer.points,
      tier: customer.tier,
    },
  });
}
