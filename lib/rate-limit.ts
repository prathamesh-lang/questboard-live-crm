const globalForRate = globalThis as typeof globalThis & { __questLastCall?: number };
export function assertMcpWindow() {
  const now = Date.now();
  const last = globalForRate.__questLastCall ?? 0;
  const remaining = 60_500 - (now - last);
  if (remaining > 0) return { allowed: false as const, retryAfterMs: remaining };
  globalForRate.__questLastCall = now;
  return { allowed: true as const, retryAfterMs: 0 };
}
