import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { prisma } from "@/lib/prisma";
import { getLocale } from "@/lib/i18n/get-locale";
import { LocaleProvider } from "@/components/locale-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "Zyventa — Shop things you'll actually love",
  description: "Zyventa online store — pharmacy and healthcare products across the UAE.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [products, locale] = await Promise.all([
    prisma.product.findMany({
      select: { category: true, subcategory: true },
      orderBy: [{ category: "asc" }, { subcategory: "asc" }],
    }),
    getLocale(),
  ]);

  const categoryMap = new Map<string, Set<string>>();
  for (const p of products) {
    if (!categoryMap.has(p.category)) categoryMap.set(p.category, new Set());
    if (p.subcategory) categoryMap.get(p.category)!.add(p.subcategory);
  }
  const categories = Array.from(categoryMap.entries()).map(([name, subs]) => ({
    name,
    subcategories: Array.from(subs),
  }));

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LocaleProvider initialLocale={locale}>
          <Providers>
            <Navbar categories={categories} />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </LocaleProvider>
      </body>
    </html>
  );
}
