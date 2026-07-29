"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import type { Locale } from "@/lib/i18n/translations";

export function LanguageSwitcher() {
  const { locale, dict, setLocale } = useLocale();
  const [open, setOpen] = useState(false);

  const options: { code: Locale; label: string }[] = [
    { code: "en", label: dict.language.english },
    { code: "ar", label: dict.language.arabic },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        aria-label={dict.language.label}
        className="flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-neutral-600 transition hover:bg-black/5 dark:text-neutral-300 dark:hover:bg-white/10"
      >
        <Globe className="h-4 w-4" />
        <span className="uppercase">{locale}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute end-0 mt-2 w-36 overflow-hidden rounded-2xl border border-black/5 bg-white p-1.5 shadow-xl dark:border-white/10 dark:bg-neutral-900"
          >
            {options.map((opt) => (
              <button
                key={opt.code}
                onClick={() => {
                  setOpen(false);
                  setLocale(opt.code);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                  locale === opt.code ? "text-indigo-600 dark:text-indigo-400" : ""
                }`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
