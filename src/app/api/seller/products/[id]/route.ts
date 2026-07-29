import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/require-seller";
import { isRegulatedCategory } from "@/lib/regulated-categories";

// Editing an existing listing never re-triggers the regulatory-doc gate — only
// switching it into a regulated category for the first time should require one.

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await requireSeller();
  if (!ctx) {
    return NextResponse.json({ error: "You must have a seller account." }, { status: 401 });
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || product.sellerId !== ctx.seller.id) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const overview = typeof body?.overview === "string" ? body.overview.trim() : "";
  const description = typeof body?.description === "string" ? body.description.trim() : "";
  const category = typeof body?.category === "string" ? body.category.trim() : "";
  const image = typeof body?.image === "string" ? body.image.trim() : "";
  const price = Math.round(Number(body?.price) * 100);
  const stock = Number.isFinite(Number(body?.stock)) ? Math.max(0, Math.round(Number(body.stock))) : product.stock;
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

  const movingIntoRegulatedCategory = isRegulatedCategory(category) && category !== product.category;
  if (movingIntoRegulatedCategory && !ctx.seller.regulatoryDocUrl) {
    return NextResponse.json(
      {
        error: `Moving a listing into ${category} requires a government/regulatory approval document. Add one from your seller dashboard first.`,
      },
      { status: 403 },
    );
  }

  await prisma.product.update({
    where: { id },
    data: {
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
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await requireSeller();
  if (!ctx) {
    return NextResponse.json({ error: "You must have a seller account." }, { status: 401 });
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || product.sellerId !== ctx.seller.id) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const orderItemCount = await prisma.orderItem.count({ where: { productId: id } });
  if (orderItemCount > 0) {
    return NextResponse.json(
      { error: "This product has existing orders and can't be deleted. Consider setting stock to 0 instead." },
      { status: 409 },
    );
  }

  await prisma.wishlistItem.deleteMany({ where: { productId: id } });
  await prisma.review.deleteMany({ where: { productId: id } });
  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
