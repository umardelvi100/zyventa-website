import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isRateLimited, recordAttempt } from "@/lib/rate-limit";

const MAX_FILES = 4;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const UPLOAD_LIMIT = 30;
const UPLOAD_WINDOW_MS = 60 * 60 * 1000;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 });
  }

  const rateLimitKey = `upload:${session.user.id}`;
  if (isRateLimited(rateLimitKey, UPLOAD_LIMIT)) {
    return NextResponse.json({ error: "Too many uploads. Please try again later." }, { status: 429 });
  }
  recordAttempt(rateLimitKey, UPLOAD_WINDOW_MS);

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const files = formData.getAll("images").filter((f): f is File => f instanceof File);
  if (files.length === 0) {
    return NextResponse.json({ error: "No images provided." }, { status: 400 });
  }
  if (files.length > MAX_FILES) {
    return NextResponse.json({ error: `You can upload up to ${MAX_FILES} images.` }, { status: 400 });
  }

  for (const file of files) {
    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, or GIF images are allowed." },
        { status: 400 },
      );
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: "Each image must be 5MB or smaller." }, { status: 400 });
    }
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads", "returns");
  await mkdir(uploadDir, { recursive: true });

  const urls: string[] = [];
  for (const file of files) {
    const ext = ALLOWED_TYPES[file.type];
    const filename = `${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);
    urls.push(`/uploads/returns/${filename}`);
  }

  return NextResponse.json({ urls });
}
