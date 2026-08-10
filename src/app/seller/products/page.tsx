import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Plus, Package, Edit, Star } from "lucide-react";
import { requireSeller } from "@/lib/require-seller";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { computeRating } from "@/lib/ratings";
import { DeleteProductButton } from "@/components/seller/delete-product-button";

const FILTER_TABS = [
  { key: "all",      label: "All" },
  { key: "lowstock", label: "Low Stock" },
];

export default async function SellerProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; search?: string }>;
}) {
  const ctx = await requireSeller();
  if (!ctx) redirect("/sell");

  const { tab = "all", search = "" } = await searchParams;

  const products = await prisma.product.findMany({
    where: {
      sellerId: ctx.seller.id,
      ...(search ? { name: { contains: search } } : {}),
    },
    include: { reviews: { select: { rating: true } } },
    orderBy: { createdAt: "desc" },
  });

  const filtered =
    tab === "lowstock" ? products.filter((p) => p.stock < 10) : products;

  const isApproved = ctx.seller.verificationStatus === "approved";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">My Products</h2>
        {isApproved ? (
          <Link
            href="/seller/products/new"
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        ) : (
          <span className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
            Verification required to add products
          </span>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white text-sm">
          {FILTER_TABS.map(({ key, label }) => (
            <Link
              key={key}
              href={`?tab=${key}${search ? `&search=${encodeURIComponent(search)}` : ""}`}
              className={`px-3 py-2 font-medium transition ${
                tab === key
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        <form method="GET" className="flex-1 min-w-48 flex gap-2">
          <input type="hidden" name="tab" value={tab} />
          <input
            type="search"
            name="search"
            defaultValue={search}
            placeholder="Search products…"
            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          <button
            type="submit"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Search
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left">
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Product</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Category</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Price</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Stock</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Rating</th>
              <th className="px-5 py-3 text-xs font-semibold text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((product) => {
              const { avgRating, reviewCount } = computeRating(product.reviews);
              return (
                <tr key={product.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-100 bg-slate-50">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate max-w-44 font-medium text-slate-900">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-slate-400">/{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-slate-600">{product.category}</td>
                  <td className="px-5 py-3 font-semibold text-slate-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`font-semibold ${
                        product.stock === 0
                          ? "text-red-600"
                          : product.stock < 10
                          ? "text-amber-600"
                          : "text-slate-900"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    {reviewCount > 0 ? (
                      <span className="flex items-center gap-1 text-amber-600 font-semibold">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {avgRating.toFixed(1)}
                        <span className="text-slate-400 font-normal">({reviewCount})</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/seller/products/${product.id}/edit`}
                        title="Edit"
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <DeleteProductButton productId={product.id} name={product.name} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Package className="mx-auto h-10 w-10 text-slate-200" />
            <p className="mt-3 text-sm text-slate-400">
              {products.length === 0
                ? isApproved
                  ? "No products yet."
                  : "Your account is pending verification by our team."
                : "No products match your search."}
            </p>
            {products.length === 0 && isApproved && (
              <Link
                href="/seller/products/new"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition"
              >
                <Plus className="h-4 w-4" /> Add your first product
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
