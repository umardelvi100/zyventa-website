import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const img = (seed: string) => `https://picsum.photos/seed/${seed}/600/600`;

async function main() {
  console.log("Seeding...");
  const passwordHash = await bcrypt.hash("password123", 10);
  const now = new Date();
  const daysAgo = (n: number) => new Date(now.getTime() - n * 24 * 60 * 60 * 1000);

  // --- Admin account ---
  await prisma.user.upsert({
    where: { email: "admin@zyventa.demo" },
    update: { name: "Zyventa Admin", passwordHash, isAdmin: true },
    create: { name: "Zyventa Admin", email: "admin@zyventa.demo", passwordHash, isAdmin: true },
  });

  // --- Sellers (each backed by a user account), already verified ---
  const sellerDefs: {
    email: string;
    name: string;
    storeName: string;
    description: string;
    codAvailable: boolean;
    legalName?: string;
    businessName?: string;
    businessRegNumber?: string;
    idDocumentUrl?: string;
  }[] = [
    {
      email: "contact@zyventa.com",
      name: "Zyventa Team",
      storeName: "Zyventa",
      description:
        "Zyventa is a Dubai-based healthcare partner bringing botanical and clinical formulations to the UAE — from scar care to nervous-system support. Office 2211, Al Rehan Block, Omniyat Building, Al Mamzar, Dubai — UAE.",
      codAvailable: true,
      businessName: "Zyventa",
    },
    {
      email: "wellcare-pharmacy@sellers.demo",
      name: "WellCare Pharmacy Team",
      storeName: "WellCare Pharmacy",
      description: "Everyday over-the-counter health and wellness products.",
      codAvailable: true,
      legalName: "WellCare Pharmacy LLC",
      businessName: "WellCare Pharmacy",
      businessRegNumber: "MOH-55210",
      idDocumentUrl: "https://example.com/verification/wellcare-pharmacy-license.pdf",
    },
    {
      email: "home-haven@sellers.demo",
      name: "HomeHaven Team",
      storeName: "HomeHaven",
      description: "Skincare and self-care cosmetics.",
      codAvailable: false,
      legalName: "HomeHaven Home Goods LLC",
      businessName: "HomeHaven",
      businessRegNumber: "DED-129944",
      idDocumentUrl: "https://example.com/verification/homehaven-trade-license.pdf",
    },
  ];

  const sellers: Record<string, string> = {};

  for (const s of sellerDefs) {
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: { name: s.name, passwordHash },
      create: { name: s.name, email: s.email, passwordHash },
    });
    const seller = await prisma.seller.upsert({
      where: { userId: user.id },
      update: {
        storeName: s.storeName,
        description: s.description,
        codAvailable: s.codAvailable,
        legalName: s.legalName,
        businessName: s.businessName,
        businessRegNumber: s.businessRegNumber,
        idDocumentUrl: s.idDocumentUrl,
        verificationStatus: "approved",
        submittedAt: daysAgo(14),
        reviewedAt: daysAgo(13),
      },
      create: {
        userId: user.id,
        storeName: s.storeName,
        description: s.description,
        codAvailable: s.codAvailable,
        legalName: s.legalName,
        businessName: s.businessName,
        businessRegNumber: s.businessRegNumber,
        idDocumentUrl: s.idDocumentUrl,
        verificationStatus: "approved",
        submittedAt: daysAgo(14),
        reviewedAt: daysAgo(13),
      },
    });
    sellers[s.storeName] = seller.id;
  }

  // Prices are stored in fils (1 AED = 100 fils), same integer-cents pattern as before.
  // Only three top-level categories exist on the storefront: Medicines, Cosmetics, Consumables.
  const products = [
    // Zyventa — real product catalog (Medicines)
    {
      slug: "nourisil-md",
      name: "Nourisil MD",
      overview: "Silicone scar gel — medical-grade, 30g tube.",
      description:
        "A medical-grade silicone gel that creates an optimal environment for scar management, helping improve the appearance of scars for smoother, healthier-looking skin. Fragrance-free, non-greasy finish. For surgical, keloid and acne scarring. Available in 10g and 30g tubes.",
      price: 14900,
      category: "Medicines",
      subcategory: "Derma",
      image: img("nourisil-md"),
      seller: "Zyventa",
    },
    {
      slug: "calmi-relax",
      name: "Calmi Relax",
      overview: "Herbal CNS support tablets — 30 tablets.",
      description:
        "A herbal formula combining Valerian, Golden Root, Hawthorn, Passiflora and Magnesium Citrate to support the central nervous system and everyday calm. 30 tablets in two blister packs of 15. Valerian Extract standardised to 0.25% Valerenic Acid, Golden Root Extract to 3% Rosavin, Hawthorn Extract to 15% Procyanidins, Passiflora Incarnata Extract to 3.5% Flavonoids.",
      price: 8900,
      category: "Medicines",
      subcategory: "CNS",
      image: img("calmi-relax"),
      seller: "Zyventa",
    },
    {
      slug: "lipinerve",
      name: "Dr.WellMe Lipinerve",
      overview: "R-alpha lipoic acid supplement — 30 capsules.",
      description:
        "An R-alpha lipoic acid (300mg) dietary supplement, commonly suggested to support patients managing diabetic neuropathic discomfort. 30 capsules per pack, well-characterised safety record. Card or digital payment only — clinical-use supplement.",
      price: 11900,
      category: "Medicines",
      subcategory: "CNS",
      image: img("lipinerve"),
      seller: "Zyventa",
      codOverride: false,
    },
    {
      slug: "troximetacin-gel",
      name: "Troximetacin Gel",
      overview: "Orthopedic relief gel — 40g tube.",
      description:
        "A therapeutic gel combining Indomethacin and Troxerutin, formulated for targeted relief of joint pain, inflammation and swelling. 40g tube, topical application, for orthopedic pain and inflammation.",
      price: 4500,
      category: "Medicines",
      subcategory: "Ortho",
      image: img("troximetacin"),
      seller: "Zyventa",
    },
    {
      slug: "calmivenal-gel",
      name: "Calmivenal Gel",
      overview: "Hemorrhoidal relief gel — with applicator.",
      description:
        "Relieves the irritation, itching, burning and swelling that accompany hemorrhoidal occurrence, with an applicator included for ease of use. Synergistic flavonoid and tannin formula that reduces swelling, stops bleeding, and protects against infection. For external use only.",
      price: 6500,
      category: "Medicines",
      subcategory: "Vascular",
      image: img("calmivenal"),
      seller: "Zyventa",
    },
    {
      slug: "calmi-dormin",
      name: "Calmi Dormin",
      overview: "Restful sleep tablets — 30 tablets.",
      description:
        "A calming blend of Valerian, Lemon Balm and Linden Flower extracts, crafted to support restful sleep and peaceful days. 30 tablets in two blister packs of 15. Standardised botanical actives, non-habit-forming herbal formula.",
      price: 8900,
      category: "Medicines",
      subcategory: "CNS",
      image: img("calmi-dormin"),
      seller: "Zyventa",
    },
    {
      slug: "nevral-tablets",
      name: "Nevral Tablets",
      overview: "Nerve health formula — 30 tablets.",
      description:
        "A neuroprotection formula combining Quercetin, Alpha Lipoic Acid, L-Carnitine L-Tartrate and B-vitamins (Folic Acid, B1, B12) to support nerve health. 30 tablets in three blister packs of 10. Card or digital payment only — clinical-use supplement.",
      price: 9900,
      category: "Medicines",
      subcategory: "CNS",
      image: img("nevral"),
      seller: "Zyventa",
      codOverride: false,
    },
    {
      slug: "brainwell",
      name: "Dr.WellMe BrainWell",
      overview: "Cognitive support capsules — 30 capsules.",
      description:
        "An enhanced brain formula scientifically developed with premium ingredients to support cognitive performance. 30 capsules per pack, for daily brain wellness support.",
      price: 12900,
      category: "Medicines",
      subcategory: "CNS",
      image: img("brainwell"),
      seller: "Zyventa",
    },

    // WellCare Pharmacy — Medicines
    {
      slug: "wellcare-daily-multivitamin",
      name: "WellCare Daily Multivitamin Gummies",
      overview: "Adult daily multivitamin gummies, 60-day supply.",
      description:
        "Daily multivitamin gummies with essential vitamins A, C, D, and E to support everyday wellness. 60-day supply. Consult your doctor before starting any new supplement.",
      price: 5500,
      category: "Medicines",
      image: img("wellcare-multivitamin"),
      seller: "WellCare Pharmacy",
    },
    {
      slug: "wellcare-pain-relief-tablets",
      name: "WellCare Pain Relief Tablets",
      overview: "Fast-acting pain relief tablets, 100-count.",
      description:
        "Fast-acting over-the-counter pain relief tablets for headaches, minor aches, and fever. 100-count bottle. Read label and consult a pharmacist before use.",
      price: 3300,
      category: "Medicines",
      image: img("wellcare-pain-relief"),
      seller: "WellCare Pharmacy",
    },
    {
      slug: "wellcare-allergy-relief",
      name: "WellCare Allergy Relief Tablets",
      overview: "Non-drowsy 24-hour allergy relief, 30-count.",
      description:
        "Non-drowsy 24-hour allergy relief tablets for seasonal sniffles and sneezing. 30-count box. Consult a physician if symptoms persist.",
      price: 4400,
      category: "Medicines",
      image: img("wellcare-allergy"),
      seller: "WellCare Pharmacy",
    },

    // WellCare Pharmacy — Consumables
    {
      slug: "wellcare-digital-thermometer",
      name: "WellCare Digital Thermometer",
      overview: "Fast 10-second oral/underarm digital thermometer.",
      description:
        "Digital thermometer with a fast 10-second reading, flexible tip, and fever alert beep. Suitable for oral, underarm, or rectal use.",
      price: 5900,
      category: "Consumables",
      image: img("wellcare-thermometer"),
      warrantyMonths: 12,
      seller: "WellCare Pharmacy",
    },
    {
      slug: "wellcare-first-aid-kit",
      name: "WellCare First Aid Kit Essentials",
      overview: "100-piece first aid kit for home and travel.",
      description:
        "A 100-piece first aid kit with bandages, antiseptic wipes, gauze, and tape — compact enough for a glovebox or travel bag.",
      price: 9200,
      category: "Consumables",
      image: img("wellcare-firstaid"),
      seller: "WellCare Pharmacy",
    },

    // HomeHaven — Cosmetics
    {
      slug: "bloom-skincare-set",
      name: "Bloom Skincare Starter Set",
      overview: "Cleanser, serum, and moisturizer trio.",
      description:
        "Cleanser, serum, and moisturizer trio formulated with vitamin C and hyaluronic acid.",
      price: 22000,
      category: "Cosmetics",
      image: img("bloom-skincare"),
      seller: "HomeHaven",
    },
    {
      slug: "mist-facial-toner",
      name: "Mist Hydrating Facial Toner",
      overview: "Alcohol-free toner with rosewater and aloe.",
      description: "Alcohol-free toner with rosewater and aloe to refresh and balance skin.",
      price: 7300,
      category: "Cosmetics",
      image: img("mist-toner"),
      seller: "HomeHaven",
    },
  ];

  const productIds: Record<string, string> = {};

  for (const p of products) {
    const { seller, ...data } = p;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...data, sellerId: sellers[seller] },
      create: { ...data, sellerId: sellers[seller] },
    });
    productIds[p.slug] = product.id;
  }

  // --- Demo buyers ---
  const alex = await prisma.user.upsert({
    where: { email: "alex@example.com" },
    update: { name: "Alex Morgan", passwordHash },
    create: { name: "Alex Morgan", email: "alex@example.com", passwordHash },
  });
  const jordan = await prisma.user.upsert({
    where: { email: "jordan@example.com" },
    update: { name: "Jordan Lee", passwordHash },
    create: { name: "Jordan Lee", email: "jordan@example.com", passwordHash },
  });

  await prisma.address.upsert({
    where: { id: "seed-address-alex" },
    update: {},
    create: {
      id: "seed-address-alex",
      userId: alex.id,
      label: "Home",
      fullName: "Alex Morgan",
      line1: "Marina Crown Tower, Apt 1204, Dubai Marina",
      city: "Dubai",
      state: "Dubai",
      zip: "00000",
      country: "United Arab Emirates",
      isDefault: true,
    },
  });

  // --- Reviews ---
  const reviewDefs = [
    {
      slug: "nourisil-md",
      user: alex,
      rating: 5,
      title: "Scar faded noticeably",
      body: "Been using it twice a day for six weeks and the scar is much less noticeable. No irritation at all.",
    },
    {
      slug: "calmi-relax",
      user: jordan,
      rating: 4,
      title: "Helps me wind down",
      body: "Noticeably calmer in the evenings, no grogginess the next morning.",
    },
    {
      slug: "brainwell",
      user: alex,
      rating: 5,
      title: "Sharper focus",
      body: "Took a few weeks to notice, but my focus during long work sessions has improved.",
    },
    {
      slug: "wellcare-daily-multivitamin",
      user: alex,
      rating: 4,
      title: "Easy to take daily",
      body: "Taste is good and I've noticed more consistent energy since starting these.",
    },
    {
      slug: "bloom-skincare-set",
      user: jordan,
      rating: 5,
      title: "Great starter set",
      body: "Skin feels noticeably more hydrated within the first week of using all three together.",
    },
  ];

  for (const r of reviewDefs) {
    await prisma.review.upsert({
      where: { userId_productId: { userId: r.user.id, productId: productIds[r.slug] } },
      update: { rating: r.rating, title: r.title, body: r.body },
      create: {
        userId: r.user.id,
        productId: productIds[r.slug],
        rating: r.rating,
        title: r.title,
        body: r.body,
      },
    });
  }

  // --- Wishlist ---
  for (const slug of ["nourisil-md", "bloom-skincare-set"]) {
    await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId: alex.id, productId: productIds[slug] } },
      update: {},
      create: { userId: alex.id, productId: productIds[slug] },
    });
  }

  // --- Sample order for Alex, one shipped item + one processing item ---
  const existingOrder = await prisma.order.findFirst({ where: { id: "seed-order-alex-1" } });
  if (!existingOrder) {
    const scarGel = products.find((p) => p.slug === "nourisil-md")!;
    const painRelief = products.find((p) => p.slug === "wellcare-pain-relief-tablets")!;
    await prisma.order.create({
      data: {
        id: "seed-order-alex-1",
        userId: alex.id,
        paymentMethod: "card",
        total: scarGel.price + painRelief.price,
        shippingName: "Alex Morgan",
        shippingAddress: "Marina Crown Tower, Apt 1204, Dubai Marina",
        shippingCity: "Dubai",
        shippingZip: "00000",
        items: {
          create: [
            {
              productId: productIds["nourisil-md"],
              sellerId: sellers["Zyventa"],
              name: scarGel.name,
              price: scarGel.price,
              quantity: 1,
              status: "shipped",
            },
            {
              productId: productIds["wellcare-pain-relief-tablets"],
              sellerId: sellers["WellCare Pharmacy"],
              name: painRelief.name,
              price: painRelief.price,
              quantity: 1,
              status: "processing",
            },
          ],
        },
      },
    });
  }

  console.log(`Seeded 1 admin, ${sellerDefs.length} sellers, ${products.length} products, 2 buyers.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
