import { prisma } from "@/lib/prisma";

export type HomepageConfigData = {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta1Text: string;
  heroCta1Link: string;
  heroCta2Text: string;
  heroCta2Link: string;
  heroPromoLabel: string | null;
  heroPromoTag: string | null;
  heroPromoLink: string | null;
  announcementText: string | null;
  announcementLink: string | null;
  announcementColor: string;
  showBestSellers: boolean;
  showNewArrivals: boolean;
  showBrands: boolean;
  showTestimonials: boolean;
  showArticles: boolean;
  showNewsletter: boolean;
  updatedAt: Date;
};

export const HOMEPAGE_DEFAULTS: HomepageConfigData = {
  id: "singleton",
  heroTitle: "Your Health & Beauty Destination",
  heroSubtitle: "Verified sellers. Genuine products. Fast delivery across all 7 Emirates.",
  heroCta1Text: "Shop Now",
  heroCta1Link: "/products",
  heroCta2Text: "Browse Medicines",
  heroCta2Link: "/products?category=Medicines",
  heroPromoLabel: null,
  heroPromoTag: null,
  heroPromoLink: null,
  announcementText: null,
  announcementLink: null,
  announcementColor: "indigo",
  showBestSellers: true,
  showNewArrivals: true,
  showBrands: true,
  showTestimonials: true,
  showArticles: true,
  showNewsletter: true,
  updatedAt: new Date(),
};

export async function getHomepageConfig(): Promise<HomepageConfigData> {
  try {
    const cfg = await prisma.homepageConfig.findUnique({ where: { id: "singleton" } });
    return cfg ?? HOMEPAGE_DEFAULTS;
  } catch {
    return HOMEPAGE_DEFAULTS;
  }
}

export async function getActivePromoBanners() {
  try {
    return await prisma.promoBanner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}
