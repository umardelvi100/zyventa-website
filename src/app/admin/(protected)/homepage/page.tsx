import Link from "next/link";
import { Globe, Zap, Eye, LayoutGrid, Megaphone } from "lucide-react";
import { getHomepageConfig, getActivePromoBanner } from "@/lib/homepage/config";
import { prisma } from "@/lib/prisma";

export default async function HomepageCMSPage() {
  const [config, activeBanner, bannerCount] = await Promise.all([
    getHomepageConfig(),
    getActivePromoBanner(),
    prisma.promoBanner.count(),
  ]);

  const sections = [
    { key: "showBestSellers" as const, label: "Best Sellers" },
    { key: "showNewArrivals" as const, label: "New Arrivals" },
    { key: "showBrands" as const, label: "Brand Showcase" },
    { key: "showTestimonials" as const, label: "Customer Reviews" },
    { key: "showArticles" as const, label: "Health Journal" },
    { key: "showNewsletter" as const, label: "Newsletter" },
  ];

  const enabledCount = sections.filter((s) => config[s.key]).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Homepage CMS</h1>
          <p className="text-sm text-neutral-500">Manage what customers see on the Zyventa homepage.</p>
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
        >
          <Eye className="h-4 w-4" /> Preview Homepage
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Active Banner",
            value: activeBanner ? activeBanner.name : "None",
            sub: `${bannerCount} total`,
            color: activeBanner ? "text-emerald-600" : "text-neutral-400",
          },
          {
            label: "Hero Title",
            value:
              config.heroTitle.slice(0, 28) + (config.heroTitle.length > 28 ? "…" : ""),
            sub: "Current hero",
            color: "text-indigo-600",
          },
          {
            label: "Sections Enabled",
            value: `${enabledCount} / ${sections.length}`,
            sub: "Homepage sections",
            color: "text-orange-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
          >
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="mt-0.5 text-xs font-medium text-neutral-500">{stat.label}</p>
            <p className="text-[11px] text-neutral-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Management cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/homepage/hero"
          className="group flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900 group-hover:text-indigo-700 dark:text-white">
              Hero &amp; Sections
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Edit title, subtitle, CTAs, announcement bar, and toggle homepage sections.
            </p>
            <p className="mt-3 text-xs font-semibold text-indigo-600">Configure →</p>
          </div>
        </Link>

        <Link
          href="/admin/homepage/banners"
          className="group flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:border-orange-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-neutral-900 group-hover:text-orange-700 dark:text-white">
              Promotional Banners
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Create Ramadan, Eid, Summer Sale, Black Friday banners. Toggle without code changes.
            </p>
            <p className="mt-3 text-xs font-semibold text-orange-600">
              {bannerCount} banner{bannerCount !== 1 ? "s" : ""} →
            </p>
          </div>
        </Link>

        <div className="flex items-start gap-4 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900/50">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-neutral-400">Collections &amp; Brands</p>
            <p className="mt-1 text-sm text-neutral-400">
              Manage curated collections and featured brands.
            </p>
            <span className="mt-3 inline-block rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-semibold text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400">
              COMING SOON
            </span>
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border border-dashed border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-700 dark:bg-neutral-900/50">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-400 dark:bg-neutral-800">
            <Megaphone className="h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-neutral-400">Testimonials &amp; Articles</p>
            <p className="mt-1 text-sm text-neutral-400">
              Manage customer reviews and health journal articles.
            </p>
            <span className="mt-3 inline-block rounded-full bg-neutral-200 px-2 py-0.5 text-[10px] font-semibold text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400">
              COMING SOON
            </span>
          </div>
        </div>
      </div>

      {/* Section status */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <div className="border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
          <p className="text-sm font-semibold text-neutral-800 dark:text-white">Active Sections</p>
          <p className="text-xs text-neutral-400">
            Go to Hero &amp; Sections to enable or disable individual sections.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 p-5 sm:grid-cols-3">
          {sections.map((s) => (
            <div key={s.key} className="flex items-center gap-2 text-sm">
              <span
                className={`h-2 w-2 rounded-full ${
                  config[s.key] ? "bg-emerald-500" : "bg-neutral-300 dark:bg-neutral-600"
                }`}
              />
              <span
                className={
                  config[s.key]
                    ? "text-neutral-700 dark:text-neutral-300"
                    : "text-neutral-400"
                }
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
