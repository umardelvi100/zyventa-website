import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/require-seller";
import { slugify } from "@/lib/slug";
import { isRegulatedCategory } from "@/lib/regulated-categories";

export async function POST(req: Request) {
  const ctx = await requireSeller();
  if (!ctx) {
    return NextResponse.json({ error: "You must have a seller account." }, { status: 401 });
  }
  if (ctx.seller.verificationStatus !== "approved") {
    return NextResponse.json(
      { error: "Your seller account must be verified before you can list products." },
      { status: 403 },
    );
  }

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const overview = typeof body?.overview === "string" ? body.overview.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const category = typeof body?.category === "string" ? body.category.trim() : "";
  const image = typeof body?.image === "string" ? body.image.trim() : "";
  const price = Math.round(Number(body?.price) * 100);
  const stock = Number.isFinite(Number(body?.stock)) ? Math.max(0, Math.round(Number(body.stock))) : 50;
  const warrantyMonths =
    body?.warrantyMonths !== undefined && body?.warrantyMonths !== null && body.warrantyMonths !== ""
      ? Math.max(0, Math.round(Number(body.warrantyMonths)))
      : null;
  const discountPercent =
    body?.discountPercent !== undefined && body?.discountPercent !== null && body.discountPercent !== ""
      ? Math.min(90, Math.max(1, Math.round(Number(body.discountPercent))))
      : null;
  const promotionLabel = typeof body?.promotionLabel === "string" && body.promotionLabel.trim()
    ? body.promotionLabel.trim()
    : null;
  const promotionEndsAt = body?.promotionEndsAt ? new Date(body.promotionEndsAt) : null;

  if (!name || !overview || !description || !category || !image || !price || price <= 0) {
    return NextResponse.json({ error: "All required product fields must be filled in." }, { status: 400 });
  }

  if (isRegulatedCategory(category) && !ctx.seller.regulatoryDocUrl) {
    return NextResponse.json(
      {
        error: `Listing ${category} products requires a government/regulatory approval document. Add one from your seller dashboard first.`,
      },
      { status: 403 },
    );
  }

  let slug = slugify(name);
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Math.random().toString(36).slice(2, 7)}`;

  const product = await prisma.product.create({
    data: {
      slug,
      name,
      overview,
      description,
      category,
      image,
      price,
      stock,
      warrantyMonths,
      discountPercent,
      promotionLabel: discountPercent ? promotionLabel : null,
      promotionEndsAt: discountPercent ? promotionEndsAt : null,
      sellerId: ctx.seller.id,
    },
  });

  return NextResponse.json({ id: product.id, slug: product.slug });
}
