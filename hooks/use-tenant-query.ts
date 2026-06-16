"use client";

import { useEffect, useRef } from "react";

export function useTenantQuery() {
  const tenantQueryRef = useRef("");

  useEffect(() => {
    tenantQueryRef.current = new URLSearchParams(window.location.search).get("tenant") ?? "";
  }, []);

  return tenantQueryRef;
}

export function withTenantQuery(path: string, tenantQuery: string): string {
  return tenantQuery ? `${path}?tenant=${tenantQuery}` : path;
}
