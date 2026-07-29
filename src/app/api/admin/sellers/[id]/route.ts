import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

const VALID_STATUSES = ["approved", "rejected", "pending"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ctx = await requireAdmin();
  if (!ctx) {
    return NextResponse.json({ error: "Admin access required." }, { status: 401 });
  }

  const seller = await prisma.seller.findUnique({ where: { id } });
  if (!seller) {
    return NextResponse.json({ error: "Seller not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const status = typeof body?.status === "string" ? body.status : "";
  const notes = typeof body?.notes === "string" ? body.notes.trim() : "";

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  await prisma.seller.update({
    where: { id },
    data: {
      verificationStatus: status,
      verificationNotes: notes || null,
      reviewedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
