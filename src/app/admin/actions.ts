"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  isValidAdminCredentials,
  ADMIN_TOKEN_COOKIE,
  ADMIN_TOKEN_VALUE,
} from "@/lib/admin/auth";

// ─── Login ────────────────────────────────────────────────────────────────────

export async function adminLoginAction(
  _prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
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
    maxAge: 60 * 60 * 24, // 24 h
    path: "/admin",
  });

  redirect("/admin/dashboard");
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function adminLogoutAction(): Promise<never> {
  const jar = await cookies();
  jar.delete(ADMIN_TOKEN_COOKIE);
  redirect("/admin/login");
}

// ─── Seller actions (mock) ────────────────────────────────────────────────────
// TODO: Replace each with a real Prisma update + revalidatePath call.

export async function verifySellerAction(_id: string): Promise<void> {
  // prisma.seller.update({ where: { id }, data: { verificationStatus: "approved" } })
  redirect("/admin/sellers/verification");
}

export async function rejectSellerAction(_id: string): Promise<void> {
  // prisma.seller.update({ where: { id }, data: { verificationStatus: "rejected" } })
  redirect("/admin/sellers/verification");
}

export async function suspendSellerAction(_id: string): Promise<void> {
  // prisma.seller.update({ where: { id }, data: { verificationStatus: "suspended" } })
  redirect("/admin/sellers");
}

// ─── Product actions (mock) ───────────────────────────────────────────────────

export async function approveProductAction(_id: string): Promise<void> {
  // prisma.product.update({ where: { id }, data: { approvalStatus: "approved", isPublished: true } })
  redirect("/admin/products/approval");
}

export async function rejectProductAction(_id: string, _reason: string): Promise<void> {
  // prisma.product.update({ where: { id }, data: { approvalStatus: "rejected", rejectionReason: reason } })
  redirect("/admin/products/approval");
}
