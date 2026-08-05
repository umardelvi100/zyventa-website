"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const COLLECTIONS = [
  {
    id: "doctors-choice",
    title: "Doctor's Choice",
    subtitle: "Clinically recommended & pharmacy-grade essentials",
    tag: "Most trusted",
    href: "/products?category=Medicines",
    gradient: "from-teal-600 via-cyan-600 to-emerald-700",
    accent: "bg-teal-500/20 text-teal-100",
    decoration: "from-teal-400/30 to-transparent",
  },
  {
    id: "wellness-edit",
    title: "Wellness Edit",
    subtitle: "Daily rituals for a healthier, calmer you",
    tag: "Editor's pick",
    href: "/products?category=Consumables",
    gradient: "from-indigo-600 via-violet-600 to-purple-700",
    accent: "bg-indigo-500/20 text-indigo-100",
    decoration: "from-indigo-400/30 to-transparent",
  },
  {
    id: "beauty-journal",
    title: "Beauty Journal",
    subtitle: "Curated skincare, cosmetics & self-care finds",
    tag: "Trending now",
    href: "/products?category=Cosmetics",
    gradient: "from-pink-600 via-fuchsia-600 to-purple-600",
    accent: "bg-pink-500/20 text-pink-100",
    decoration: "from-pink-400/30 to-transparent",
  },
];

export function FeaturedCollections() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-600">
            Curated For You
          </p>
          <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
            Featured Collections
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {COLLECTIONS.map(({ id, title, subtitle, tag, href, gradient, accent, decoration }, i) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
          >
            <Link href={href} className="group relative block overflow-hidden rounded-2xl">
              {/* Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
              {/* Decorative blob */}
              <div className={`absolute -right-8 -top-8 h-48 w-48 rounded-full bg-gradient-to-br ${decoration} blur-2xl`} />
              {/* Noise texture feel */}
              <div className="absolute inset-0 opacity-10 [background-image:url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSczMDAnIGhlaWdodD0nMzAwJz48ZmlsdGVyIGlkPSdub2lzZSc+PGZlVHVyYnVsZW5jZSB0eXBlPSdmcmFjdGFsTm9pc2UnIGJhc2VGcmVxdWVuY3k9JzAuNjUnIG51bU9jdGF2ZXM9JzMnIHN0aXRjaFRpbGVzPSdzdGl0Y2gnLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0nMzAwJyBoZWlnaHQ9JzMwMCcgZmlsdGVyPSd1cmwoI25vaXNlKScgb3BhY2l0eT0nMC40Jy8+PC9zdmc+')]" />

              {/* Content */}
              <div className="relative px-7 py-10">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${accent}`}>
                  {tag}
                </span>
                <h3 className="mt-4 text-2xl font-black text-white tracking-tight leading-tight">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-white/75 leading-relaxed max-w-[200px]">
                  {subtitle}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-white">
                  Explore <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
