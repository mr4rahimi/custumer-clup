"use client";

import { useState } from "react";
import { useTenantQuery, withTenantQuery } from "@/hooks/use-tenant-query";

const PHONE_REGEX = /^09\d{9}$/;
const MAX_DIGITS = 11;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

type Status = "idle" | "loading" | "success-new" | "success-existing" | "error";

export function DialPad({ tenantName }: { tenantName: string }) {
  const tenantQueryRef = useTenantQuery();
  const [digits, setDigits] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function pressDigit(d: string) {
    if (status === "loading" || digits.length >= MAX_DIGITS) return;
    setDigits((prev) => prev + d);
    setStatus("idle");
    setErrorMessage(null);
  }

  function pressBackspace() {
    if (status === "loading") return;
    setDigits((prev) => prev.slice(0, -1));
  }

  function pressClear() {
    if (status === "loading") return;
    setDigits("");
    setStatus("idle");
    setErrorMessage(null);
  }

  async function submit() {
    if (!PHONE_REGEX.test(digits)) {
      setErrorMessage("شماره موبایل باید ۱۱ رقم و با ۰۹ شروع شود");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);
    try {
      const res = await fetch(withTenantQuery("/api/customer/direct-register", tenantQueryRef.current), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: digits }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error ?? "خطا در ثبت شماره");
        setStatus("error");
        return;
      }
      setStatus(data.isNewCustomer ? "success-new" : "success-existing");
      setTimeout(() => {
        setDigits("");
        setStatus("idle");
      }, 2500);
    } catch {
      setErrorMessage("خطا در ارتباط با سرور");
      setStatus("error");
    }
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <h1 className="text-lg font-bold text-neutral-500">{tenantName}</h1>

      <div className="w-full max-w-xs rounded-2xl border border-neutral-200 p-6 shadow-sm">
        <p className="mb-4 text-center text-sm text-neutral-500">شماره را وارد کنید</p>

        <div
          dir="ltr"
          className="mb-6 flex h-14 items-center justify-center rounded-lg bg-neutral-100 text-2xl font-bold tracking-widest text-neutral-900"
        >
          {digits || <span className="text-neutral-400">۰۹xxxxxxxxx</span>}
        </div>

        {status === "success-new" && (
          <p className="mb-4 text-center text-sm text-green-600">عضو جدید با موفقیت ثبت شد ✓</p>
        )}
        {status === "success-existing" && (
          <p className="mb-4 text-center text-sm text-green-600">این شماره قبلاً عضو بوده است ✓</p>
        )}
        {status === "error" && errorMessage && <p className="mb-4 text-center text-sm text-red-600">{errorMessage}</p>}

        <div className="grid grid-cols-3 gap-3">
          {KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => pressDigit(k)}
              className="rounded-xl bg-neutral-100 py-4 text-xl font-bold text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300"
            >
              {k}
            </button>
          ))}
          <button
            type="button"
            onClick={pressClear}
            className="rounded-xl bg-neutral-100 py-4 text-sm font-bold text-neutral-500 hover:bg-neutral-200"
          >
            پاک کردن
          </button>
          <button
            type="button"
            onClick={() => pressDigit("0")}
            className="rounded-xl bg-neutral-100 py-4 text-xl font-bold text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300"
          >
            0
          </button>
          <button
            type="button"
            onClick={pressBackspace}
            className="rounded-xl bg-neutral-100 py-4 text-sm font-bold text-neutral-500 hover:bg-neutral-200"
          >
            ⌫
          </button>
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={status === "loading"}
          className="mt-4 w-full rounded-xl bg-neutral-900 py-3 text-white disabled:opacity-50"
        >
          {status === "loading" ? "در حال ثبت..." : "ثبت"}
        </button>
      </div>
    </main>
  );
}
