"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  isValidAdminCredentials,
  ADMIN_TOKEN_COOKIE,
  ADMIN_TOKEN_VALUE,
} from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";

// ─── Login ────────────────────────────────────────────────────────────────────

export async function adminLoginAction(
  _prevState: { error: string } | { success: true } | null,
  formData: FormData,
): Promise<{ error: string } | { success: true } | null> {
  const email = (formData.get("email") as string | null) ?? "";
  const password = (formData.get("password") as string | null) ?? "";

  if (!isValidAdminCredentials(email.trim(), password)) {
    return {
      error: "Invalid credentials. Please check your email and password.",
    };
  }

  const jar = await cookies();
  jar.set(ADMIN_TOKEN_COOKIE, ADMIN_TOKEN_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return { success: true };
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function adminLogoutAction(): Promise<never> {
  const jar = await cookies();
  jar.delete(ADMIN_TOKEN_COOKIE);
  redirect("/admin/login");
}

// ─── Seller actions ───────────────────────────────────────────────────────────

export async function verifySellerAction(id: string): Promise<void> {
  await prisma.seller.update({
    where: { id },
    data: { verificationStatus: "approved", reviewedAt: new Date() },
  });
  revalidatePath("/admin/sellers");
  revalidatePath("/admin/sellers/verification");
  redirect("/admin/sellers/verification");
}

export async function rejectSellerAction(id: string): Promise<void> {
  await prisma.seller.update({
    where: { id },
    data: { verificationStatus: "rejected", reviewedAt: new Date() },
  });
  revalidatePath("/admin/sellers");
  revalidatePath("/admin/sellers/verification");
  redirect("/admin/sellers/verification");
}

export async function suspendSellerAction(id: string): Promise<void> {
  await prisma.seller.update({
    where: { id },
    data: { verificationStatus: "suspended", reviewedAt: new Date() },
  });
  revalidatePath("/admin/sellers");
  redirect("/admin/sellers");
}

// ─── Product actions (mock) ───────────────────────────────────────────────────

export async function approveProductAction(_id: string): Promise<void> {
  redirect("/admin/products/approval");
}

export async function rejectProductAction(_id: string, _reason: string): Promise<void> {
  redirect("/admin/products/approval");
}
