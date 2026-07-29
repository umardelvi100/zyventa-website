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
  const issue = typeof body?.issue === "string" ? body.issue.trim() : "";

  if (!orderItemId || !issue) {
    return NextResponse.json({ error: "Please describe the issue." }, { status: 400 });
  }

  const orderItem = await prisma.orderItem.findUnique({
    where: { id: orderItemId },
    include: { order: true, warrantyClaims: true },
  });

  if (!orderItem || orderItem.order.userId !== session.user.id) {
    return NextResponse.json({ error: "Order item not found." }, { status: 404 });
  }

  if (!orderItem.warrantyMonths) {
    return NextResponse.json({ error: "This item has no warranty coverage." }, { status: 400 });
  }

  if (orderItem.warrantyClaims.some((c) => c.status === "submitted" || c.status === "approved")) {
    return NextResponse.json({ error: "A warranty claim is already open for this item." }, { status: 409 });
  }

  const claim = await prisma.warrantyClaim.create({
    data: { orderItemId, issue },
  });

  return NextResponse.json({ id: claim.id });
}
