const COOLDOWN_MS = 65_000;

interface RateState {
  lastCall: number;
  inFlight: boolean;
}

const globalForRate = globalThis as typeof globalThis & { __questRateState?: RateState };

if (!globalForRate.__questRateState) {
  globalForRate.__questRateState = {
    lastCall: 0,
    inFlight: false
  };
}

export function assertMcpWindow(): { allowed: true; retryAfterMs: 0 } | { allowed: false; retryAfterMs: number; reason: string } {
  const state = globalForRate.__questRateState!;
  const now = Date.now();

  // Prevent overlapping concurrent requests
  if (state.inFlight) {
    return {
      allowed: false,
      retryAfterMs: 5_000,
      reason: "An MCP request is already in flight. Concurrent requests are prohibited."
    };
  }

  const elapsed = now - state.lastCall;
  const remaining = COOLDOWN_MS - elapsed;

  if (remaining > 0) {
    return {
      allowed: false,
      retryAfterMs: Math.max(1000, remaining),
      reason: `Rate limit: wait ${Math.ceil(remaining / 1000)}s before next MCP request (minimum 65s window).`
    };
  }

  // Reserve the window
  state.inFlight = true;
  state.lastCall = now;

  return { allowed: true, retryAfterMs: 0 };
}

export function releaseMcpWindow() {
  const state = globalForRate.__questRateState!;
  state.inFlight = false;
  state.lastCall = Date.now();
}
