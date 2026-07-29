import { redirect } from "next/navigation";
import Link from "next/link";
import { Boxes, AlertTriangle, CheckCircle2 } from "lucide-react";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";

type StockFilter = "all" | "low" | "out";

function stockBadge(stock: number) {
  if (stock === 0)
    return <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-400">Out of stock</span>;
  if (stock <= 5)
    return <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">{stock} left</span>;
  return <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">{stock} in stock</span>;
}

export default async function AdminInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; category?: string }>;
}) {
  const ctx = await requireAdmin();
  if (!ctx) redirect("/");

  const { filter = "all", category } = await searchParams;
  const stockFilter = filter as StockFilter;

  const stockWhere =
    stockFilter === "out" ? { stock: 0 } :
    stockFilter === "low" ? { stock: { gt: 0, lte: 5 } } :
    {};

  const [products, totalCount, lowCount, outCount, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        ...stockWhere,
        ...(category ? { category } : {}),
      },
      include: { seller: { select: { storeName: true } } },
      orderBy: [{ stock: "asc" }, { name: "asc" }],
    }),
    prisma.product.count(),
    prisma.product.count({ where: { stock: { gt: 0, lte: 5 } } }),
    prisma.product.count({ where: { stock: 0 } }),
    prisma.product.findMany({ distinct: ["category"], select: { category: true } }),
  ]);

  const categoryNames = categories.map((c) => c.category);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-orange-500 text-white">
            <Boxes className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-xl font-black tracking-tight">Inventory</h1>
            <p className="text-xs text-neutral-500">{totalCount} products · {lowCount} low · {outCount} out of stock</p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-3">
        <Link
          href="/admin/inventory?filter=all"
          className={`flex items-center gap-3 rounded-2xl border p-4 transition ${stockFilter === "all" ? "border-indigo-300 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/30" : "border-black/5 bg-white hover:border-black/10 dark:border-white/10 dark:bg-neutral-900"}`}
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-indigo-500" />
          <div>
            <p className="text-lg font-black">{totalCount}</p>
            <p className="text-xs text-neutral-500">All products</p>
          </div>
        </Link>
        <Link
          href="/admin/inventory?filter=low"
          className={`flex items-center gap-3 rounded-2xl border p-4 transition ${stockFilter === "low" ? "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30" : "border-black/5 bg-white hover:border-black/10 dark:border-white/10 dark:bg-neutral-900"}`}
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <p className="text-lg font-black">{lowCount}</p>
            <p className="text-xs text-neutral-500">Low stock (≤5)</p>
          </div>
        </Link>
        <Link
          href="/admin/inventory?filter=out"
          className={`flex items-center gap-3 rounded-2xl border p-4 transition ${stockFilter === "out" ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30" : "border-black/5 bg-white hover:border-black/10 dark:border-white/10 dark:bg-neutral-900"}`}
        >
          <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
          <div>
            <p className="text-lg font-black">{outCount}</p>
            <p className="text-xs text-neutral-500">Out of stock</p>
          </div>
        </Link>
      </div>

      {/* Category filter pills */}
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/admin/inventory?filter=${stockFilter}`}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${!category ? "bg-indigo-600 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"}`}
        >
          All categories
        </Link>
        {categoryNames.map((c) => (
          <Link
            key={c}
            href={`/admin/inventory?filter=${stockFilter}&category=${encodeURIComponent(c)}`}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${category === c ? "bg-indigo-600 text-white" : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300"}`}
          >
            {c}
          </Link>
        ))}
      </div>

      {/* Product table */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          <p className="mt-4 font-semibold">No products match this filter</p>
          <Link href="/admin/inventory" className="mt-2 text-sm text-indigo-600 hover:underline dark:text-indigo-400">Clear filters</Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white dark:border-white/10 dark:bg-neutral-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 bg-neutral-50 text-left dark:border-white/10 dark:bg-neutral-800/50">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">Product</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">Category</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">Seller</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">Price</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">Stock</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-black/2 dark:hover:bg-white/3">
                    <td className="px-4 py-3">
                      <Link href={`/products/${p.slug}`} className="font-medium hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">
                        {p.name}
                      </Link>
                      {p.subcategory && (
                        <p className="text-xs text-neutral-400">{p.subcategory}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{p.category}</td>
                    <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{p.seller.storeName}</td>
                    <td className="px-4 py-3 font-semibold">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3 tabular-nums font-medium">{p.stock}</td>
                    <td className="px-4 py-3">{stockBadge(p.stock)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
