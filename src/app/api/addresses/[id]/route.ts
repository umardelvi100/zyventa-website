import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const address = await prisma.address.findUnique({ where: { id } });
  if (!address || address.userId !== session.user.id) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);

  if (body?.setDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
    await prisma.address.update({ where: { id }, data: { isDefault: true } });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "No changes provided." }, { status: 400 });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const address = await prisma.address.findUnique({ where: { id } });
  if (!address || address.userId !== session.user.id) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }

  await prisma.address.delete({ where: { id } });

  if (address.isDefault) {
    const next = await prisma.address.findFirst({ where: { userId: session.user.id } });
    if (next) {
      await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }
  }

  return NextResponse.json({ ok: true });
}
