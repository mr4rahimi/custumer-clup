import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const RESERVED_SLUGS = ["admin", "api", "super-admin", "www"];

const bodySchema = z.object({
  firstName: z.string().trim().min(1, "نام را وارد کنید"),
  lastName: z.string().trim().min(1, "نام خانوادگی را وارد کنید"),
  phone: z.string().regex(/^09\d{9}$/, "شماره موبایل نامعتبر است"),
  businessName: z.string().trim().min(1, "نام کسب‌وکار را وارد کنید"),
  businessSlug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "لینک کسب‌وکار فقط می‌تواند شامل حروف انگلیسی، عدد و خط تیره باشد")
    .min(3, "لینک کسب‌وکار باید حداقل ۳ کاراکتر باشد")
    .max(30, "لینک کسب‌وکار باید حداکثر ۳۰ کاراکتر باشد"),
});

export async function POST(request: NextRequest) {
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

  const { firstName, lastName, phone, businessName, businessSlug } = parsed.data;

  if (RESERVED_SLUGS.includes(businessSlug)) {
    return NextResponse.json({ error: "این لینک کسب‌وکار قابل استفاده نیست" }, { status: 400 });
  }

  const existing = await prisma.tenant.findUnique({ where: { slug: businessSlug } });
  if (existing) {
    return NextResponse.json({ error: "این لینک کسب‌وکار قبلاً استفاده شده است" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(phone, 10);

  try {
    const tenant = await prisma.tenant.create({
      data: {
        name: businessName,
        slug: businessSlug,
        phone,
        isActive: false,
        adminUsers: {
          create: { username: phone, passwordHash, firstName, lastName },
        },
      },
    });

    return NextResponse.json({ success: true, tenantSlug: tenant.slug });
  } catch {
    return NextResponse.json({ error: "این لینک کسب‌وکار قبلاً استفاده شده است" }, { status: 409 });
  }
}
