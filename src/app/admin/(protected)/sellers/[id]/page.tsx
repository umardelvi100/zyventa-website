import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Package, ShoppingCart, RotateCcw, DollarSign } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { VerificationBadge } from "@/components/admin/status-badge";
import type { VerificationStatus } from "@/lib/admin/types";
import { verifySellerAction, rejectSellerAction, suspendSellerAction } from "@/app/admin/actions";

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

function aed(fils: number) {
  return fils > 0
    ? `AED ${(fils / 100).toLocaleString("en-AE", { maximumFractionDigits: 0 })}`
    : "—";
}

interface Metric {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SellerDetailPage({ params }: Props) {
  const { id } = await params;

  const dbSeller = await prisma.seller.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { products: true } },
    },
  });
  if (!dbSeller) notFound();

  const verificationStatus = mapStatus(dbSeller.verificationStatus);

  const seller = {
    id: dbSeller.id,
    companyName: dbSeller.storeName,
    sellerName: dbSeller.user.name,
    email: dbSeller.user.email,
    phone: "—",
    logoInitials: getInitials(dbSeller.storeName),
    logoColor: getLogoColor(dbSeller.id),
    registrationDate: (dbSeller.submittedAt ?? dbSeller.createdAt).toISOString().slice(0, 10),
    verificationStatus,
    businessCategory: "—",
    businessAddress: "—",
    vatNumber: "—",
    lastActive: dbSeller.reviewedAt?.toISOString().slice(0, 10) ?? "—",
    productCount: dbSeller._count.products,
    activeProducts: 0,
    totalSales: 0,
    totalRevenueFils: 0,
    averageRating: 0,
    reviewCount: 0,
    commissionFils: 0,
    returnRate: 0,
    highestSellingProduct: "—",
    highestRatedProduct: "—",
    lowestRatedProduct: "—",
    bestCategory: "—",
    legalName: dbSeller.legalName ?? "—",
    businessRegNumber: dbSeller.businessRegNumber ?? "—",
    idDocumentUrl: dbSeller.idDocumentUrl ?? null,
    regulatoryDocUrl: dbSeller.regulatoryDocUrl ?? null,
    monthlyRevenue: [] as { label: string; value: number }[],
    monthlySales: [] as { label: string; value: number }[],
    categoryDistribution: [] as { label: string; value: number; color: string }[],
  };

  const metrics: Metric[] = [
    {
      label: "Avg. Product Rating",
      value: seller.averageRating > 0 ? `${seller.averageRating} / 5.0` : "No reviews",
      icon: <Star className="h-4 w-4" />,
      accent: "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    },
    {
      label: "Total Reviews",
      value: String(seller.reviewCount),
      icon: <Star className="h-4 w-4" />,
      accent: "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    },
    {
      label: "Products Listed",
      value: String(seller.productCount),
      sub: `${seller.activeProducts} active`,
      icon: <Package className="h-4 w-4" />,
      accent: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400",
    },
    {
      label: "Total Sales",
      value: String(seller.totalSales),
      sub: "orders fulfilled",
      icon: <ShoppingCart className="h-4 w-4" />,
      accent: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
    {
      label: "Revenue Generated",
      value: aed(seller.totalRevenueFils),
      icon: <DollarSign className="h-4 w-4" />,
      accent: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
    {
      label: "Commission Paid",
      value: aed(seller.commissionFils),
      sub: "10% platform fee",
      icon: <DollarSign className="h-4 w-4" />,
      accent: "bg-violet-100 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400",
    },
    {
      label: "Return Rate",
      value: `${seller.returnRate}%`,
      sub: seller.returnRate > 5 ? "⚠ Above threshold" : "Within acceptable range",
      icon: <RotateCcw className="h-4 w-4" />,
      accent:
        seller.returnRate > 5
          ? "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
          : "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
    {
      label: "Best Category",
      value: seller.bestCategory,
      icon: <Package className="h-4 w-4" />,
      accent: "bg-sky-100 text-sky-600 dark:bg-sky-950/40 dark:text-sky-400",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Back */}
      <Link
        href="/admin/sellers"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sellers
      </Link>

      {/* Header card */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-xl font-bold text-white ${seller.logoColor}`}
            >
              {seller.logoInitials}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">{seller.companyName}</h2>
                <VerificationBadge status={seller.verificationStatus} />
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{seller.sellerName}</p>
              <p className="mt-0.5 text-sm text-neutral-400">{seller.email}</p>
              {seller.legalName !== "—" && (
                <p className="mt-0.5 text-xs text-neutral-400">Legal: {seller.legalName} · Reg: {seller.businessRegNumber}</p>
              )}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2">
            {seller.verificationStatus === "pending" && (
              <>
                <form action={rejectSellerAction.bind(null, seller.id)}>
                  <button
                    type="submit"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
                  >
                    Reject
                  </button>
                </form>
                <form action={verifySellerAction.bind(null, seller.id)}>
                  <button
                    type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Verify Seller
                  </button>
                </form>
              </>
            )}
            {seller.verificationStatus === "verified" && (
              <form action={suspendSellerAction.bind(null, seller.id)}>
                <button
                  type="submit"
                  className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-400"
                >
                  Suspend Seller
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Info grid */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-neutral-100 pt-6 text-sm dark:border-neutral-800 sm:grid-cols-3 lg:grid-cols-4">
          {[
            { label: "Submitted", value: seller.registrationDate },
            { label: "Legal Name", value: seller.legalName },
            { label: "Reg. Number", value: seller.businessRegNumber },
            { label: "Last Reviewed", value: seller.lastActive },
          ].map((f) => (
            <div key={f.label}>
              <p className="text-xs text-neutral-400">{f.label}</p>
              <p className="mt-0.5 font-medium text-neutral-800 dark:text-neutral-200">{f.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Performance metrics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className={`mb-3 inline-flex h-8 w-8 items-center justify-center rounded-lg ${m.accent}`}>
              {m.icon}
            </div>
            <p className="text-lg font-bold text-neutral-900 dark:text-white">{m.value}</p>
            <p className="text-xs text-neutral-400">{m.label}</p>
            {m.sub && <p className="mt-0.5 text-[11px] text-neutral-400">{m.sub}</p>}
          </div>
        ))}
      </div>

      {/* Document links */}
      {(seller.idDocumentUrl || seller.regulatoryDocUrl) && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <p className="mb-4 text-sm font-semibold text-neutral-800 dark:text-white">Submitted Documents</p>
          <div className="flex flex-col gap-2 text-sm">
            {seller.idDocumentUrl && (
              <div className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                <span className="text-neutral-600 dark:text-neutral-400">Government-issued ID</span>
                <a href={seller.idDocumentUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                  View Document
                </a>
              </div>
            )}
            {seller.regulatoryDocUrl && (
              <div className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-800/40">
                <span className="text-neutral-600 dark:text-neutral-400">Regulatory Document</span>
                <a href={seller.regulatoryDocUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
                  View Document
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
