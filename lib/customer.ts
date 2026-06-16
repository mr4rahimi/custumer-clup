import type { Tenant } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { sendSms } from "@/lib/sms";

export async function findOrCreateCustomerAndWelcome(tenant: Tenant, phone: string) {
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

  return { customer, isNewCustomer };
}
