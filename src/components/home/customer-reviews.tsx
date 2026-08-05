"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const REVIEWS = [
  {
    id: "r1",
    name: "Aisha Al Mansoori",
    location: "Dubai",
    avatar: "A",
    avatarBg: "from-teal-500 to-cyan-400",
    rating: 5,
    product: "Nourisil MD Scar Gel",
    title: "Finally a platform I actually trust",
    body: "After buying fake skincare twice from other sites, Zyventa felt completely different. Verified sellers, genuine products, and my order arrived the next morning. This is how online shopping should work.",
    verified: true,
  },
  {
    id: "r2",
    name: "Mohammed Al Rashidi",
    location: "Abu Dhabi",
    avatar: "M",
    avatarBg: "from-indigo-500 to-blue-400",
    rating: 5,
    product: "Vitamin C Serum 50ml",
    title: "Surprisingly fast delivery to Abu Dhabi",
    body: "Ordered at 10 PM and had my package by 11 AM the next day. The product was exactly as described, packaged perfectly. The tracking updates were clear and accurate throughout.",
    verified: true,
  },
  {
    id: "r3",
    name: "Sara Al Zaabi",
    location: "Sharjah",
    avatar: "S",
    avatarBg: "from-pink-500 to-fuchsia-400",
    rating: 5,
    product: "Hyaluronic Acid Cream",
    title: "The whole experience feels premium",
    body: "From browsing to checkout to delivery — the experience is seamless. The product cards are clear, the checkout is fast, and the packaging was beautiful. Already recommended it to five friends.",
    verified: true,
  },
];

export function CustomerReviews() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600">
          Real Customers
        </p>
        <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
          Loved across the UAE
        </h2>
        <div className="mx-auto mt-3 flex items-center justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
          ))}
          <span className="ml-2 text-sm font-semibold text-neutral-700">4.8 / 5</span>
          <span className="ml-1 text-sm text-neutral-400">from 2,400+ verified reviews</span>
        </div>
      </div>

      {/* Review cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {REVIEWS.map(({ id, name, location, avatar, avatarBg, rating, product, title, body, verified }, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="flex flex-col gap-4 rounded-2xl border border-black/[0.06] bg-white p-7 shadow-sm"
          >
            {/* Stars */}
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-neutral-200"}`} />
              ))}
            </div>

            {/* Quote icon */}
            <Quote className="h-7 w-7 text-indigo-100" />

            {/* Body */}
            <p className="flex-1 text-sm leading-relaxed text-neutral-600">&ldquo;{body}&rdquo;</p>

            {/* Product ref */}
            <p className="text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
              Purchased: {product}
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-1 border-t border-black/[0.04]">
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarBg} text-sm font-bold text-white`}>
                {avatar}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">{name}</p>
                <p className="text-xs text-neutral-400">{location} {verified && "· ✓ Verified Purchase"}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
