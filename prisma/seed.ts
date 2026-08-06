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
    {
      email: "gulfmed@sellers.demo",
      name: "Gulf Med Team",
      storeName: "Gulf Med Supplies",
      description: "Premium health supplements and medical supplies from Dubai Healthcare City.",
      codAvailable: true,
      legalName: "Gulf Med Supplies LLC",
      businessName: "Gulf Med Supplies",
      businessRegNumber: "DHCC-2024-7821",
      idDocumentUrl: "https://example.com/verification/gulfmed-license.pdf",
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
    {
      slug: "glow-vitamin-c-serum",
      name: "Glow Vitamin C Brightening Serum",
      overview: "High-potency 20% vitamin C serum for radiance — 30ml.",
      description:
        "A concentrated 20% L-ascorbic acid serum designed to brighten, protect, and even skin tone. Formulated with niacinamide and ferulic acid for enhanced stability and efficacy. 30ml dropper bottle. Apply 3–5 drops to cleansed face morning and evening.",
      price: 15500,
      category: "Cosmetics",
      subcategory: "Serums",
      image: img("vitamin-c-serum"),
      seller: "HomeHaven",
    },
    {
      slug: "rose-gold-lip-elixir",
      name: "Rose Gold Lip Elixir",
      overview: "Nourishing lip treatment with Bulgarian rose and vitamin E.",
      description:
        "A luxurious lip oil infused with Bulgarian rose extract, vitamin E tocopherol, and jojoba oil for deep hydration and a glossy finish. Non-sticky formula with a soft doe-foot applicator. 10ml.",
      price: 6800,
      category: "Cosmetics",
      subcategory: "Lip Care",
      image: img("rose-lip-elixir"),
      seller: "HomeHaven",
    },
    {
      slug: "argan-shine-hair-oil",
      name: "Argan Shine Hair Oil",
      overview: "Lightweight pure argan oil for frizz control and shine.",
      description:
        "100% pure argan oil enriched with keratin proteins and silk amino acids to tame frizz, add mirror shine, and protect hair from heat up to 230°C. Apply 2–3 drops to damp or dry hair. 100ml pump bottle.",
      price: 9800,
      category: "Cosmetics",
      subcategory: "Hair Care",
      image: img("argan-hair-oil"),
      seller: "HomeHaven",
    },

    // ── WellCare Pharmacy — Additional Medicines ──────────────────────────
    {
      slug: "wellcare-vitamin-c",
      name: "WellCare Vitamin C 1000mg",
      overview: "High-potency Vitamin C effervescent tablets, 60-count.",
      description: "Effervescent vitamin C 1000mg for daily immune support and antioxidant protection. Dissolves in water for rapid absorption. Orange flavour, 60 tablets.",
      price: 3500,
      category: "Medicines",
      subcategory: "Vitamins",
      image: img("wellcare-vitc"),
      seller: "WellCare Pharmacy",
    },
    {
      slug: "wellcare-vitamin-d3",
      name: "WellCare Vitamin D3 5000 IU",
      overview: "Vitamin D3 softgels for bone and immune health, 90-count.",
      description: "High-potency vitamin D3 5000 IU softgels to support bone density, immune function and mood regulation. Micro-encapsulated in olive oil for optimal absorption. 90 softgels.",
      price: 4500,
      category: "Medicines",
      subcategory: "Vitamins",
      image: img("wellcare-vitd3"),
      seller: "WellCare Pharmacy",
    },
    {
      slug: "wellcare-omega3",
      name: "WellCare Omega-3 Fish Oil 1200mg",
      overview: "Concentrated omega-3 EPA & DHA softgels, 60-count.",
      description: "Concentrated fish oil with 1200mg EPA/DHA per serving for heart, brain and joint health. Enteric coated to prevent fishy aftertaste. 60 softgels.",
      price: 5500,
      category: "Medicines",
      subcategory: "Supplements",
      image: img("wellcare-omega3"),
      seller: "WellCare Pharmacy",
    },
    {
      slug: "wellcare-probiotics-50b",
      name: "WellCare Probiotic 50 Billion CFU",
      overview: "Multi-strain probiotic capsules for gut health, 30-count.",
      description: "50 billion CFU probiotic blend with 10 clinically studied strains for digestive balance and immune support. Shelf-stable, no refrigeration required. 30 capsules.",
      price: 6900,
      category: "Medicines",
      subcategory: "Supplements",
      image: img("wellcare-probiotics"),
      seller: "WellCare Pharmacy",
    },
    {
      slug: "wellcare-zinc-immune",
      name: "WellCare Zinc & Elderberry Immune Support",
      overview: "Zinc 50mg with elderberry extract, 60 tablets.",
      description: "Zinc picolinate 50mg combined with elderberry extract and vitamin C for year-round immune resilience. Vegan capsules, 60-count.",
      price: 3200,
      category: "Medicines",
      subcategory: "Vitamins",
      image: img("wellcare-zinc"),
      seller: "WellCare Pharmacy",
    },
    {
      slug: "wellcare-antacid-chewables",
      name: "WellCare Antacid Relief Chewables",
      overview: "Fast-acting calcium carbonate antacid chewables, 72-count.",
      description: "Calcium carbonate 750mg chewable tablets for rapid heartburn and acid indigestion relief. Spearmint flavour. 72-count bottle.",
      price: 2800,
      category: "Medicines",
      subcategory: "Digestive",
      image: img("wellcare-antacid"),
      seller: "WellCare Pharmacy",
    },
    {
      slug: "wellcare-cold-flu-day",
      name: "WellCare Cold & Flu Day Relief",
      overview: "Non-drowsy cold & flu multi-symptom relief, 24 caplets.",
      description: "Relieves fever, congestion, sore throat, headache and body aches. Non-drowsy daytime formula. 24 caplets.",
      price: 4200,
      category: "Medicines",
      subcategory: "Cold & Flu",
      image: img("wellcare-coldflu"),
      seller: "WellCare Pharmacy",
    },

    // ── Gulf Med Supplies — Medicines & Supplements ───────────────────────
    {
      slug: "gulfmed-collagen-peptides",
      name: "Gulf Med Marine Collagen Peptides",
      overview: "Hydrolyzed marine collagen powder with vitamin C, 30 servings.",
      description: "Wild-caught marine collagen peptides with hyaluronic acid and vitamin C for skin elasticity, joint health and hair strength. Unflavored, mixes clear. 300g (30 servings).",
      price: 8900,
      category: "Medicines",
      subcategory: "Supplements",
      image: img("gulfmed-collagen"),
      seller: "Gulf Med Supplies",
      discountPercent: 10,
      promotionLabel: "New Arrival",
    },
    {
      slug: "gulfmed-biotin-10000",
      name: "Gulf Med Biotin 10,000mcg",
      overview: "High-strength biotin for hair, skin & nails, 60 capsules.",
      description: "10,000mcg biotin per capsule to support healthy hair growth, nail strength and radiant skin. Vegan-certified, 60 capsules.",
      price: 4800,
      category: "Medicines",
      subcategory: "Vitamins",
      image: img("gulfmed-biotin"),
      seller: "Gulf Med Supplies",
    },
    {
      slug: "gulfmed-magnesium-glycinate",
      name: "Gulf Med Magnesium Glycinate 400mg",
      overview: "Highly absorbable magnesium for sleep and muscle recovery, 60 capsules.",
      description: "Magnesium glycinate 400mg — the most bioavailable form — for muscle relaxation, restful sleep and stress reduction. Gentle on the stomach. 60 capsules.",
      price: 5200,
      category: "Medicines",
      subcategory: "Supplements",
      image: img("gulfmed-magnesium"),
      seller: "Gulf Med Supplies",
    },
    {
      slug: "gulfmed-melatonin-5mg",
      name: "Gulf Med Melatonin 5mg",
      overview: "Natural sleep support melatonin tablets, 60-count.",
      description: "Melatonin 5mg to help you fall asleep faster and reset your sleep cycle naturally. Non-habit-forming, suitable for jet lag. Cherry flavour, 60 tablets.",
      price: 3500,
      category: "Medicines",
      subcategory: "CNS",
      image: img("gulfmed-melatonin"),
      seller: "Gulf Med Supplies",
    },
    {
      slug: "gulfmed-calcium-d3",
      name: "Gulf Med Calcium + D3 Complex",
      overview: "Calcium carbonate with vitamin D3 for bone density, 90 tablets.",
      description: "500mg calcium with 400 IU vitamin D3 and magnesium for superior bone density support. Ideal for adults over 40. 90 tablets.",
      price: 4200,
      category: "Medicines",
      subcategory: "Vitamins",
      image: img("gulfmed-calcium"),
      seller: "Gulf Med Supplies",
    },
    {
      slug: "gulfmed-iron-complex",
      name: "Gulf Med Gentle Iron + Vitamin C",
      overview: "Ferrous fumarate with vitamin C and B12, 60 capsules.",
      description: "Ferrous fumarate 65mg with vitamin C and B12 for gentle iron supplementation without constipation. Supports healthy hemoglobin and energy levels. 60 capsules.",
      price: 3800,
      category: "Medicines",
      subcategory: "Vitamins",
      image: img("gulfmed-iron"),
      seller: "Gulf Med Supplies",
    },
    {
      slug: "gulfmed-turmeric-curcumin",
      name: "Gulf Med Turmeric Curcumin 95% + BioPerine",
      overview: "High-potency curcumin extract with enhanced absorption, 60 capsules.",
      description: "Turmeric extract standardised to 95% curcuminoids with 5mg BioPerine for 20x enhanced absorption. Anti-inflammatory and antioxidant support. 60 capsules.",
      price: 6500,
      category: "Medicines",
      subcategory: "Supplements",
      image: img("gulfmed-curcumin"),
      seller: "Gulf Med Supplies",
    },

    // ── WellCare Pharmacy — Additional Consumables ────────────────────────
    {
      slug: "wellcare-bp-monitor",
      name: "WellCare Upper Arm Blood Pressure Monitor",
      overview: "Clinically validated automatic BP monitor with 120-reading memory.",
      description: "Clinically validated automatic upper arm blood pressure monitor. Large LCD display, 120-reading memory for two users, irregular heartbeat indicator. Includes cuff, power adapter and carry case.",
      price: 19900,
      category: "Consumables",
      subcategory: "Medical Devices",
      image: img("wellcare-bpmonitor"),
      warrantyMonths: 24,
      seller: "WellCare Pharmacy",
    },
    {
      slug: "wellcare-pulse-oximeter",
      name: "WellCare Fingertip Pulse Oximeter",
      overview: "SpO2, pulse rate & perfusion index monitor.",
      description: "Accurately measures blood oxygen saturation (SpO2), pulse rate and perfusion index within seconds. OLED display, auto power-off. Includes lanyard and batteries.",
      price: 8900,
      category: "Consumables",
      subcategory: "Medical Devices",
      image: img("wellcare-oximeter"),
      warrantyMonths: 12,
      seller: "WellCare Pharmacy",
    },
    {
      slug: "wellcare-glucometer-kit",
      name: "WellCare SmartCheck Glucometer Kit",
      overview: "Complete blood glucose monitoring kit with 50 test strips.",
      description: "Complete diabetes management kit: glucometer, 50 test strips, 50 lancets, lancing device and carrying case. Results in 5 seconds, no coding required.",
      price: 24900,
      category: "Consumables",
      subcategory: "Medical Devices",
      image: img("wellcare-glucometer"),
      warrantyMonths: 12,
      seller: "WellCare Pharmacy",
    },
    {
      slug: "wellcare-electric-toothbrush",
      name: "WellCare SonicPro Electric Toothbrush",
      overview: "Sonic toothbrush with 3 cleaning modes and 2-min timer.",
      description: "Sonic toothbrush with 40,000 strokes per minute, 3 cleaning modes (clean, sensitive, whitening) and built-in 2-minute timer. Includes 2 brush heads and USB charging case.",
      price: 14900,
      category: "Consumables",
      subcategory: "Personal Care",
      image: img("wellcare-toothbrush"),
      warrantyMonths: 24,
      seller: "WellCare Pharmacy",
    },
    {
      slug: "wellcare-hand-sanitizer-500ml",
      name: "WellCare Hand Sanitizer 500ml Pump",
      overview: "70% isopropyl alcohol antibacterial hand sanitizer, 500ml.",
      description: "WHO-approved 70% isopropyl alcohol hand sanitizer. Kills 99.9% of germs without water. Aloe vera infused to prevent dryness. 500ml pump bottle.",
      price: 2500,
      category: "Consumables",
      subcategory: "Personal Care",
      image: img("wellcare-sanitizer"),
      seller: "WellCare Pharmacy",
      stock: 200,
    },
    {
      slug: "wellcare-face-masks-50pk",
      name: "WellCare Medical Face Masks 50-Pack",
      overview: "Type IIR 3-ply disposable medical face masks, 50-count.",
      description: "Type IIR medical-grade 3-ply disposable face masks with fluid resistance. BFE ≥98%. Individually folded, easy to dispense. Pack of 50.",
      price: 3500,
      category: "Consumables",
      subcategory: "Personal Care",
      image: img("wellcare-masks"),
      seller: "WellCare Pharmacy",
      stock: 150,
    },
    {
      slug: "wellcare-smart-scale",
      name: "WellCare SmartScale Digital Body Scale",
      overview: "Ultra-slim tempered glass scale with BMI indicator.",
      description: "Ultra-slim tempered glass digital scale with 0.1kg precision, BMI calculation and large LED display. Supports up to 180kg. Auto-calibrating, step-on platform. 4 AA batteries included.",
      price: 12900,
      category: "Consumables",
      subcategory: "Medical Devices",
      image: img("wellcare-scale"),
      warrantyMonths: 12,
      seller: "WellCare Pharmacy",
    },

    // ── HomeHaven — Additional Cosmetics ──────────────────────────────────
    {
      slug: "homehaven-spf50-sunscreen",
      name: "HomeHaven UltraShield SPF 50+ Sunscreen",
      overview: "Broad-spectrum SPF 50+ PA++++ sunscreen, 75ml.",
      description: "Broad-spectrum UVA/UVB protection SPF 50+ with a lightweight, non-greasy finish. PA++++ rating. Formulated with niacinamide and hyaluronic acid for skin barrier support. 75ml.",
      price: 12900,
      category: "Cosmetics",
      subcategory: "Sun Care",
      image: img("homehaven-sunscreen"),
      seller: "HomeHaven",
      discountPercent: 15,
      promotionLabel: "Best Seller",
    },
    {
      slug: "homehaven-retinol-serum",
      name: "HomeHaven Retinol 0.5% Renewal Serum",
      overview: "Encapsulated retinol serum for fine lines and skin renewal, 30ml.",
      description: "Encapsulated retinol 0.5% with bakuchiol and peptides for visible reduction of fine lines and improved skin texture. Suitable for beginners to retinoids. 30ml dropper.",
      price: 18900,
      category: "Cosmetics",
      subcategory: "Serums",
      image: img("homehaven-retinol"),
      seller: "HomeHaven",
    },
    {
      slug: "homehaven-hyaluronic-serum",
      name: "HomeHaven Triple-Layer Hyaluronic Acid Serum",
      overview: "Multi-weight HA serum for plump, dewy skin, 30ml.",
      description: "Three molecular weights of hyaluronic acid penetrate at different skin layers for full-depth hydration. Ceramides and panthenol strengthen the skin barrier. 30ml.",
      price: 14900,
      category: "Cosmetics",
      subcategory: "Serums",
      image: img("homehaven-ha-serum"),
      seller: "HomeHaven",
    },
    {
      slug: "homehaven-niacinamide-serum",
      name: "HomeHaven Niacinamide 10% + Zinc 1% Serum",
      overview: "Pore-minimising oil-control serum, 30ml.",
      description: "High-strength niacinamide 10% combined with zinc PCA to balance sebum, minimise pores and reduce blemishes. Suitable for oily and combination skin. 30ml.",
      price: 9900,
      category: "Cosmetics",
      subcategory: "Serums",
      image: img("homehaven-niacinamide"),
      seller: "HomeHaven",
    },
    {
      slug: "homehaven-gentle-face-wash",
      name: "HomeHaven Gentle Purifying Face Wash",
      overview: "pH-balanced sulfate-free gel cleanser, 150ml.",
      description: "Sulfate-free gel cleanser with green tea extract, aloe vera and cucumber water. Removes makeup, SPF and impurities without stripping moisture. 150ml pump.",
      price: 6900,
      category: "Cosmetics",
      subcategory: "Cleansers",
      image: img("homehaven-facewash"),
      seller: "HomeHaven",
    },
    {
      slug: "homehaven-overnight-cream",
      name: "HomeHaven Overnight Restore Night Cream",
      overview: "Intensive overnight repair cream with peptides, 50ml.",
      description: "Rich overnight cream with retinal, ceramides and nourishing peptides to repair and restore while you sleep. Wakes skin soft and radiant by morning. 50ml.",
      price: 16900,
      category: "Cosmetics",
      subcategory: "Moisturisers",
      image: img("homehaven-nightcream"),
      seller: "HomeHaven",
    },
    {
      slug: "homehaven-eye-cream",
      name: "HomeHaven De-Puff Eye Cream",
      overview: "Caffeine and vitamin K eye cream for dark circles, 15ml.",
      description: "Cooling caffeine and vitamin K eye cream to reduce dark circles and morning puffiness. With peptides and niacinamide for long-term brightening. 15ml.",
      price: 13900,
      category: "Cosmetics",
      subcategory: "Eye Care",
      image: img("homehaven-eyecream"),
      seller: "HomeHaven",
    },
    {
      slug: "homehaven-silk-body-lotion",
      name: "HomeHaven Silk & Glow Body Lotion",
      overview: "24-hour hydration body lotion with shea and vitamin E, 250ml.",
      description: "Fast-absorbing body lotion with shea butter, vitamin E and almond oil for 24-hour hydration. Suitable for dry to normal skin. Non-greasy finish. 250ml.",
      price: 8900,
      category: "Cosmetics",
      subcategory: "Body Care",
      image: img("homehaven-bodylotion"),
      seller: "HomeHaven",
    },
    {
      slug: "homehaven-botanical-shampoo",
      name: "HomeHaven Botanical Repair Shampoo",
      overview: "Sulfate-free strengthening shampoo for damaged hair, 300ml.",
      description: "Sulfate-free shampoo with keratin proteins, biotin and argan oil to repair, strengthen and add shine. Color-safe formula. 300ml.",
      price: 7900,
      category: "Cosmetics",
      subcategory: "Hair Care",
      image: img("homehaven-shampoo"),
      seller: "HomeHaven",
    },
    {
      slug: "homehaven-hair-mask",
      name: "HomeHaven Intense Hydration Hair Mask",
      overview: "Deeply conditioning hair mask for dry and frizzy hair, 200ml.",
      description: "Intense hair repair mask with shea butter, coconut milk and keratin. Leave on for 10 minutes for silky, frizz-free results. Suitable for all hair types. 200ml.",
      price: 8900,
      category: "Cosmetics",
      subcategory: "Hair Care",
      image: img("homehaven-hairmask"),
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
    {
      slug: "homehaven-spf50-sunscreen",
      user: jordan,
      rating: 5,
      title: "Best sunscreen for UAE sun",
      body: "Lightweight and doesn't leave a white cast — finally a sunscreen I can wear every day.",
    },
    {
      slug: "gulfmed-collagen-peptides",
      user: alex,
      rating: 5,
      title: "Visible difference in 4 weeks",
      body: "My skin looks noticeably firmer and my nails are growing faster. Will keep buying.",
    },
    {
      slug: "wellcare-vitamin-d3",
      user: jordan,
      rating: 4,
      title: "Energy levels improved",
      body: "After 3 months on these my vitamin D went from deficient to optimal. Highly recommend.",
    },
    {
      slug: "wellcare-bp-monitor",
      user: alex,
      rating: 4,
      title: "Accurate and easy to use",
      body: "Compared readings with my doctor's equipment and they matched perfectly. Great device.",
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
  for (const slug of ["nourisil-md", "bloom-skincare-set", "homehaven-spf50-sunscreen", "gulfmed-collagen-peptides"]) {
    if (!productIds[slug]) continue;
    await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId: alex.id, productId: productIds[slug] } },
      update: {},
      create: { userId: alex.id, productId: productIds[slug] },
    });
  }
  for (const slug of ["wellcare-bp-monitor", "homehaven-retinol-serum"]) {
    if (!productIds[slug]) continue;
    await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId: jordan.id, productId: productIds[slug] } },
      update: {},
      create: { userId: jordan.id, productId: productIds[slug] },
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

  console.log(`Seeded 1 admin, ${sellerDefs.length} sellers, ${products.length} products, 2 buyers, ${reviewDefs.length} reviews.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
