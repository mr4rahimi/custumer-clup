"use client";

import { useState } from "react";

export function CopyableLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable; user can still select and copy manually
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span
        dir="ltr"
        className="flex-1 truncate rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-900"
      >
        {url}
      </span>
      <button
        type="button"
        onClick={handleCopy}
        className="shrink-0 rounded-lg bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800"
      >
        {copied ? "کپی شد ✓" : "کپی"}
      </button>
    </div>
  );
}
