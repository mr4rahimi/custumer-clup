import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getTenantFromHeaders } from "@/lib/tenant";
import { findOrCreateCustomerAndWelcome } from "@/lib/customer";

const bodySchema = z.object({
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل نامعتبر است"),
});

export async function POST(request: NextRequest) {
  const tenant = await getTenantFromHeaders(request.headers);
  if (!tenant) {
    return NextResponse.json({ error: "کسب‌وکار یافت نشد" }, { status: 404 });
  }

  if (!tenant.isActive) {
    return NextResponse.json({ error: "این کسب‌وکار هنوز فعال نشده است" }, { status: 403 });
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

  const { customer, isNewCustomer } = await findOrCreateCustomerAndWelcome(tenant, parsed.data.phone);

  return NextResponse.json({
    success: true,
    isNewCustomer,
    customer: {
      id: customer.id,
      phone: customer.phone,
      points: customer.points,
      tier: customer.tier,
    },
  });
}
