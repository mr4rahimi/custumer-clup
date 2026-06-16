import { requireAdminSession } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";

const TIER_LABELS: Record<string, string> = {
  BRONZE: "برنزی",
  SILVER: "نقره‌ای",
  GOLD: "طلایی",
};

export default async function AdminDashboardPage() {
  const session = await requireAdminSession();
  const tenantId = session.user.tenantId;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [totalCustomers, newToday, latestCustomers] = await Promise.all([
    prisma.customer.count({ where: { tenantId } }),
    prisma.customer.count({ where: { tenantId, createdAt: { gte: startOfToday } } }),
    prisma.customer.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-xl font-bold">داشبورد</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-neutral-200 p-4">
          <p className="text-sm text-neutral-500">تعداد کل اعضا</p>
          <p className="text-2xl font-bold">{totalCustomers}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 p-4">
          <p className="text-sm text-neutral-500">اعضای جدید امروز</p>
          <p className="text-2xl font-bold">{newToday}</p>
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-semibold">آخرین ثبت‌نام‌ها</h2>
        {latestCustomers.length === 0 ? (
          <p className="text-sm text-neutral-500">هنوز عضوی ثبت‌نام نکرده است.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-neutral-200 rounded-xl border border-neutral-200">
            {latestCustomers.map((customer) => (
              <li key={customer.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span dir="ltr">{customer.phone}</span>
                <span className="text-neutral-500">{TIER_LABELS[customer.tier]}</span>
                <span className="text-neutral-500">{customer.createdAt.toLocaleDateString("fa-IR")}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
