"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Step1 = { firstName: string; lastName: string; phone: string };
type Step2 = { businessName: string; businessSlug: string; password: string; confirmPassword: string };

const PHONE_REGEX = /^09\d{9}$/;
const SLUG_REGEX = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MIN_PASSWORD_LENGTH = 6;
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "yourdomain.ir";

export function BusinessSignupForm() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [step1, setStep1] = useState<Step1>({ firstName: "", lastName: "", phone: "" });
  const [step2, setStep2] = useState<Step2>({
    businessName: "",
    businessSlug: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleStep1Submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!step1.firstName.trim() || !step1.lastName.trim()) {
      setError("نام و نام خانوادگی را وارد کنید");
      return;
    }
    if (!PHONE_REGEX.test(step1.phone)) {
      setError("شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود");
      return;
    }
    setStep(2);
  }

  async function handleStep2Submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!step2.businessName.trim()) {
      setError("نام کسب‌وکار را وارد کنید");
      return;
    }
    if (!SLUG_REGEX.test(step2.businessSlug)) {
      setError("لینک کسب‌وکار فقط می‌تواند شامل حروف انگلیسی کوچک، عدد و خط تیره باشد");
      return;
    }
    if (step2.password.length < MIN_PASSWORD_LENGTH) {
      setError(`رمز عبور باید حداقل ${MIN_PASSWORD_LENGTH} کاراکتر باشد`);
      return;
    }
    if (step2.password !== step2.confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/business/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: step1.firstName,
          lastName: step1.lastName,
          phone: step1.phone,
          businessName: step2.businessName,
          businessSlug: step2.businessSlug,
          password: step2.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "خطا در ثبت‌نام");
        return;
      }

      const result = await signIn("tenant-admin", {
        username: step2.businessSlug,
        password: step2.password,
        redirect: false,
      });
      if (result?.error) {
        setError("ثبت‌نام انجام شد اما ورود خودکار ناموفق بود. لطفاً از صفحه ورود وارد شوید.");
        return;
      }

      router.push("/admin/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-neutral-200 p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-center gap-2 text-sm text-neutral-500">
        <span className={step === 1 ? "font-bold text-neutral-900" : ""}>۱. اطلاعات شما</span>
        <span>—</span>
        <span className={step === 2 ? "font-bold text-neutral-900" : ""}>۲. اطلاعات کسب‌وکار</span>
      </div>

      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            نام
            <input
              type="text"
              className="rounded-lg border border-neutral-300 px-3 py-2"
              value={step1.firstName}
              onChange={(e) => setStep1((s) => ({ ...s, firstName: e.target.value }))}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            نام خانوادگی
            <input
              type="text"
              className="rounded-lg border border-neutral-300 px-3 py-2"
              value={step1.lastName}
              onChange={(e) => setStep1((s) => ({ ...s, lastName: e.target.value }))}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            شماره موبایل
            <input
              type="tel"
              inputMode="numeric"
              dir="ltr"
              maxLength={11}
              placeholder="09xxxxxxxxx"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-center"
              value={step1.phone}
              onChange={(e) => setStep1((s) => ({ ...s, phone: e.target.value.replace(/\D/g, "") }))}
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="rounded-lg bg-neutral-900 py-2 text-white">
            مرحله بعد
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleStep2Submit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            نام کسب‌وکار
            <input
              type="text"
              className="rounded-lg border border-neutral-300 px-3 py-2"
              value={step2.businessName}
              onChange={(e) => setStep2((s) => ({ ...s, businessName: e.target.value }))}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            لینک کسب‌وکار (همان نام کاربری ورود به پنل خواهد بود)
            <input
              type="text"
              dir="ltr"
              className="rounded-lg border border-neutral-300 px-3 py-2"
              value={step2.businessSlug}
              onChange={(e) =>
                setStep2((s) => ({ ...s, businessSlug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") }))
              }
            />
            {step2.businessSlug && (
              <span className="text-xs text-neutral-500" dir="ltr">
                {step2.businessSlug}.{ROOT_DOMAIN}
              </span>
            )}
          </label>
          <label className="flex flex-col gap-1 text-sm">
            رمز عبور
            <input
              type="password"
              className="rounded-lg border border-neutral-300 px-3 py-2"
              value={step2.password}
              onChange={(e) => setStep2((s) => ({ ...s, password: e.target.value }))}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            تکرار رمز عبور
            <input
              type="password"
              className="rounded-lg border border-neutral-300 px-3 py-2"
              value={step2.confirmPassword}
              onChange={(e) => setStep2((s) => ({ ...s, confirmPassword: e.target.value }))}
            />
          </label>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-lg border border-neutral-300 py-2"
            >
              قبلی
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-neutral-900 py-2 text-white disabled:opacity-50"
            >
              {loading ? "در حال ثبت‌نام..." : "ثبت‌نام و ورود به پنل"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
