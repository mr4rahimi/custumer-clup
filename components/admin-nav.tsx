import Link from "next/link";
import { LogoutButton } from "@/components/logout-button";

export function AdminNav({ tenantName }: { tenantName: string }) {
  return (
    <nav className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
      <div className="flex items-center gap-6">
        <span className="font-bold">{tenantName}</span>
        <Link href="/admin/dashboard" className="text-sm text-neutral-600 hover:text-neutral-900">
          داشبورد
        </Link>
        <Link href="/admin/customers" className="text-sm text-neutral-600 hover:text-neutral-900">
          مشتریان
        </Link>
        <Link href="/admin/settings" className="text-sm text-neutral-600 hover:text-neutral-900">
          تنظیمات
        </Link>
      </div>
      <LogoutButton callbackUrl="/admin/login" />
    </nav>
  );
}
