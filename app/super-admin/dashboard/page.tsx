import { requireSuperAdminSession } from "@/lib/require-super-admin";
import { prisma } from "@/lib/prisma";
import { toggleTenantActive } from "./actions";

export default async function SuperAdminDashboardPage() {
  await requireSuperAdminSession();

  const tenants = await prisma.tenant.findMany({
    include: { adminUsers: { take: 1, orderBy: { createdAt: "asc" } }, _count: { select: { customers: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex flex-1 flex-col gap-6 p-6">
      <h1 className="text-xl font-bold">کسب‌وکارها</h1>

      {tenants.length === 0 ? (
        <p className="text-sm text-neutral-500">هنوز کسب‌وکاری ثبت‌نام نکرده است.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-right">
              <tr>
                <th className="px-4 py-3 font-semibold">نام کسب‌وکار</th>
                <th className="px-4 py-3 font-semibold">لینک</th>
                <th className="px-4 py-3 font-semibold">صاحب کسب‌وکار</th>
                <th className="px-4 py-3 font-semibold">شماره تماس</th>
                <th className="px-4 py-3 font-semibold">تعداد مشتریان</th>
                <th className="px-4 py-3 font-semibold">وضعیت</th>
                <th className="px-4 py-3 font-semibold">تاریخ ثبت‌نام</th>
                <th className="px-4 py-3 font-semibold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {tenants.map((tenant) => {
                const owner = tenant.adminUsers[0];
                const ownerName = owner ? `${owner.firstName ?? ""} ${owner.lastName ?? ""}`.trim() : "";
                return (
                  <tr key={tenant.id}>
                    <td className="px-4 py-3">{tenant.name}</td>
                    <td className="px-4 py-3" dir="ltr">
                      {tenant.slug}
                    </td>
                    <td className="px-4 py-3">{ownerName || "—"}</td>
                    <td className="px-4 py-3" dir="ltr">
                      {tenant.phone ?? "—"}
                    </td>
                    <td className="px-4 py-3">{tenant._count.customers}</td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          tenant.isActive
                            ? "rounded-full bg-green-100 px-3 py-1 text-xs text-green-700"
                            : "rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600"
                        }
                      >
                        {tenant.isActive ? "فعال" : "غیرفعال"}
                      </span>
                    </td>
                    <td className="px-4 py-3">{tenant.createdAt.toLocaleDateString("fa-IR")}</td>
                    <td className="px-4 py-3">
                      <form action={toggleTenantActive}>
                        <input type="hidden" name="tenantId" value={tenant.id} />
                        <input type="hidden" name="nextActive" value={(!tenant.isActive).toString()} />
                        <button
                          type="submit"
                          className={
                            tenant.isActive
                              ? "rounded-lg border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
                              : "rounded-lg bg-neutral-900 px-3 py-1 text-xs text-white hover:bg-neutral-800"
                          }
                        >
                          {tenant.isActive ? "غیرفعال کردن" : "فعال کردن"}
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
