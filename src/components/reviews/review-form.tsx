"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ReviewForm({ productId }: { productId: string }) {
  const { status } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  if (status !== "authenticated") {
    return (
      <p className="rounded-2xl border border-black/5 bg-white p-5 text-sm text-neutral-500 dark:border-white/10 dark:bg-neutral-900">
        <a href="/login" className="font-semibold text-indigo-700 hover:underline dark:text-indigo-400">
          Sign in
        </a>{" "}
        to leave a review.
      </p>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, title, body }),
    });
    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Could not submit review.");
      return;
    }

    toast.success("Thanks for your review!");
    setTitle("");
    setBody("");
    setRating(0);
    router.refresh();
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-white p-5 dark:border-white/10 dark:bg-neutral-900"
    >
      <p className="font-semibold">Write a review</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHoverRating(n)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            <Star
              className={`h-6 w-6 transition ${
                n <= (hoverRating || rating) ? "fill-amber-400 text-amber-400" : "text-neutral-300"
              }`}
            />
          </button>
        ))}
      </div>
      <input
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Review title"
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
      />
      <textarea
        required
        rows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="What did you think?"
        className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-white/15 dark:bg-neutral-900"
      />
      <motion.button
        type="submit"
        disabled={loading}
        whileTap={{ scale: 0.97 }}
        className="self-start rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-70 dark:bg-white dark:text-neutral-950"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit review"}
      </motion.button>
    </motion.form>
  );
}
