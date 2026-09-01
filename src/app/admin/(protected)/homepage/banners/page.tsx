import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { toggleBannerAction, deleteBannerAction } from "@/app/admin/homepage-actions";

export default async function BannersPage() {
  const banners = await prisma.promoBanner.findMany({
    orderBy: [{ isActive: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/homepage"
          className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
            Promotional Banners
          </h1>
          <p className="text-sm text-neutral-500">
            Create and manage seasonal or promotional banners for the homepage.
          </p>
        </div>
        <Link
          href="/admin/homepage/banners/new"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" /> New Banner
        </Link>
      </div>

      {banners.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 py-20 text-center dark:border-neutral-700 dark:bg-neutral-900/50">
          <p className="text-sm font-medium text-neutral-500">No banners yet.</p>
          <p className="mt-1 text-xs text-neutral-400">
            Create banners for Ramadan, Eid, Summer Sale, Black Friday and more.
          </p>
          <Link
            href="/admin/homepage/banners/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" /> Create First Banner
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {banners.map((b) => (
            <div
              key={b.id}
              className={`rounded-2xl border bg-white shadow-sm dark:bg-neutral-900 ${
                b.isActive
                  ? "border-indigo-200 dark:border-indigo-800"
                  : "border-neutral-200 dark:border-neutral-800"
              }`}
            >
              <div className="flex items-center gap-4 p-5">
                <div
                  className="h-14 w-14 shrink-0 rounded-xl shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${b.bgFrom}, ${b.bgTo})`,
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-neutral-900 dark:text-white">{b.name}</p>
                    {b.isActive && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                        ACTIVE
                      </span>
                    )}
                    {b.tag && (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
                        {b.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-neutral-600 dark:text-neutral-400">
                    {b.title}
                  </p>
                  {b.subtitle && (
                    <p className="truncate text-xs text-neutral-400">{b.subtitle}</p>
                  )}
                  <p className="mt-1 text-xs text-neutral-400">
                    {b.ctaText} → {b.ctaLink}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <form action={toggleBannerAction.bind(null, b.id, !b.isActive)}>
                    <button
                      type="submit"
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        b.isActive
                          ? "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                          : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400"
                      }`}
                    >
                      {b.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </form>
                  <form action={deleteBannerAction.bind(null, b.id)}>
                    <button
                      type="submit"
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-sm text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/50">
        <p className="font-medium text-neutral-700 dark:text-neutral-300">How it works</p>
        <p className="mt-1">
          All active banners appear together as slides in the homepage slideshow, in sort order.
          Activate a banner to include it; deactivate to remove it without deleting.
        </p>
      </div>
    </div>
  );
}
