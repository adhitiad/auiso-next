// In-memory rate limiter sederhana untuk Next.js Route Handlers
// Catatan: Ini hanya bekerja dengan baik di lingkungan single-instance.
// Untuk produksi dengan Vercel (serverless/edge), disarankan menggunakan Redis (Upstash).

type RateLimitStore = {
  [key: string]: {
    count: number;
    resetTime: number;
  };
};

const store: RateLimitStore = {};

export async function checkRateLimit(
  key: string,
  options: { maxRequests: number; windowSeconds: number }
): Promise<{ allowed: boolean }> {
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;

  if (!store[key]) {
    store[key] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return { allowed: true };
  }

  const record = store[key];

  if (now > record.resetTime) {
    // Reset window
    record.count = 1;
    record.resetTime = now + windowMs;
    return { allowed: true };
  }

  record.count++;

  if (record.count > options.maxRequests) {
    return { allowed: false };
  }

  return { allowed: true };
}
