import { LogoutButton } from "@/components/logout-button";

export function SuperAdminNav() {
  return (
    <nav className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
      <span className="font-bold">پنل مدیریت کل</span>
      <LogoutButton callbackUrl="/super-admin/login" />
    </nav>
  );
}
