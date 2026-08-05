"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-neutral-950 px-8 py-14 text-center sm:px-14"
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-16 -top-16 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -right-16 -bottom-16 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
        </div>

        <div className="relative">
          {/* Icon */}
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-orange-500 text-white shadow-lg">
            <Sparkles className="h-7 w-7" />
          </div>

          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-400">
            Stay in the Know
          </p>
          <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            Health & Beauty, delivered to your inbox
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-400">
            Get curated wellness picks, exclusive early access to promotions, and expert health articles — no spam, ever.
          </p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-400"
            >
              ✓ You&apos;re subscribed — thank you!
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-sm flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-neutral-500 outline-none transition focus:border-indigo-500 focus:bg-white/10"
              />
              <button
                type="submit"
                className="flex shrink-0 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
              >
                Subscribe <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          <p className="mt-4 text-xs text-neutral-600">
            No spam. Unsubscribe any time.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
