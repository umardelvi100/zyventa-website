import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireAdmin();
  if (!ctx) redirect("/");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <AdminSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
