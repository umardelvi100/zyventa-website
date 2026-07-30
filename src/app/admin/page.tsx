import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_TOKEN_COOKIE, isValidAdminToken } from "@/lib/admin/auth";

export default async function AdminRootPage() {
  const jar = await cookies();
  const token = jar.get(ADMIN_TOKEN_COOKIE)?.value;

  if (isValidAdminToken(token)) {
    redirect("/admin/dashboard");
  }
  redirect("/admin/login");
}
