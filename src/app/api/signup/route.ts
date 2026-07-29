import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getRequestIp, isRateLimited, recordAttempt } from "@/lib/rate-limit";

const SIGNUP_ATTEMPT_LIMIT = 20;
const SIGNUP_WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: Request) {
  const rateLimitKey = `signup:${getRequestIp(req)}`;
  if (isRateLimited(rateLimitKey, SIGNUP_ATTEMPT_LIMIT)) {
    return NextResponse.json({ error: "Too many signup attempts. Please try again later." }, { status: 429 });
  }
  recordAttempt(rateLimitKey, SIGNUP_WINDOW_MS);

  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required." },
      { status: 400 },
    );
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "An account with that email already exists." },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, passwordHash },
  });

  return NextResponse.json({ ok: true });
}
