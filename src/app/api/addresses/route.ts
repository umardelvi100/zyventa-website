import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const label = typeof body?.label === "string" ? body.label.trim() : "";
  const fullName = typeof body?.fullName === "string" ? body.fullName.trim() : "";
  const line1 = typeof body?.line1 === "string" ? body.line1.trim() : "";
  const city = typeof body?.city === "string" ? body.city.trim() : "";
  const state = typeof body?.state === "string" ? body.state.trim() : "";
  const zip = typeof body?.zip === "string" ? body.zip.trim() : "";
  const isDefault = Boolean(body?.isDefault);

  if (!label || !fullName || !line1 || !city || !zip) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
  }

  const existingCount = await prisma.address.count({ where: { userId: session.user.id } });

  const address = await prisma.address.create({
    data: {
      userId: session.user.id,
      label,
      fullName,
      line1,
      city,
      state: state || null,
      zip,
      isDefault: isDefault || existingCount === 0,
    },
  });

  return NextResponse.json({ id: address.id });
}
