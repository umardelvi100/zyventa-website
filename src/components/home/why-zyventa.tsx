"use client";

import { motion } from "framer-motion";
import { ShieldCheck, BadgeCheck, Lock, Truck, RotateCcw, Headphones } from "lucide-react";

const PILLARS = [
  {
    icon: BadgeCheck,
    title: "100% Genuine Products",
    desc: "Every product listed on Zyventa is sourced directly from verified manufacturers and authorised distributors.",
    color: "from-teal-500 to-emerald-500",
    bg: "bg-teal-50",
    text: "text-teal-600",
  },
  {
    icon: ShieldCheck,
    title: "Verified Sellers Only",
    desc: "All sellers go through a rigorous KYC and license verification process before listing any product.",
    color: "from-indigo-500 to-blue-500",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
  },
  {
    icon: Lock,
    title: "Secure Payments",
    desc: "PCI-DSS compliant checkout with SSL encryption. Your payment details are never stored on our servers.",
    color: "from-purple-500 to-violet-500",
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
  {
    icon: Truck,
    title: "Fast UAE Delivery",
    desc: "Same-day and next-day delivery across all 7 Emirates, with real-time order tracking at every step.",
    color: "from-orange-500 to-amber-400",
    bg: "bg-orange-50",
    text: "text-orange-600",
  },
  {
    icon: RotateCcw,
    title: "Hassle-Free Returns",
    desc: "Changed your mind? Our 7-day no-questions-asked return policy means shopping is always risk-free.",
    color: "from-pink-500 to-rose-400",
    bg: "bg-pink-50",
    text: "text-pink-600",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "A real team based in Dubai, available 7 days a week to help with orders, returns, or product queries.",
    color: "from-cyan-500 to-teal-400",
    bg: "bg-cyan-50",
    text: "text-cyan-600",
  },
];

export function WhyZyventa() {
  return (
    <section className="bg-neutral-50/60 border-y border-black/[0.04] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14 text-center">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600">
            Why Choose Us
          </p>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            A marketplace built on trust
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-500">
            From the moment you browse to the day your order arrives, Zyventa is designed to give you complete confidence.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, desc, color, bg, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="flex gap-5 rounded-2xl border border-black/[0.05] bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow-sm`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-neutral-900 leading-snug">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-500">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
