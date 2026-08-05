import { prisma } from "@/lib/prisma";
import { verifySellerAction, rejectSellerAction } from "@/app/admin/actions";
import { VerificationBadge } from "@/components/admin/status-badge";
import type { VerificationStatus } from "@/lib/admin/types";
import Link from "next/link";

const LOGO_COLORS = [
  "bg-indigo-600", "bg-emerald-600", "bg-rose-500", "bg-teal-600",
  "bg-violet-500", "bg-orange-500", "bg-pink-500", "bg-sky-600",
];

function getLogoColor(id: string) {
  const idx = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % LOGO_COLORS.length;
  return LOGO_COLORS[idx];
}

function getInitials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "??";
}

function mapStatus(s: string): VerificationStatus {
  if (s === "approved") return "verified";
  if (s === "pending" || s === "rejected" || s === "suspended") return s as VerificationStatus;
  return "pending";
}

function daysSince(date: Date) {
  return Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
}

export default async function SellerVerificationPage() {
  const dbSellers = await prisma.seller.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { submittedAt: "asc" },
  });

  const mapped = dbSellers.map((s) => ({
    id: s.id,
    companyName: s.storeName,
    sellerName: s.user.name,
    email: s.user.email,
    logoInitials: getInitials(s.storeName),
    logoColor: getLogoColor(s.id),
    submittedAt: s.submittedAt ?? s.createdAt,
    verificationStatus: mapStatus(s.verificationStatus),
    legalName: s.legalName ?? "—",
    businessRegNumber: s.businessRegNumber ?? "—",
  }));

  const pending = mapped.filter((s) => s.verificationStatus === "pending");
  const recent = mapped
    .filter((s) => s.verificationStatus === "verified" || s.verificationStatus === "rejected")
    .slice(0, 4);

  const counts = {
    pending: pending.length,
    verified: mapped.filter((s) => s.verificationStatus === "verified").length,
    rejected: mapped.filter((s) => s.verificationStatus === "rejected").length,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Awaiting Review", value: counts.pending, cls: "text-amber-600 dark:text-amber-400" },
          { label: "Verified (total)", value: counts.verified, cls: "text-emerald-600 dark:text-emerald-400" },
          { label: "Rejected (total)", value: counts.rejected, cls: "text-red-600 dark:text-red-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
            <p className={`text-xs font-medium ${stat.cls}`}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Pending queue */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <p className="text-sm font-semibold text-neutral-800 dark:text-white">
            Pending Verification Requests
          </p>
          <p className="text-xs text-neutral-400">
            Review each seller before granting marketplace access.
          </p>
        </div>

        {pending.length === 0 ? (
          <div className="py-16 text-center text-sm text-neutral-400">No pending requests.</div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {pending.map((s) => {
              const days = daysSince(s.submittedAt);
              return (
                <div key={s.id} className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center">
                  {/* Seller info */}
                  <div className="flex flex-1 items-start gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${s.logoColor}`}
                    >
                      {s.logoInitials}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-neutral-900 dark:text-white">{s.companyName}</p>
                        <VerificationBadge status={s.verificationStatus} />
                        {days > 7 && (
                          <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 dark:bg-red-950/30 dark:text-red-400">
                            {days}d waiting
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">{s.sellerName}</p>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
                        <span>{s.email}</span>
                        <span>Legal: {s.legalName}</span>
                        <span>Reg: {s.businessRegNumber}</span>
                      </div>
                      <p className="mt-1 text-xs text-neutral-400">
                        Submitted: {s.submittedAt.toISOString().slice(0, 10)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 gap-2">
                    <Link
                      href={`/admin/sellers/${s.id}`}
                      className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      View Profile
                    </Link>
                    <form action={rejectSellerAction.bind(null, s.id)}>
                      <button
                        type="submit"
                        className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
                      >
                        Reject
                      </button>
                    </form>
                    <form action={verifySellerAction.bind(null, s.id)}>
                      <button
                        type="submit"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
                      >
                        Verify Seller
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recently processed */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <p className="text-sm font-semibold text-neutral-800 dark:text-white">Recently Processed</p>
        </div>
        {recent.length === 0 ? (
          <div className="py-10 text-center text-sm text-neutral-400">No processed sellers yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800/50">
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Store</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Contact</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Submitted</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
                {recent.map((s) => (
                  <tr key={s.id}>
                    <td className="px-5 py-3 font-medium text-neutral-800 dark:text-neutral-200">{s.companyName}</td>
                    <td className="px-5 py-3 text-neutral-500">{s.email}</td>
                    <td className="px-5 py-3 text-neutral-400">{s.submittedAt.toISOString().slice(0, 10)}</td>
                    <td className="px-5 py-3"><VerificationBadge status={s.verificationStatus} /></td>
                    <td className="px-5 py-3">
                      <Link href={`/admin/sellers/${s.id}`} className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
