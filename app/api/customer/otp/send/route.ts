import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getTenantFromHeaders } from "@/lib/tenant";
import { redis } from "@/lib/redis";
import { generateOtpCode, otpRedisKey, OTP_TTL_SECONDS } from "@/lib/otp";
import { sendSms } from "@/lib/sms";

const bodySchema = z.object({
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل نامعتبر است"),
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

  const { phone } = parsed.data;
  const code = generateOtpCode();

  await redis.set(otpRedisKey(tenant.id, phone), code, "EX", OTP_TTL_SECONDS);
  await sendSms(tenant, phone, `کد تایید شما: ${code}`);

  return NextResponse.json({ success: true, expiresIn: OTP_TTL_SECONDS });
}
