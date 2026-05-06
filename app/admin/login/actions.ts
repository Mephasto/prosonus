"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  verifyCredentials,
  computeSessionToken,
  SESSION_COOKIE,
} from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const user = String(formData.get("user") ?? "");
  const pass = String(formData.get("pass") ?? "");

  if (!verifyCredentials(user, pass)) {
    redirect("/admin/login?error=1");
  }

  const token = computeSessionToken();
  const jar = await cookies();

  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 horas
  });

  redirect("/admin");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
