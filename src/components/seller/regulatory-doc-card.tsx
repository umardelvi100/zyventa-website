"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2, ShieldAlert, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { isSafeHttpUrl } from "@/lib/safe-url";

export function RegulatoryDocCard({ regulatoryDocUrl }: { regulatoryDocUrl: string | null }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/seller", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ regulatoryDocUrl: value }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not save document.");
      return;
    }
    toast.success("Regulatory document saved.");
    setEditing(false);
    setValue("");
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900">
      <div className="flex items-start gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
            regulatoryDocUrl
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
              : "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400"
          }`}
        >
          {regulatoryDocUrl ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">Regulatory approval document</p>
          {regulatoryDocUrl && isSafeHttpUrl(regulatoryDocUrl) ? (
            <a
              href={regulatoryDocUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-1 text-sm text-indigo-700 hover:underline dark:text-indigo-400"
            >
              View submitted document <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <p className="mt-1 text-sm text-neutral-500">
              Required before you can list Medicines or Cosmetics products.
            </p>
          )}
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
          >
            {regulatoryDocUrl ? "Update" : "Add"}
          </button>
        )}
      </div>

      {editing && (
        <form onSubmit={submit} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            required
            type="url"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://..."
            className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-70"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded-xl border border-black/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
