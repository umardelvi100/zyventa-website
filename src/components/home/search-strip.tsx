"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const QUICK_SEARCHES = ["Scar gel", "Vitamin C", "Sunscreen SPF 50", "Collagen"];

export function SearchStrip() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/products?search=${encodeURIComponent(query.trim())}`);
  }

  return (
    <section className="border-b border-black/[0.05] bg-neutral-50 py-4">
      <form
        onSubmit={handleSearch}
        className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 sm:px-6 lg:px-8"
      >
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicines, skincare, vitamins…"
            className="w-full rounded-md border border-black/10 bg-white py-2.5 pl-11 pr-4 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/15"
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition hover:opacity-90"
        >
          Search
        </button>
        <div className="flex flex-wrap gap-1.5">
          {QUICK_SEARCHES.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => router.push(`/products?search=${encodeURIComponent(q)}`)}
              className="rounded-full border border-black/8 bg-white px-2.5 py-1 text-[11px] font-medium text-neutral-500 transition hover:border-accent/40 hover:text-accent"
            >
              {q}
            </button>
          ))}
        </div>
      </form>
    </section>
  );
}
