"use client";

import { useActionState } from "react";
import { updateSettings, type UpdateSettingsResult } from "@/app/admin/settings/actions";

const initialState: UpdateSettingsResult = { success: false };

export function AdminSettingsForm({
  initialSmsApiKey,
  initialWelcomeMessage,
}: {
  initialSmsApiKey: string;
  initialWelcomeMessage: string;
}) {
  const [state, formAction, pending] = useActionState(updateSettings, initialState);

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm">
        API Key ملی پیامک
        <input
          type="text"
          name="smsApiKey"
          dir="ltr"
          defaultValue={initialSmsApiKey}
          className="rounded-lg border border-neutral-300 px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        متن پیامک خوش‌آمدگویی
        <textarea
          name="welcomeMessage"
          defaultValue={initialWelcomeMessage}
          rows={3}
          className="rounded-lg border border-neutral-300 px-3 py-2"
        />
      </label>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.success && <p className="text-sm text-green-600">ذخیره شد.</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-neutral-900 py-2 text-white disabled:opacity-50"
      >
        {pending ? "در حال ذخیره..." : "ذخیره"}
      </button>
    </form>
  );
}
