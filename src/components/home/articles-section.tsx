"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";

const ARTICLES = [
  {
    id: "a1",
    tag: "Wellness",
    tagColor: "bg-teal-100 text-teal-700",
    title: "The 5 supplements every UAE resident should know about",
    excerpt: "From Vitamin D deficiency to gut health — a pharmacist's guide to what actually works in the Gulf climate.",
    readTime: "4 min read",
    gradient: "from-teal-500 to-emerald-600",
    href: "#",
  },
  {
    id: "a2",
    tag: "Skincare",
    tagColor: "bg-pink-100 text-pink-700",
    title: "SPF 50 is not enough in Dubai summers — here's why",
    excerpt: "Dermatologists explain why the UV index in the UAE demands a completely different approach to sun protection.",
    readTime: "3 min read",
    gradient: "from-pink-500 to-fuchsia-600",
    href: "#",
  },
  {
    id: "a3",
    tag: "Health",
    tagColor: "bg-indigo-100 text-indigo-700",
    title: "How to read a supplement label like a professional",
    excerpt: "Understanding bioavailability, fillers, and dosage — what to look for before you buy any health supplement.",
    readTime: "5 min read",
    gradient: "from-indigo-500 to-blue-600",
    href: "#",
  },
];

export function ArticlesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600">
            Knowledge Centre
          </p>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            From the Health Journal
          </h2>
        </div>
        <Link
          href="#"
          className="hidden items-center gap-1 text-sm font-semibold text-indigo-600 hover:underline sm:flex"
        >
          Read all articles <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {ARTICLES.map(({ id, tag, tagColor, title, excerpt, readTime, gradient, href }, i) => (
          <motion.article
            key={id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
          >
            <Link href={href} className="group block h-full rounded-2xl border border-black/[0.06] bg-white shadow-sm overflow-hidden transition hover:shadow-md hover:-translate-y-1 duration-300">
              {/* Thumbnail */}
              <div className={`relative h-40 bg-gradient-to-br ${gradient} flex items-end p-5`}>
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${tagColor} bg-white/90`}>
                  {tag}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-neutral-900 leading-snug group-hover:text-indigo-600 transition-colors">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500 line-clamp-3">
                  {excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <Clock className="h-3.5 w-3.5" /> {readTime}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold text-indigo-600">
                    Read <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </div>
            </Link>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
