import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "prosonus_admin_session";
const HMAC_SALT = "prosonus-admin-v1";

/**
 * Versión Edge-compatible (Web Crypto API) del mismo HMAC que usa lib/auth.ts.
 */
async function computeExpectedToken(): Promise<string> {
  const user = process.env.ADMIN_USER ?? "";
  const pass = process.env.ADMIN_PASS ?? "";

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(HMAC_SALT),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(`${user}:${pass}`),
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Dejar pasar la página de login sin autenticación
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const expected = await computeExpectedToken();

  if (token !== expected) {
    // Token inválido o stale: limpiar cookie y redirigir
    const res = NextResponse.redirect(new URL("/admin/login", request.url));
    res.cookies.delete(SESSION_COOKIE);
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
