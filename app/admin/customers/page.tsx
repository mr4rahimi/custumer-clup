import { requireAdminSession } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";

const TIER_LABELS: Record<string, string> = {
  BRONZE: "برنزی",
  SILVER: "نقره‌ای",
  GOLD: "طلایی",
};

export default async function AdminCustomersPage() {
  const session = await requireAdminSession();
  const tenantId = session.user.tenantId;

  const customers = await prisma.customer.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-xl font-bold">مشتریان</h1>

      {customers.length === 0 ? (
        <p className="text-sm text-neutral-500">هنوز عضوی ثبت‌نام نکرده است.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-right text-neutral-900">
              <tr>
                <th className="px-4 py-3 font-semibold">شماره موبایل</th>
                <th className="px-4 py-3 font-semibold">امتیاز</th>
                <th className="px-4 py-3 font-semibold">سطح</th>
                <th className="px-4 py-3 font-semibold">تاریخ عضویت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="px-4 py-3" dir="ltr">
                    {customer.phone}
                  </td>
                  <td className="px-4 py-3">{customer.points}</td>
                  <td className="px-4 py-3">{TIER_LABELS[customer.tier]}</td>
                  <td className="px-4 py-3">{customer.createdAt.toLocaleDateString("fa-IR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
