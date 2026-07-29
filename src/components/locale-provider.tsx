"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getDictionary, type Dictionary, type Locale } from "@/lib/i18n/translations";

type LocaleContextValue = {
  locale: Locale;
  dir: "ltr" | "rtl";
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    document.cookie = `locale=${next}; path=/; max-age=31536000`;
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
    router.refresh();
  };

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      dir: locale === "ar" ? "rtl" : "ltr",
      dict: getDictionary(locale),
      setLocale,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}
