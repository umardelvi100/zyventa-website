-- CreateTable
CREATE TABLE "HomepageConfig" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "heroTitle" TEXT NOT NULL DEFAULT 'Your Health & Beauty Destination',
    "heroSubtitle" TEXT NOT NULL DEFAULT 'Verified sellers. Genuine products. Fast delivery across all 7 Emirates.',
    "heroCta1Text" TEXT NOT NULL DEFAULT 'Shop Now',
    "heroCta1Link" TEXT NOT NULL DEFAULT '/products',
    "heroCta2Text" TEXT NOT NULL DEFAULT 'Browse Medicines',
    "heroCta2Link" TEXT NOT NULL DEFAULT '/products?category=Medicines',
    "heroPromoLabel" TEXT,
    "heroPromoTag" TEXT,
    "heroPromoLink" TEXT,
    "announcementText" TEXT,
    "announcementLink" TEXT,
    "announcementColor" TEXT NOT NULL DEFAULT 'indigo',
    "showBestSellers" BOOLEAN NOT NULL DEFAULT true,
    "showNewArrivals" BOOLEAN NOT NULL DEFAULT true,
    "showBrands" BOOLEAN NOT NULL DEFAULT true,
    "showTestimonials" BOOLEAN NOT NULL DEFAULT true,
    "showArticles" BOOLEAN NOT NULL DEFAULT true,
    "showNewsletter" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PromoBanner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "tag" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "ctaText" TEXT NOT NULL DEFAULT 'Shop Now',
    "ctaLink" TEXT NOT NULL,
    "bgFrom" TEXT NOT NULL DEFAULT '#6366f1',
    "bgTo" TEXT NOT NULL DEFAULT '#f97316',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
