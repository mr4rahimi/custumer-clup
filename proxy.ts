import { NextRequest, NextResponse } from "next/server";

const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "yourdomain.ir";

function resolveTenantSlug(request: NextRequest): string | null {
  const host = request.headers.get("host")?.split(":")[0] ?? "";

  if (host && host !== ROOT_DOMAIN && host !== `www.${ROOT_DOMAIN}` && host.endsWith(`.${ROOT_DOMAIN}`)) {
    return host.slice(0, -(`.${ROOT_DOMAIN}`.length));
  }

  if (process.env.NODE_ENV !== "production") {
    return request.nextUrl.searchParams.get("tenant");
  }

  return null;
}

export function proxy(request: NextRequest) {
  const tenantSlug = resolveTenantSlug(request);

  const requestHeaders = new Headers(request.headers);
  if (tenantSlug) {
    requestHeaders.set("x-tenant-slug", tenantSlug);
  } else {
    requestHeaders.delete("x-tenant-slug");
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
