// In-memory sliding-window limiter. Good enough for a single-process demo deployment —
// a real multi-instance deployment would back this with Redis or similar shared store.
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function isRateLimited(key: string, limit: number): boolean {
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= Date.now()) return false;
  return bucket.count >= limit;
}

export function recordAttempt(key: string, windowMs: number): void {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }
  bucket.count += 1;
}

export function clearAttempts(key: string): void {
  buckets.delete(key);
}

export function getRequestIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
