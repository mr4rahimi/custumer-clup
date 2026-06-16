"use client";

import { useEffect, useRef, useState } from "react";

type Step = "phone" | "otp" | "done";
type Tier = "BRONZE" | "SILVER" | "GOLD";
type CustomerInfo = { points: number; tier: Tier };

const PHONE_REGEX = /^09\d{9}$/;
const OTP_LENGTH = 5;
const DEFAULT_OTP_SECONDS = 120;

const TIER_LABELS: Record<Tier, string> = {
  BRONZE: "برنزی",
  SILVER: "نقره‌ای",
  GOLD: "طلایی",
};

function withTenantQuery(path: string, tenantQuery: string) {
  return tenantQuery ? `${path}?tenant=${tenantQuery}` : path;
}

export function LandingClient({ tenantName }: { tenantName: string }) {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const tenantQueryRef = useRef("");

  useEffect(() => {
    tenantQueryRef.current = new URLSearchParams(window.location.search).get("tenant") ?? "";
  }, []);

  useEffect(() => {
    if (step !== "otp" || secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [step, secondsLeft]);

  async function sendOtp() {
    setError(null);
    if (!PHONE_REGEX.test(phone)) {
      setError("شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(withTenantQuery("/api/customer/otp/send", tenantQueryRef.current), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "خطا در ارسال کد");
        return;
      }
      setSecondsLeft(data.expiresIn ?? DEFAULT_OTP_SECONDS);
      setStep("otp");
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    setError(null);
    if (code.length !== OTP_LENGTH) {
      setError("کد تایید باید ۵ رقم باشد");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(withTenantQuery("/api/customer/otp/verify", tenantQueryRef.current), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "کد نامعتبر است");
        return;
      }
      setCustomer({ points: data.customer.points, tier: data.customer.tier });
      setStep("done");
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <h1 className="mb-6 text-center text-xl font-bold">{tenantName}</h1>

        {step === "phone" && (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              sendOtp();
            }}
          >
            <label className="flex flex-col gap-1 text-sm">
              شماره موبایل
              <input
                type="tel"
                inputMode="numeric"
                dir="ltr"
                maxLength={11}
                placeholder="09xxxxxxxxx"
                className="rounded-lg border border-neutral-300 px-3 py-2 text-center"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
            </label>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-neutral-900 py-2 text-white disabled:opacity-50"
            >
              {loading ? "در حال ارسال..." : "ارسال کد"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              verifyOtp();
            }}
          >
            <p className="text-center text-sm text-neutral-500">کد تایید به شماره {phone} ارسال شد</p>
            <input
              type="text"
              inputMode="numeric"
              dir="ltr"
              maxLength={OTP_LENGTH}
              placeholder="-----"
              className="rounded-lg border border-neutral-300 px-3 py-2 text-center tracking-widest"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-neutral-900 py-2 text-white disabled:opacity-50"
            >
              {loading ? "در حال بررسی..." : "تایید"}
            </button>
            <div className="text-center text-sm text-neutral-500">
              {secondsLeft > 0 ? (
                <span>
                  {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")} مانده تا امکان ارسال
                  دوباره
                </span>
              ) : (
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={loading}
                  className="text-blue-600 underline disabled:opacity-50"
                >
                  ارسال دوباره کد
                </button>
              )}
            </div>
          </form>
        )}

        {step === "done" && customer && (
          <div className="flex flex-col items-center gap-3 text-center">
            <p className="text-lg">به باشگاه مشتریان {tenantName} خوش آمدید!</p>
            <div className="rounded-xl bg-neutral-100 px-6 py-4">
              <p className="text-sm text-neutral-500">امتیاز شما</p>
              <p className="text-2xl font-bold">{customer.points}</p>
            </div>
            <p className="text-sm text-neutral-500">
              سطح عضویت: <span className="font-semibold">{TIER_LABELS[customer.tier]}</span>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
