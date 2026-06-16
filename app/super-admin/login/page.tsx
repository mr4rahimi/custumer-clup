import { SuperAdminLoginForm } from "@/components/super-admin-login-form";

export default function SuperAdminLoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <h1 className="mb-6 text-center text-xl font-bold">ورود مدیر سایت</h1>
        <SuperAdminLoginForm />
      </div>
    </main>
  );
}
