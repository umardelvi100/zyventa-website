import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Star, Package, ShoppingCart, RotateCcw, DollarSign } from "lucide-react";
import { MOCK_SELLERS } from "@/lib/admin/mock-data";
import { VerificationBadge } from "@/components/admin/status-badge";
import { LineChart } from "@/components/admin/charts/line-chart";
import { DonutChart } from "@/components/admin/charts/donut-chart";
import { verifySellerAction, rejectSellerAction, suspendSellerAction } from "@/app/admin/actions";

function aed(fils: number) {
  return fils > 0
    ? `AED ${(fils / 100).toLocaleString("en-AE", { maximumFractionDigits: 0 })}`
    : "—";
}

function fmtK(v: number) {
  return v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v);
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
  const seller = MOCK_SELLERS.find((s) => s.id === id);
  if (!seller) notFound();

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
              <p className="mt-0.5 text-sm text-neutral-400">{seller.email} · {seller.phone}</p>
              <p className="mt-0.5 text-xs text-neutral-400">{seller.businessAddress}</p>
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
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-neutral-100 pt-6 text-sm dark:border-neutral-800 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { label: "Business Category", value: seller.businessCategory },
            { label: "VAT Number", value: seller.vatNumber || "Not provided" },
            { label: "Seller Since", value: seller.registrationDate },
            { label: "Last Active", value: seller.lastActive },
            { label: "Best Performing", value: seller.bestCategory },
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

      {/* Charts */}
      {seller.monthlyRevenue.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="col-span-1 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 lg:col-span-2">
            <p className="mb-1 text-sm font-semibold text-neutral-800 dark:text-white">Monthly Revenue (AED)</p>
            <p className="mb-4 text-xs text-neutral-400">Last 12 months</p>
            <LineChart
              data={seller.monthlyRevenue}
              gradientId={`rev-${seller.id}`}
              color="#6366f1"
              formatY={(v) => `${(v / 1000).toFixed(0)}k`}
            />
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <p className="mb-4 text-sm font-semibold text-neutral-800 dark:text-white">Category Distribution</p>
            <DonutChart data={seller.categoryDistribution} label={`${seller.productCount}`} />
          </div>
        </div>
      )}

      {/* Top products info */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <p className="mb-4 text-sm font-semibold text-neutral-800 dark:text-white">Product Highlights</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "🏆 Highest Selling", value: seller.highestSellingProduct },
            { label: "⭐ Highest Rated", value: seller.highestRatedProduct },
            { label: "⚠ Lowest Rated", value: seller.lowestRatedProduct },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/40"
            >
              <p className="text-xs text-neutral-400">{item.label}</p>
              <p className="mt-1 font-semibold text-neutral-800 dark:text-neutral-200">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
