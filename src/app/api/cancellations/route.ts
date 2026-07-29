import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const orderItemId = typeof body?.orderItemId === "string" ? body.orderItemId : "";
  const reason = typeof body?.reason === "string" ? body.reason.trim() : "";

  if (!orderItemId || !reason) {
    return NextResponse.json({ error: "A reason is required." }, { status: 400 });
  }

  const orderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: { order: true },
  });

  if (!orderItem || orderItem.order.userId !== session.user.id) {
    return NextResponse.json({ error: "Order item not found." }, { status: 404 });
  }

  if (orderItem.status !== "processing") {
    return NextResponse.json(
      { error: "This order can no longer be cancelled — it has already shipped." },
      { status: 409 },
    );
  }

  await prisma.$transaction([
    prisma.orderItem.update({
      where: { id: orderItemId },
      data: { status: "cancelled", cancelReason: reason },
    }),
    prisma.product.update({
      where: { id: orderItem.productId },
      data: { stock: { increment: orderItem.quantity } },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
