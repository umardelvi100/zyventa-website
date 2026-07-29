import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isValidReturnReason } from "@/lib/return-reasons";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const orderItemId = typeof body?.orderItemId === "string" ? body.orderItemId : "";
  const reason = typeof body?.reason === "string" ? body.reason.trim() : "";
  const details = typeof body?.details === "string" ? body.details.trim() : "";
  const images: string[] = Array.isArray(body?.images)
    ? body.images.filter((u: unknown): u is string => typeof u === "string" && u.startsWith("/uploads/returns/"))
    : [];

  if (!orderItemId || !reason) {
    return NextResponse.json({ error: "Please choose a reason for the return." }, { status: 400 });
  }
  if (!isValidReturnReason(reason)) {
    return NextResponse.json({ error: "Please choose a valid reason from the list." }, { status: 400 });
  }

  const orderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: { order: true, returns: true },
  });

  if (!orderItem || orderItem.order.userId !== session.user.id) {
    return NextResponse.json({ error: "Order item not found." }, { status: 404 });
  }

  if (orderItem.status !== "delivered") {
    return NextResponse.json(
      { error: "Returns can only be requested after an order has been delivered." },
      { status: 409 },
    );
  }

  if (orderItem.returns.some((r) => r.status !== "rejected")) {
    return NextResponse.json({ error: "A return is already in progress for this item." }, { status: 409 });
  }

  const returnRequest = await prisma.returnRequest.create({
    data: {
      orderItemId,
      reason,
      details: details || null,
      images: { create: images.map((url) => ({ url })) },
    },
  });
  await prisma.orderItem.update({
    where: { id: orderItemId },
    data: { status: "return_requested" },
  });

  return NextResponse.json({ id: returnRequest.id });
}
