"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function updateHeroConfigAction(formData: FormData): Promise<void> {
  const str = (key: string) => ((formData.get(key) as string) ?? "").trim() || null;
  const strReq = (key: string, fallback: string) =>
    ((formData.get(key) as string) ?? "").trim() || fallback;
  const bool = (key: string) => formData.get(key) === "on";

  const data = {
    heroTitle: strReq("heroTitle", "Your Health & Beauty Destination"),
    heroSubtitle: strReq("heroSubtitle", ""),
    heroCta1Text: strReq("heroCta1Text", "Shop Now"),
    heroCta1Link: strReq("heroCta1Link", "/products"),
    heroCta2Text: strReq("heroCta2Text", ""),
    heroCta2Link: strReq("heroCta2Link", ""),
    heroPromoLabel: str("heroPromoLabel"),
    heroPromoTag: str("heroPromoTag"),
    heroPromoLink: str("heroPromoLink"),
    announcementText: str("announcementText"),
    announcementLink: str("announcementLink"),
    announcementColor: strReq("announcementColor", "indigo"),
    showBestSellers: bool("showBestSellers"),
    showNewArrivals: bool("showNewArrivals"),
    showBrands: bool("showBrands"),
    showTestimonials: bool("showTestimonials"),
    showArticles: bool("showArticles"),
    showNewsletter: bool("showNewsletter"),
  };

  await prisma.homepageConfig.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...data },
    update: data,
  });

  revalidatePath("/");
  redirect("/admin/homepage/hero");
}

export async function createBannerAction(formData: FormData): Promise<void> {
  const str = (key: string) => ((formData.get(key) as string) ?? "").trim();
  await prisma.promoBanner.create({
    data: {
      name: str("name") || "New Banner",
      tag: str("tag") || null,
      title: str("title") || "Big Sale",
      subtitle: str("subtitle") || null,
      ctaText: str("ctaText") || "Shop Now",
      ctaLink: str("ctaLink") || "/products",
      bgFrom: str("bgFrom") || "#6366f1",
      bgTo: str("bgTo") || "#f97316",
      isActive: formData.get("isActive") === "on",
      sortOrder: parseInt(str("sortOrder") || "0", 10) || 0,
    },
  });
  revalidatePath("/");
  revalidatePath("/admin/homepage/banners");
  redirect("/admin/homepage/banners");
}

export async function toggleBannerAction(id: string, isActive: boolean): Promise<void> {
  await prisma.promoBanner.update({ where: { id }, data: { isActive } });
  revalidatePath("/");
  revalidatePath("/admin/homepage/banners");
}

export async function deleteBannerAction(id: string): Promise<void> {
  await prisma.promoBanner.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/admin/homepage/banners");
}
