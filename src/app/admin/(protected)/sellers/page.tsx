import Link from "next/link";
import { MOCK_SELLERS } from "@/lib/admin/mock-data";
import { VerificationBadge } from "@/components/admin/status-badge";
import type { VerificationStatus } from "@/lib/admin/types";

function aed(fils: number) {
  return fils > 0
    ? `AED ${(fils / 100).toLocaleString("en-AE", { maximumFractionDigits: 0 })}`
    : "—";
}

const FILTERS: { label: string; value: VerificationStatus | "all" }[] = [
  { label: "All Sellers", value: "all" },
  { label: "Verified", value: "verified" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
  { label: "Rejected", value: "rejected" },
];

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function SellersPage({ searchParams }: Props) {
  const params = await searchParams;
  const filter = (params.status ?? "all") as VerificationStatus | "all";

  const sellers =
    filter === "all" ? MOCK_SELLERS : MOCK_SELLERS.filter((s) => s.verificationStatus === filter);

  const counts = {
    all: MOCK_SELLERS.length,
    verified: MOCK_SELLERS.filter((s) => s.verificationStatus === "verified").length,
    pending: MOCK_SELLERS.filter((s) => s.verificationStatus === "pending").length,
    suspended: MOCK_SELLERS.filter((s) => s.verificationStatus === "suspended").length,
    rejected: MOCK_SELLERS.filter((s) => s.verificationStatus === "rejected").length,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={f.value === "all" ? "/admin/sellers" : `/admin/sellers?status=${f.value}`}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === f.value
                ? "border-indigo-600 bg-indigo-600 text-white"
                : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-400"
            }`}
          >
            {f.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                filter === f.value
                  ? "bg-white/20 text-white"
                  : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
              }`}
            >
              {counts[f.value]}
            </span>
          </Link>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Company</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Contact</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Category</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Products</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Revenue</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Rating</th>
                <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">Commission</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Status</th>
                <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
              {sellers.map((s) => (
                <tr key={s.id} className="group hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${s.logoColor}`}
                      >
                        {s.logoInitials}
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-white">{s.companyName}</p>
                        <p className="text-xs text-neutral-400">Joined {s.registrationDate}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-neutral-700 dark:text-neutral-300">{s.sellerName}</p>
                    <p className="text-xs text-neutral-400">{s.email}</p>
                    <p className="text-xs text-neutral-400">{s.phone}</p>
                  </td>
                  <td className="px-5 py-4 text-neutral-500">{s.businessCategory}</td>
                  <td className="px-5 py-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                    {s.productCount > 0 ? `${s.productCount} (${s.activeProducts} active)` : "—"}
                  </td>
                  <td className="px-5 py-4 text-right font-semibold tabular-nums text-neutral-900 dark:text-white">
                    {aed(s.totalRevenueFils)}
                  </td>
                  <td className="px-5 py-4 text-right text-neutral-600 dark:text-neutral-400">
                    {s.averageRating > 0 ? `★ ${s.averageRating}` : "—"}
                  </td>
                  <td className="px-5 py-4 text-right tabular-nums text-neutral-700 dark:text-neutral-300">
                    {aed(s.commissionFils)}
                  </td>
                  <td className="px-5 py-4">
                    <VerificationBadge status={s.verificationStatus} />
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/sellers/${s.id}`}
                      className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      View Profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sellers.length === 0 && (
          <div className="py-16 text-center text-sm text-neutral-400">No sellers found.</div>
        )}
      </div>
    </div>
  );
}
