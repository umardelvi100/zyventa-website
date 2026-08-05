"use client";

import { useState } from "react";
import { Star, CheckCircle, MessageSquare } from "lucide-react";
import { MOCK_SELLER_REVIEWS } from "@/lib/seller/mock-data";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`}
        />
      ))}
    </div>
  );
}

const FILTER_RATINGS = ["All", "5", "4", "3", "2", "1"];

export default function SellerReviewsPage() {
  const [ratingFilter, setRatingFilter] = useState("All");
  const [replyFilter, setReplyFilter] = useState<"all" | "replied" | "unreplied">("all");

  const filtered = MOCK_SELLER_REVIEWS.filter((r) => {
    const matchRating = ratingFilter === "All" || r.rating === Number(ratingFilter);
    const matchReply =
      replyFilter === "all" ||
      (replyFilter === "replied" && r.replied) ||
      (replyFilter === "unreplied" && !r.replied);
    return matchRating && matchReply;
  });

  const avgRating =
    MOCK_SELLER_REVIEWS.reduce((s, r) => s + r.rating, 0) / MOCK_SELLER_REVIEWS.length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Reviews</h2>
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
          <span className="text-lg font-bold text-slate-900">{avgRating.toFixed(1)}</span>
          <span className="text-sm text-slate-400">/ 5 · {MOCK_SELLER_REVIEWS.length} reviews</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white text-sm">
          {FILTER_RATINGS.map((r) => (
            <button
              key={r}
              onClick={() => setRatingFilter(r)}
              className={`px-3 py-2 font-medium transition ${
                ratingFilter === r ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {r === "All" ? "All" : `${r}★`}
            </button>
          ))}
        </div>
        <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white text-sm">
          {(["all", "unreplied", "replied"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setReplyFilter(f)}
              className={`px-3 py-2 font-medium transition capitalize ${
                replyFilter === f ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {filtered.map((review) => (
          <div key={review.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <StarRating rating={review.rating} />
                  {review.verified && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                      <CheckCircle className="h-3.5 w-3.5" /> Verified
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-semibold text-slate-900">{review.title}</h4>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-medium text-slate-700">{review.customerName}</p>
                <p className="text-xs text-slate-400">{review.date}</p>
              </div>
            </div>

            <p className="mt-2 text-sm text-slate-600">{review.body}</p>
            <p className="mt-1 text-xs text-slate-400">Product: {review.productName}</p>

            <div className="mt-3 flex items-center justify-between">
              {review.replied ? (
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <MessageSquare className="h-3.5 w-3.5" /> Replied
                </span>
              ) : (
                <button className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition">
                  <MessageSquare className="h-3.5 w-3.5" /> Reply to review
                </button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white py-16 text-center text-sm text-slate-400">
            No reviews match this filter.
          </div>
        )}
      </div>
    </div>
  );
}
