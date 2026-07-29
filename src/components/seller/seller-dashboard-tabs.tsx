"use client";

import Link from "next/link";

const TABS = [
  { key: "overview",   label: "Overview" },
  { key: "inventory",  label: "Products & Inventory" },
  { key: "orders",     label: "Orders" },
  { key: "analytics",  label: "Analytics" },
];

export function SellerDashboardTabs({ activeTab }: { activeTab: string }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-xl border border-black/5 bg-neutral-100 p-1 dark:border-white/10 dark:bg-neutral-800">
      {TABS.map(({ key, label }) => (
        <Link
          key={key}
          href={`/seller/dashboard?tab=${key}`}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
            activeTab === key
              ? "bg-white text-neutral-900 shadow dark:bg-neutral-950 dark:text-white"
              : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
