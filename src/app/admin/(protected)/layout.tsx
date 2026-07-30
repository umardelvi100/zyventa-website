import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_TOKEN_COOKIE, isValidAdminToken } from "@/lib/admin/auth";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jar = await cookies();
  const token = jar.get(ADMIN_TOKEN_COOKIE)?.value;

  if (!isValidAdminToken(token)) {
    redirect("/admin/login");
  }

  return (
    <div className="flex h-full overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto bg-neutral-50 px-6 py-6 dark:bg-neutral-950">
          {children}
        </main>
      </div>
    </div>
  );
}
