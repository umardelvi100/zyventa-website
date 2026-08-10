import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SellerSidebar } from "@/components/seller/portal/sidebar";
import { SellerHeader } from "@/components/seller/portal/header";

export default async function SellerPortalLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const seller = await prisma.seller.findUnique({ where: { userId: session.user.id } });
  if (!seller) redirect("/sell");

  const initials = seller.storeName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "S";

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-50">
      <SellerSidebar
        storeName={seller.storeName}
        initials={initials}
        isVerified={seller.verificationStatus === "approved"}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <SellerHeader />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
