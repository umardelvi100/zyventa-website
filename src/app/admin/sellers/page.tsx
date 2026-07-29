import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { SellerReviewItem } from "@/components/admin/seller-review-item";

export default async function AdminSellersPage() {
  const ctx = await requireAdmin();
  if (!ctx) redirect("/");

  const sellers = await prisma.seller.findMany({
    include: { user: true },
    orderBy: [{ verificationStatus: "asc" }, { submittedAt: "desc" }],
  });

  const pending = sellers.filter((s) => s.verificationStatus === "pending");
  const reviewed = sellers.filter((s) => s.verificationStatus !== "pending");

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-orange-500 text-white">
          <ShieldCheck className="h-6 w-6" />
        </span>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Seller verification queue</h1>
          <p className="text-sm text-neutral-500">{pending.length} pending review</p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold">Pending ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="text-neutral-500">Nothing waiting on review.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {pending.map((seller) => (
              <SellerReviewItem
                key={seller.id}
                seller={{
                  id: seller.id,
                  storeName: seller.storeName,
                  ownerName: seller.user.name,
                  ownerEmail: seller.user.email,
                  legalName: seller.legalName,
                  businessRegNumber: seller.businessRegNumber,
                  idDocumentUrl: seller.idDocumentUrl,
                  regulatoryDocUrl: seller.regulatoryDocUrl,
                  codAvailable: seller.codAvailable,
                  verificationStatus: seller.verificationStatus,
                  verificationNotes: seller.verificationNotes,
                  submittedAt: seller.submittedAt ? seller.submittedAt.toISOString() : null,
                }}
              />
            ))}
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-bold">Reviewed ({reviewed.length})</h2>
        {reviewed.length === 0 ? (
          <p className="text-neutral-500">No sellers reviewed yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {reviewed.map((seller) => (
              <SellerReviewItem
                key={seller.id}
                seller={{
                  id: seller.id,
                  storeName: seller.storeName,
                  ownerName: seller.user.name,
                  ownerEmail: seller.user.email,
                  legalName: seller.legalName,
                  businessRegNumber: seller.businessRegNumber,
                  idDocumentUrl: seller.idDocumentUrl,
                  regulatoryDocUrl: seller.regulatoryDocUrl,
                  codAvailable: seller.codAvailable,
                  verificationStatus: seller.verificationStatus,
                  verificationNotes: seller.verificationNotes,
                  submittedAt: seller.submittedAt ? seller.submittedAt.toISOString() : null,
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
