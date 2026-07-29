import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ids = (searchParams.get("ids") ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 100);

  if (ids.length === 0) {
    return NextResponse.json({ stock: {} });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: { id: true, stock: true },
  });

  const stock = Object.fromEntries(products.map((p) => [p.id, p.stock]));
  return NextResponse.json({ stock });
}
