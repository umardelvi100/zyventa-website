"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { isSafeHttpUrl } from "@/lib/safe-url";

export type SellerReviewData = {
  id: string;
  storeName: string;
  ownerName: string;
  ownerEmail: string;
  legalName: string | null;
  businessRegNumber: string | null;
  idDocumentUrl: string | null;
  regulatoryDocUrl: string | null;
  codAvailable: boolean;
  verificationStatus: string;
  verificationNotes: string | null;
  submittedAt: string | null;
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400",
};

export function SellerReviewItem({ seller }: { seller: SellerReviewData }) {
  const router = useRouter();
  const [notes, setNotes] = useState(seller.verificationNotes ?? "");
  const [busy, setBusy] = useState(false);

  async function review(status: "approved" | "rejected") {
    setBusy(true);
    const res = await fetch(`/api/admin/sellers/${seller.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, notes }),
    });
    setBusy(false);
    if (!res.ok) {
      toast.error("Could not update seller status.");
      return;
    }
    toast.success(`Seller ${status}.`);
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold">{seller.storeName}</p>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[seller.verificationStatus] ?? "bg-neutral-100 text-neutral-600"}`}>
              {seller.verificationStatus}
            </span>
          </div>
          <p className="mt-1 text-sm text-neutral-500">
            {seller.ownerName} · {seller.ownerEmail}
          </p>
        </div>
        {seller.submittedAt && (
          <span className="text-xs text-neutral-400">
            Submitted {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(seller.submittedAt))}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <p>
          <span className="text-neutral-500">Legal name: </span>
          {seller.legalName ?? "—"}
        </p>
        <p>
          <span className="text-neutral-500">Registration #: </span>
          {seller.businessRegNumber ?? "—"}
        </p>
        <p>
          <span className="text-neutral-500">COD: </span>
          {seller.codAvailable ? "Enabled" : "Disabled"}
        </p>
        {seller.idDocumentUrl && isSafeHttpUrl(seller.idDocumentUrl) && (
          <a
            href={seller.idDocumentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-indigo-700 hover:underline dark:text-indigo-400"
          >
            View ID / trade license <ExternalLink className="h-3 w-3" />
          </a>
        )}
        {seller.regulatoryDocUrl && isSafeHttpUrl(seller.regulatoryDocUrl) && (
          <a
            href={seller.regulatoryDocUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-indigo-700 hover:underline dark:text-indigo-400"
          >
            View regulatory approval doc <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        placeholder="Internal review notes (visible to seller)"
        className="mt-4 w-full rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
      />

      <div className="mt-3 flex gap-2">
        <button
          disabled={busy || seller.verificationStatus === "approved"}
          onClick={() => review("approved")}
          className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-40"
        >
          Approve
        </button>
        <button
          disabled={busy || seller.verificationStatus === "rejected"}
          onClick={() => review("rejected")}
          className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-40"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
