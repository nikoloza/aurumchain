export const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
export const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
export const MAX_REQUESTS = 30; // 30 requests per minute by default

/**
 * Basic in-memory IP rate limiter for API routes.
 * (Note: In a true multi-server production environment, use Redis/Upstash instead of memory).
 */
export function isRateLimited(ip: string, maxRequests = MAX_REQUESTS, windowMs = RATE_LIMIT_WINDOW_MS): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  if (record.count >= maxRequests) {
    return true;
  }
  
  record.count += 1;
  return false;
}
