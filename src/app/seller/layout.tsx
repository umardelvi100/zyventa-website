import type { ReactNode } from "react";
import { SellerSidebar } from "@/components/seller/portal/sidebar";
import { SellerHeader } from "@/components/seller/portal/header";

export default function SellerPortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex bg-slate-50">
      {/* Sidebar */}
      <SellerSidebar />
      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <SellerHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
