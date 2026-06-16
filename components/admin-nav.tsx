"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

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
      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="text-sm text-red-600 hover:underline"
      >
        خروج
      </button>
    </nav>
  );
}
