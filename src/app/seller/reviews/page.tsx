"use client";

import { useState } from "react";
import { Star, MessageSquare, CheckCircle, ThumbsUp, Reply } from "lucide-react";
import { MOCK_SELLER_REVIEWS } from "@/lib/seller/mock-data";

const STARS = [5, 4, 3, 2, 1];

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${i < count ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
        />
      ))}
    </div>
  );
}

export default function SellerReviewsPage() {
  const [filter, setFilter] = useState<number | "all">("all");

  const filtered = MOCK_SELLER_REVIEWS.filter((r) => filter === "all" || r.rating === filter);

  const avgRating = MOCK_SELLER_REVIEWS.reduce((s, r) => s + r.rating, 0) / MOCK_SELLER_REVIEWS.length;
  const starCounts = STARS.map((s) => ({
    star: s,
    count: MOCK_SELLER_REVIEWS.filter((r) => r.rating === s).length,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-900">Reviews</h2>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex items-center gap-6">
          <div className="text-center">
            <p className="text-5xl font-black text-slate-900">{avgRating.toFixed(1)}</p>
            <div className="mt-1 flex justify-center">
              <StarRow count={Math.round(avgRating)} />
            </div>
            <p className="mt-1 text-xs text-slate-400">{MOCK_SELLER_REVIEWS.length} reviews</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {starCounts.map(({ star, count }) => {
              const pct = Math.round((count / MOCK_SELLER_REVIEWS.length) * 100);
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-right text-slate-500">{star}</span>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100">
                    <div className="h-1.5 rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-4 text-slate-400">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Reviews", value: MOCK_SELLER_REVIEWS.length, color: "text-slate-900" },
            { label: "Verified Purchases", value: MOCK_SELLER_REVIEWS.filter((r) => r.verified).length, color: "text-emerald-600" },
            { label: "Awaiting Reply", value: MOCK_SELLER_REVIEWS.filter((r) => !r.replied).length, color: "text-amber-600" },
          ].map((c) => (
            <div key={c.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm text-center">
              <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
              <p className="text-xs text-slate-500 mt-1">{c.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Star filter */}
      <div className="flex gap-1 rounded-xl border border-slate-200 bg-white p-1 w-fit text-sm">
        {(["all", 5, 4, 3, 2, 1] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 font-medium transition ${
              filter === f ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {f === "all" ? "All" : `${f} ★`}
          </button>
        ))}
      </div>

      {/* Review cards */}
      <div className="space-y-4">
        {filtered.map((review) => (
          <div key={review.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                  {review.customerName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-900 text-sm">{review.customerName}</p>
                    {review.verified && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                        <CheckCircle className="h-3.5 w-3.5" /> Verified Purchase
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">{review.productName} · {review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="font-semibold text-slate-900 text-sm">{review.title}</p>
              <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{review.body}</p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <button className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition">
                <ThumbsUp className="h-3.5 w-3.5" /> Helpful
              </button>
              <div className="flex items-center gap-2">
                {review.replied ? (
                  <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                    <MessageSquare className="h-3.5 w-3.5" /> Replied
                  </span>
                ) : (
                  <button className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 transition">
                    <Reply className="h-3.5 w-3.5" /> Reply to Customer
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
