import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSeller } from "@/lib/require-seller";

const VALID_STATUSES = ["approved", "rejected", "refunded"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await requireSeller();
  if (!ctx) {
    return NextResponse.json({ error: "You must have a seller account." }, { status: 401 });
  }

  const returnRequest = await prisma.returnRequest.findUnique({
    where: { id },
    include: { orderItem: true },
  });
  if (!returnRequest || returnRequest.orderItem.sellerId !== ctx.seller.id) {
    return NextResponse.json({ error: "Return request not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const status = typeof body?.status === "string" ? body.status : "";
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  await prisma.returnRequest.update({ where: { id }, data: { status } });

  const itemStatus =
    status === "rejected" ? "delivered" : status === "refunded" ? "refunded" : "return_approved";
  await prisma.orderItem.update({
    where: { id: returnRequest.orderItemId },
    data: { status: itemStatus },
  });

  return NextResponse.json({ ok: true });
}
