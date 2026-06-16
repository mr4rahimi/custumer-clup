"use client";

import { signOut } from "next-auth/react";

export function LogoutButton({ callbackUrl, label = "خروج" }: { callbackUrl: string; label?: string }) {
  return (
    <button onClick={() => signOut({ callbackUrl })} className="text-sm text-red-600 hover:underline">
      {label}
    </button>
  );
}
